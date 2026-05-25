"use client";

import { CSSProperties, KeyboardEvent, useState } from "react";
import { CalendarClock, GripVertical, Lock, MoreVertical, Pencil, Tag, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/Checkbox";
import { TaskEditor } from "./TaskEditor";
import { usePreferences } from "@/hooks/usePreferences";
import { playTaskDoneSound } from "@/lib/sound";
import { useI18n } from "@/hooks/useI18n";
import type { Task, UpdateTaskInput } from "@/types/task";

const priorityClass = {
  low: "border-transparent bg-transparent px-0 text-zinc-600",
  normal: "border-white/10 bg-white/[0.03] text-zinc-500",
  high: "border-amber-300/30 bg-amber-300/15 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.12)]"
};

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  sortable = true,
  overlay = false
}: {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string, input: UpdateTaskInput) => void;
  onDelete: (taskId: string) => void;
  sortable?: boolean;
  overlay?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const isDone = task.status === "done";

  function handleToggle() {
    if (!isDone && preferences.soundEffects) {
      playTaskDoneSound();
    }
    onToggle(task.id);
  }

  function startTitleEdit() {
    if (overlay) return;
    setTitleDraft(task.title);
    setIsEditingTitle(true);
  }

  function commitTitleEdit() {
    const nextTitle = titleDraft.trim();
    setIsEditingTitle(false);
    if (!nextTitle || nextTitle === task.title) return;
    onEdit(task.id, { title: nextTitle });
  }

  function cancelTitleEdit() {
    setTitleDraft(task.title);
    setIsEditingTitle(false);
  }

  function openFullEditor() {
    const nextTitle = titleDraft.trim();
    if (isEditingTitle && nextTitle && nextTitle !== task.title) {
      onEdit(task.id, { title: nextTitle });
    }
    setIsEditingTitle(false);
    setIsEditing(true);
  }

  function handleTitleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitTitleEdit();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelTitleEdit();
    }
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `task:${task.id}`,
    data: {
      type: "task",
      taskId: task.id,
      listId: task.listId ?? null
    },
    disabled: !sortable || isEditing || isEditingTitle || overlay
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  if (isEditing) {
    return (
      <TaskEditor
        task={task}
        onCancel={() => setIsEditing(false)}
        onSave={(input) => {
          onEdit(task.id, input);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <article
      ref={sortable && !overlay ? setNodeRef : undefined}
      style={sortable && !overlay ? style : undefined}
      {...(sortable && !overlay ? attributes : {})}
      {...(sortable && !overlay ? listeners : {})}
      className={`group flex gap-3 rounded-2xl border px-2 py-2.5 transition ${sortable && !overlay ? "cursor-grab select-none touch-none active:cursor-grabbing" : ""} ${
        overlay
          ? "max-w-[760px] rotate-[0.5deg] border-blue-400/40 bg-[#16181c] shadow-2xl shadow-black/50 ring-1 ring-blue-400/20"
          : isDragging
            ? "border-blue-400/20 bg-blue-500/5 opacity-35"
            : "border-transparent hover:border-white/5 hover:bg-white/[0.045]"
      }`}
    >
      <span
        className="mt-1 hidden text-zinc-700 group-hover:text-zinc-400 sm:block"
        aria-hidden="true"
        title={t("task.drag")}
      >
        <GripVertical className="h-4 w-4" />
      </span>
      <div onPointerDown={(event) => event.stopPropagation()}>
        <Checkbox checked={isDone} onChange={handleToggle} aria-label={t("task.toggle")} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          {task.isEncrypted ? <Lock className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-300" /> : null}
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              {isEditingTitle ? (
                <input
                  value={titleDraft}
                  onChange={(event) => setTitleDraft(event.target.value)}
                  onBlur={commitTitleEdit}
                  onKeyDown={handleTitleKeyDown}
                  onPointerDown={(event) => event.stopPropagation()}
                  className="min-w-[12rem] flex-1 rounded-xl border border-blue-400/30 bg-zinc-950/80 px-2 py-1 text-sm font-medium text-zinc-100 outline-none ring-2 ring-blue-500/10"
                  autoFocus
                />
              ) : (
                <h3
                  onClick={(event) => {
                    event.stopPropagation();
                    startTitleEdit();
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                  title={t("task.quickEditTitle")}
                  className={isDone ? "min-w-0 max-w-full cursor-text break-words [overflow-wrap:anywhere] text-sm font-medium leading-6 text-zinc-500 line-through" : "min-w-0 max-w-full cursor-text break-words [overflow-wrap:anywhere] text-sm font-medium leading-6 text-zinc-100"}
                >
                  {task.isEncrypted ? "🔒 " : ""}{task.title}
                </h3>
              )}
              <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${priorityClass[task.priority]}`}>
                <CalendarClock className="h-3 w-3" />
                {task.priority === "low" ? t("task.priorityLow") : task.priority === "high" ? t("task.priorityHigh") : t("task.priorityNormal")}
              </span>
              {task.scheduledDate ? (
                <span className="inline-flex shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-500">
                  {task.scheduledDate}
                </span>
              ) : null}
              {task.tags.map((tag) => (
                <span key={tag} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-500">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              <span className="inline-flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100" onPointerDown={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    openFullEditor();
                  }}
                  className="rounded-lg p-1 text-zinc-600 transition hover:bg-white/5 hover:text-zinc-200"
                  aria-label={t("task.edit")}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onDelete(task.id)} className="rounded-lg p-1 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-300" aria-label={t("task.delete")}>
                  <Trash2 className="h-4 w-4" />
                </button>
                <button type="button" className="rounded-lg p-1 text-zinc-700" aria-label={t("task.moreOptions")} title={t("task.moreOptionsLater")}>
                  <MoreVertical className="h-4 w-4" />
                </button>
              </span>
            </div>

            {task.notes ? (
              <p className={isDone ? "mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6 text-zinc-600" : "mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6 text-zinc-400"}>
                {task.notes}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
