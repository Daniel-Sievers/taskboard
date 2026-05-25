"use client";

import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  MoreVertical,
  Pencil,
  Rows3,
  Trash2,
} from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AddTaskButton } from "./AddTaskButton";
import { useI18n } from "@/hooks/useI18n";
import { TaskCard } from "./TaskCard";
import type { BoardList } from "@/types/board";
import type { Task, TaskPriority, UpdateTaskInput } from "@/types/task";

export function DayList({
  list,
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteList,
  onRenameList,
  onToggleCollapsed,
  isTaskDragActive = false,
  showTaskCounts = true,
  visibleStatus = "open",
}: {
  list: BoardList;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (input: {
    listId: string;
    title: string;
    notes: string;
    scheduledDate?: string;
    priority: TaskPriority;
    tags: string[];
    isEncrypted: boolean;
  }) => void;
  onEditTask: (taskId: string, input: UpdateTaskInput) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteList: (listId: string) => void;
  onRenameList: (listId: string, title: string) => void;
  onToggleCollapsed: (listId: string) => void;
  isTaskDragActive?: boolean;
  showTaskCounts?: boolean;
  visibleStatus?: "open" | "done" | "all";
}) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { t } = useI18n();
  const [title, setTitle] = useState(list.title);
  const menuRef = useRef<HTMLDivElement>(null);
  const openTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status === "open")
        .sort((a, b) => a.position - b.position),
    [tasks],
  );
  const completedTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status === "done")
        .sort((a, b) => a.position - b.position),
    [tasks],
  );
  const visibleOpenTasks = visibleStatus === "done" ? [] : openTasks;
  const allCount = openTasks.length + completedTasks.length;
  const isCompletedVisible = showCompleted || visibleStatus === "done";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `list:${list.id}`,
    data: {
      type: "list",
      listId: list.id,
    },
    disabled: isRenaming,
  });

  const { setNodeRef: setTaskDropRef, isOver: isTaskDropOver } = useDroppable({
    id: `list-drop:${list.id}`,
    data: {
      type: "list-drop",
      listId: list.id,
    },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function commitRename() {
    const nextTitle = title.trim();
    if (!nextTitle) {
      setTitle(list.title);
      setIsRenaming(false);
      return;
    }
    onRenameList(list.id, nextTitle);
    setIsRenaming(false);
  }

  function submitRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commitRename();
  }

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`rounded-[1.6rem] border p-5 shadow-2xl shadow-black/25 ring-1 ring-white/[0.02] backdrop-blur transition ${
        isDragging
          ? "border-blue-400/40 bg-blue-500/[0.08] opacity-45"
          : isTaskDropOver
            ? "border-blue-400/40 bg-[#121720]"
            : isTaskDragActive
              ? "border-blue-400/15 bg-[#111113]"
              : "border-white/5 bg-[#111113]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex min-w-0 flex-1 cursor-grab touch-none select-none items-start gap-3 active:cursor-grabbing"
          title={t("board.moveList")}
          {...attributes}
          {...listeners}
        >
          <span
            className="mt-1 text-zinc-600 group-hover:text-zinc-300"
            aria-hidden="true"
          >
            <GripVertical className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {isRenaming ? (
                <form
                  onPointerDown={(event) => event.stopPropagation()}
                  onSubmit={submitRename}
                  className="flex min-w-[220px] max-w-full gap-2"
                >
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    onBlur={commitRename}
                    className="w-full rounded-xl border border-blue-500/40 bg-zinc-950 px-3 py-2 text-sm font-semibold text-zinc-100 outline-none ring-2 ring-blue-500/10"
                    autoFocus
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setIsRenaming(true)}
                  className="block max-w-full truncate text-left font-semibold tracking-tight text-zinc-100 hover:text-blue-200"
                  title={t("list.rename")}
                >
                  {list.title}
                </button>
              )}
              {showTaskCounts ? (
                <span className="text-xs text-zinc-500">
                  {t("list.counts", { open: openTasks.length, done: completedTasks.length, all: allCount })}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div ref={menuRef} className="relative flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleCollapsed(list.id)}
            className="rounded-xl p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-100"
            aria-label={
              list.collapsed ? t("list.expand") : t("list.collapse")
            }
            title={list.collapsed ? t("list.expand") : t("list.collapse")}
          >
            {list.collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowMenu((value) => !value)}
            className="rounded-xl p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-100"
            aria-label={t("list.moreOptions")}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu ? (
            <div className="absolute right-0 top-10 z-10 w-56 rounded-2xl border border-white/10 bg-zinc-950 p-2 text-sm shadow-2xl shadow-black/40">
              <button
                type="button"
                onClick={() => {
                  setIsRenaming(true);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-zinc-300 hover:bg-white/5"
              >
                <Pencil className="h-4 w-4" /> {t("list.rename")}
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleCollapsed(list.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-zinc-300 hover:bg-white/5"
              >
                <Rows3 className="h-4 w-4" />{" "}
                {list.collapsed ? t("list.expand") : t("list.collapse")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDeleteList(list.id);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" /> {t("list.delete")}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {!list.collapsed ? (
        <>
          <AddTaskButton
            listId={list.id}
            dateKey={list.date}
            onAddTask={onAddTask}
          />

          <div
            ref={setTaskDropRef}
            className={`mt-4 min-h-12 space-y-1 rounded-2xl transition ${isTaskDragActive ? "bg-blue-500/[0.025] p-1 ring-1 ring-blue-400/10" : ""}`}
          >
            <SortableContext
              items={visibleOpenTasks.map((task) => `task:${task.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {visibleOpenTasks.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-600">
                  {t("list.emptyOpen")}
                </p>
              ) : (
                visibleOpenTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              )}
            </SortableContext>
          </div>

          <div className="mt-5 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={() => setShowCompleted((value) => !value)}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300"
            >
              {isCompletedVisible ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {t("list.completed")} ({completedTasks.length})
            </button>
            {isCompletedVisible ? (
              <div className="mt-3 space-y-1">
                {completedTasks.length === 0 ? (
                  <p className="text-sm text-zinc-700">
                    {t("list.noCompleted")}
                  </p>
                ) : (
                  completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      sortable={false}
                    />
                  ))
                )}
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
