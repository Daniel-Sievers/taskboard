"use client";

import { CSSProperties, KeyboardEvent, useState } from "react";
import {
  CalendarClock,
  GripVertical,
  Lock,
  MoreVertical,
  Pencil,
  Repeat2,
  Tag,
  Trash2,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/Checkbox";
import { TaskEditor } from "./TaskEditor";
import { usePreferences } from "@/hooks/usePreferences";
import { playTaskDeleteSound, playTaskDoneSound } from "@/lib/sound";
import { useI18n } from "@/hooks/useI18n";
import { isFutureDateKey, isPastDateKey, isTodayDateKey } from "@/lib/dates/calendar";
import type { Task, UpdateTaskInput } from "@/types/task";


function recurrenceLabel(task: Task, language: string) {
  if ((task.recurrenceType ?? "none") === "none") return null;
  const interval = Math.max(1, task.recurrenceInterval || 1);

  if (language === "en") {
    if (task.recurrenceType === "daily") return interval === 1 ? "daily" : `every ${interval} days`;
    if (task.recurrenceType === "weekly") return interval === 1 ? "weekly" : `every ${interval} weeks`;
    if (task.recurrenceType === "monthly") return interval === 1 ? "monthly" : `every ${interval} months`;
    if (task.recurrenceType === "interval") return `every ${interval} days`;
  }

  if (task.recurrenceType === "daily") return interval === 1 ? "täglich" : `alle ${interval} Tage`;
  if (task.recurrenceType === "weekly") return interval === 1 ? "wöchentlich" : `alle ${interval} Wochen`;
  if (task.recurrenceType === "monthly") return interval === 1 ? "monatlich" : `alle ${interval} Monate`;
  if (task.recurrenceType === "interval") return `alle ${interval} Tage`;

  return null;
}

function dateClass(task: Task) {
  if (!task.scheduledDate || task.status !== "open") {
    return "border-white/10 bg-white/[0.03] text-zinc-500";
  }

  if (isTodayDateKey(task.scheduledDate)) {
    return "border-emerald-400/30 bg-emerald-500/15 text-emerald-200 tb-date-today";
  }
  if (isPastDateKey(task.scheduledDate)) {
    return "border-orange-400/30 bg-orange-500/15 text-orange-200 tb-date-overdue";
  }
  return "border-white/10 bg-white/[0.03] text-zinc-500";
}

function isFutureLockedTask(task: Task) {
  return task.status === "open" && isFutureDateKey(task.scheduledDate);
}

const priorityClass = {
  low: "border-transparent bg-transparent px-0 text-zinc-600",
  normal: "border-white/10 bg-white/[0.03] text-zinc-500",
  high: "border-amber-300/30 bg-amber-300/15 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.12)]",
};

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  sortable = true,
  overlay = false,
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
  const soundPreferences = preferences as typeof preferences & {
    taskDoneSoundEffects?: boolean;
    taskDeleteSoundEffects?: boolean;
  };
  const { t } = useI18n();
  const isDone = task.status === "done";
  const isFutureLocked = isFutureLockedTask(task);
  const recurringLabel = recurrenceLabel(task, preferences.language);
  const taskDoneSoundEnabled =
    soundPreferences.taskDoneSoundEffects ?? preferences.soundEffects;
  const taskDeleteSoundEnabled =
    soundPreferences.taskDeleteSoundEffects ?? preferences.soundEffects;

  function handleToggle() {
    if (isFutureLocked) return;
    if (!isDone && taskDoneSoundEnabled) {
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

  function handleDeleteTask() {
    if (preferences.confirmBeforeDelete) {
      const message =
        preferences.language === "en"
          ? "Delete this task?"
          : "Diese Aufgabe wirklich löschen?";

      const confirmed = window.confirm(message);
      if (!confirmed) return;
    }

    setIsEditingTitle(false);
    if (taskDeleteSoundEnabled) {
      playTaskDeleteSound();
    }
    onDelete(task.id);
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

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task:${task.id}`,
    data: {
      type: "task",
      taskId: task.id,
      listId: task.listId ?? null,
    },
    disabled: !sortable || isEditing || isEditingTitle || overlay,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
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
      className={`group flex gap-3 rounded-2xl border px-2 py-2.5 transition ${
        sortable && !overlay ? "cursor-grab select-none touch-manipulation active:cursor-grabbing" : ""
      } ${
        overlay
          ? "max-w-[760px] rotate-[0.5deg] border-blue-400/40 bg-[#16181c] shadow-2xl shadow-black/50 ring-1 ring-blue-400/20"
          : isDragging
            ? "border-blue-400/20 bg-blue-500/5 opacity-35"
            : isFutureLocked
              ? "border-white/5 bg-white/[0.012] opacity-50 hover:border-white/10 hover:bg-white/[0.025]"
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

      <div
        className={isFutureLocked ? "cursor-not-allowed opacity-50 grayscale" : ""}
        title={isFutureLocked ? (preferences.language === "en" ? "Not due yet" : "Noch nicht fällig") : undefined}
        aria-disabled={isFutureLocked}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          if (!isFutureLocked) return;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        {isFutureLocked ? (
          <span
            className="grid h-5 w-5 place-items-center rounded-md border border-white/10 bg-white/[0.025] text-[10px] text-zinc-600"
            aria-label={preferences.language === "en" ? "Not due yet" : "Noch nicht fällig"}
            role="img"
          >
            —
          </span>
        ) : (
          <Checkbox checked={isDone} onChange={handleToggle} aria-label={t("task.toggle")} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          {task.isEncrypted ? (
            <Lock className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-300" />
          ) : null}

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
                  className={
                    isDone
                      ? "min-w-0 max-w-full cursor-text break-words [overflow-wrap:anywhere] text-sm font-medium leading-6 text-zinc-500 line-through"
                      : isFutureLocked
                        ? "min-w-0 max-w-full cursor-text break-words [overflow-wrap:anywhere] text-sm font-medium leading-6 text-zinc-600"
                        : "min-w-0 max-w-full cursor-text break-words [overflow-wrap:anywhere] text-sm font-medium leading-6 text-zinc-100"
                  }
                >
                  {task.isEncrypted ? "🔒 " : ""}
                  {task.title}
                </h3>
              )}

              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${priorityClass[task.priority]}`}
              >
                <CalendarClock className="h-3 w-3" />
                {task.priority === "low"
                  ? t("task.priorityLow")
                  : task.priority === "high"
                    ? t("task.priorityHigh")
                    : t("task.priorityNormal")}
              </span>

              {task.scheduledDate ? (
                <span className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${dateClass(task)}`}>
                  {task.scheduledDate}
                </span>
              ) : null}

              {recurringLabel ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-200 tb-recurrence-chip">
                  <Repeat2 className="h-3 w-3" />
                  {recurringLabel}
                </span>
              ) : null}

              {isFutureLocked ? (
                <span className="inline-flex shrink-0 rounded-full border border-white/10 bg-white/[0.025] px-2 py-0.5 text-[11px] text-zinc-500">
                  {preferences.language === "en" ? "not due yet" : "noch nicht fällig"}
                </span>
              ) : null}

              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-500"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}

              <span
                className="inline-flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"
                onPointerDown={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    openFullEditor();
                  }}
                  className="rounded-lg p-1 text-zinc-600 transition hover:bg-white/5 hover:text-zinc-200"
                  aria-label={t("task.edit")}
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleDeleteTask();
                  }}
                  className="rounded-lg p-1 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-300"
                  aria-label={t("task.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="rounded-lg p-1 text-zinc-700"
                  aria-label={t("task.moreOptions")}
                  title={t("task.moreOptionsLater")}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </span>
            </div>

            {task.notes ? (
              <p
                className={
                  isDone
                    ? "mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6 text-zinc-600"
                    : isFutureLocked
                      ? "mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6 text-zinc-700"
                      : "mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6 text-zinc-400"
                }
              >
                {task.notes}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}