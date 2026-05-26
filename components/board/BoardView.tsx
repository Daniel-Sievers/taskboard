"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addDays, startOfDay } from "date-fns";
import {
  CalendarDays,
  LayoutGrid,
  Loader2,
  Plus,
  SlidersHorizontal,
  Tag,
  TriangleAlert,
  X,
  MoreVertical,
  Pencil,
  Trash2,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardStats } from "./BoardStats";
import { DayList } from "./DayList";
import { TaskCard } from "./TaskCard";
import { useAuth } from "@/hooks/useAuth";
import { useTaskboard } from "@/hooks/useTaskboard";
import { usePreferences } from "@/hooks/usePreferences";
import { useI18n } from "@/hooks/useI18n";
import { titleForDate } from "@/lib/db/lists";
import { toDateKey } from "@/lib/dates/calendar";
import type { BoardList } from "@/types/board";

function buildDemoLists(): BoardList[] {
  const start = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, index) => {
    const date = toDateKey(addDays(start, index));
    return {
      id: `demo-list-${date}`,
      userId: "demo",
      boardId: "demo-board",
      title: titleForDate(date),
      date,
      position: index + 1,
      collapsed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

type ActiveDrag = { type: "list" | "task"; id: string } | null;

function getDragData(event: DragStartEvent | DragOverEvent | DragEndEvent) {
  return event.active.data.current as
    | { type?: string; listId?: string; taskId?: string }
    | undefined;
}

function getOverData(event: DragOverEvent | DragEndEvent) {
  return event.over?.data.current as
    | { type?: string; listId?: string; taskId?: string }
    | undefined;
}

export function BoardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeBoardId = searchParams.get("board");
  const { user, isLoading: authLoading, isSupabaseConfigured } = useAuth();
  const {
    boards,
    board,
    lists,
    tasks,
    mode,
    isLoading,
    isSaving,
    error,
    realtimeStatus,
    lastRealtimeUpdate,
    reload,
    renameBoard,
    deleteBoard,
    addList,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    deleteList,
    renameList,
    toggleListCollapsed,
    previewMoveList,
    previewMoveTask,
    persistListOrder,
    persistTaskOrder,
  } = useTaskboard(user, activeBoardId);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "normal" | "low">("all");
  const [statusFilter, setStatusFilter] = useState<"open" | "done" | "all">("open");
  const [filterOpen, setFilterOpen] = useState(false);
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useI18n();
  const [view, setView] = useState<"days" | "kanban">(preferences.defaultView);
  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null);
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const boardMenuRef = useRef<HTMLDivElement>(null);

  const activeFilter = searchParams.get("filter");

  useEffect(() => {
    setView(searchParams.get("view") === "kanban" ? "kanban" : preferences.defaultView);
    setQuery(searchParams.get("q") ?? "");
  }, [preferences.defaultView, searchParams]);

  useEffect(() => {
    function handleReload() {
      void reload();
    }

    window.addEventListener("taskboard:reload", handleReload);
    return () => window.removeEventListener("taskboard:reload", handleReload);
  }, [reload]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!boardMenuRef.current?.contains(event.target as Node)) {
        setBoardMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function updateView(nextView: "days" | "kanban") {
    setView(nextView);
    updatePreferences({ defaultView: nextView });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    router.replace(params.toString() ? `/board?${params.toString()}` : "/board", {
      scroll: false,
    });
  }

  function updateBoardSearch(nextQuery: string) {
    setQuery(nextQuery);
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = nextQuery.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    router.replace(params.toString() ? `/board?${params.toString()}` : "/board", {
      scroll: false,
    });
  }

  function switchBoard(boardId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("board", boardId);
    router.push(`/board?${params.toString()}`);
  }

  const lastDragOverKeyRef = useRef<string | null>(null);
  const pointerYRef = useRef<number | null>(null);
  const dragStartPointerYRef = useRef<number | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 280,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!activeDrag) {
      pointerYRef.current = null;
      dragStartPointerYRef.current = null;
      return;
    }

    let frame = 0;
    const edgeSize = 190;
    const maxPixelsPerFrame = 34;
    const minPixelsPerFrame = 2;
    const previousHtmlScrollBehavior =
      document.documentElement.style.scrollBehavior;
    const previousBodyScrollBehavior = document.body.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

    function rememberPointerY(event: PointerEvent | MouseEvent) {
      pointerYRef.current = event.clientY;
    }

    function rememberTouchY(event: TouchEvent) {
      const touch = event.touches[0] ?? event.changedTouches[0];
      if (touch) pointerYRef.current = touch.clientY;
    }

    // dnd-kit can capture pointer movement while dragging. Listening globally in
    // capture phase keeps the custom autoscroll direction responsive when the
    // user scrolls down, then back up, then down again without releasing.
    window.addEventListener("pointermove", rememberPointerY, {
      capture: true,
      passive: true,
    });
    window.addEventListener("mousemove", rememberPointerY, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchmove", rememberTouchY, {
      capture: true,
      passive: true,
    });

    function calculateDelta(y: number) {
      const height = window.innerHeight;
      const distanceTop = y;
      const distanceBottom = height - y;

      if (distanceTop < edgeSize) {
        const intensity = Math.min(
          1,
          Math.max(0, (edgeSize - distanceTop) / edgeSize),
        );
        const eased = intensity * intensity * intensity;
        return -Math.ceil(minPixelsPerFrame + maxPixelsPerFrame * eased);
      }

      if (distanceBottom < edgeSize) {
        const intensity = Math.min(
          1,
          Math.max(0, (edgeSize - distanceBottom) / edgeSize),
        );
        const eased = intensity * intensity * intensity;
        return Math.ceil(minPixelsPerFrame + maxPixelsPerFrame * eased);
      }

      return 0;
    }

    function tick() {
      const y = pointerYRef.current;
      if (y !== null) {
        const delta = calculateDelta(y);
        if (delta !== 0) window.scrollBy(0, delta);
      }
      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", rememberPointerY, {
        capture: true,
      });
      window.removeEventListener("mousemove", rememberPointerY, {
        capture: true,
      });
      window.removeEventListener("touchmove", rememberTouchY, {
        capture: true,
      });
      document.documentElement.style.scrollBehavior = previousHtmlScrollBehavior;
      document.body.style.scrollBehavior = previousBodyScrollBehavior;
      pointerYRef.current = null;
      dragStartPointerYRef.current = null;
    };
  }, [activeDrag]);

  const boardLists =
    mode === "demo" && lists.length === 0 ? buildDemoLists() : lists;
  const activeTask =
    activeDrag?.type === "task"
      ? tasks.find((task) => task.id === activeDrag.id)
      : null;
  const activeList =
    activeDrag?.type === "list"
      ? boardLists.find((list) => list.id === activeDrag.id)
      : null;

  const todayKey = toDateKey(new Date());

  const availableLabels = useMemo(() => {
    const labels = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((tag) => labels.add(tag)));
    return Array.from(labels).sort((a, b) => a.localeCompare(b, "de"));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return tasks.filter((task) => {
      if (activeFilter === "today") {
        const isDueToday = toDateKey(task.scheduledDate) === todayKey;
        if (!isDueToday || task.status !== "open") return false;
      }

      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      if (selectedLabel && !task.tags.includes(selectedLabel)) return false;

      if (!normalized) return true;

      const haystack = [task.title, task.notes, ...task.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [activeFilter, priorityFilter, query, selectedLabel, tasks, todayKey]);

  const hasActiveFilters =
    activeFilter === "today" ||
    selectedLabel !== null ||
    priorityFilter !== "all" ||
    statusFilter !== "open" ||
    query.trim().length > 0;

  function handleDragStart(event: DragStartEvent) {
    lastDragOverKeyRef.current = null;
    const activatorEvent = event.activatorEvent;
    if (activatorEvent instanceof MouseEvent) {
      pointerYRef.current = activatorEvent.clientY;
      dragStartPointerYRef.current = activatorEvent.clientY;
    }

    if (
      typeof TouchEvent !== "undefined" &&
      activatorEvent instanceof TouchEvent
    ) {
      const touch = activatorEvent.touches[0] ?? activatorEvent.changedTouches[0];
      if (touch) {
        pointerYRef.current = touch.clientY;
        dragStartPointerYRef.current = touch.clientY;
      }
    }
    const data = getDragData(event);
    if (data?.type === "list" && data.listId) {
      setActiveDrag({ type: "list", id: data.listId });
    }
    if (data?.type === "task" && data.taskId) {
      setActiveDrag({ type: "task", id: data.taskId });
    }
  }

  function handleDragMove(event: DragMoveEvent) {
    // Global pointermove is the source of truth for autoscroll. This fallback is
    // only for keyboard dragging or browsers that do not deliver pointermove
    // during a captured drag. It intentionally does not override a known pointer
    // position, otherwise direction changes after scrolling can feel stuck.
    if (pointerYRef.current === null) {
      const currentRect = event.active.rect.current;
      const translated = currentRect.translated ?? currentRect.initial;
      if (translated) {
        pointerYRef.current = translated.top + translated.height / 2;
      } else if (dragStartPointerYRef.current !== null) {
        pointerYRef.current = dragStartPointerYRef.current + event.delta.y;
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    // Keep drag-over intentionally light. @dnd-kit already animates sortable
    // displacement while dragging. Mutating React state on every hover event can
    // cause render loops and makes list dragging feel jittery on large boards.
    if (!event.over) return;
  }

  function handleDragEnd(event: DragEndEvent) {
    lastDragOverKeyRef.current = null;
    const data = getDragData(event);
    const overData = getOverData(event);

    if (!event.over || !data) {
      setActiveDrag(null);
      return;
    }

    if (data.type === "list" && data.listId) {
      const targetListId = overData?.listId;
      if (targetListId && targetListId !== data.listId) {
        previewMoveList(data.listId, targetListId);
        void persistListOrder();
      }
    }

    if (data.type === "task" && data.taskId) {
      const targetListId = overData?.listId;
      const overTaskId =
        overData?.type === "task" ? (overData.taskId ?? null) : null;
      const currentTask = tasks.find((task) => task.id === data.taskId);

      if (targetListId && currentTask) {
        const finalOverTaskId = overTaskId === data.taskId ? null : overTaskId;
        previewMoveTask(data.taskId, targetListId, finalOverTaskId);
        void persistTaskOrder();
      }
    }

    setActiveDrag(null);
  }

  function handleDragCancel() {
    lastDragOverKeyRef.current = null;
    setActiveDrag(null);
    void reload();
  }

  async function handleRenameBoard() {
    if (!board) return;
    const title = window.prompt(t("board.rename"), board.title);
    if (!title?.trim() || title.trim() === board.title) return;
    await renameBoard(title.trim());
    window.dispatchEvent(new Event("taskboard:boards-changed"));
  }

  async function handleDeleteBoard() {
    const nextBoard = await deleteBoard();
    setBoardMenuOpen(false);
    window.dispatchEvent(new Event("taskboard:boards-changed"));
    if (nextBoard) {
      router.push(`/board?board=${nextBoard.id}`);
    } else {
      router.push("/board");
    }
  }

  const kanbanColumns = [
    {
      id: "today",
      title: t("kanban.today"),
      tasks: filteredTasks.filter(
        (task) =>
          toDateKey(task.scheduledDate) === todayKey && task.status === "open",
      ),
    },
    {
      id: "week",
      title: t("kanban.planned"),
      tasks: filteredTasks.filter(
        (task) =>
          toDateKey(task.scheduledDate) !== todayKey && task.status === "open",
      ),
    },
    {
      id: "done",
      title: t("kanban.done"),
      tasks: filteredTasks.filter((task) => task.status === "done"),
    },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="grid min-h-[55vh] place-items-center rounded-[2rem] border border-white/10 bg-white/[0.035]">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" /> {t("board.loading")}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="relative overflow-visible rounded-[1.8rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/25 ring-1 ring-white/[0.03]">
        <div className="bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 p-4 md:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="tb-board-eyebrow text-xs font-medium uppercase tracking-[0.28em] text-blue-300">
                    {t("board.mainBoard")}
                  </p>
                  {mode === "supabase" ? (
                    <>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-zinc-400">
                        {t("board.boardCount", { count: boards.length })}
                      </span>
                      <span
                        className={
                          realtimeStatus === "live"
                            ? "rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-200"
                            : realtimeStatus === "syncing" || realtimeStatus === "connecting"
                              ? "rounded-full border border-blue-400/20 bg-blue-500/10 px-2 py-1 text-[11px] text-blue-200"
                              : realtimeStatus === "error"
                                ? "rounded-full border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-200"
                                : "rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-zinc-400"
                        }
                        title={lastRealtimeUpdate ? `Realtime update: ${lastRealtimeUpdate}` : undefined}
                      >
                        {realtimeStatus === "live"
                          ? "Live-Sync"
                          : realtimeStatus === "syncing"
                            ? "Synchronisiert …"
                            : realtimeStatus === "connecting"
                              ? "Verbinde …"
                              : realtimeStatus === "error"
                                ? "Sync prüfen"
                                : "Manuell"}
                      </span>
                    </>
                  ) : null}
                  {mode === "supabase" && boards.length > 0 ? (
                    <div className="flex max-w-full flex-wrap gap-1.5">
                      {boards.map((item) => {
                        const isActive = item.id === board?.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => switchBoard(item.id)}
                            className={
                              isActive
                                ? "tb-board-chip-active max-w-44 truncate rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-1 text-sm text-blue-100"
                                : "tb-board-chip max-w-44 truncate rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                            }
                            title={item.title}
                          >
                            {item.title}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>

              {mode === "demo" || !isSupabaseConfigured ? (
                <p className="max-w-xl text-sm leading-6 text-zinc-500 lg:text-right">
                  {isSupabaseConfigured ? t("board.loginDescription") : t("board.demoDescription")}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateView("days")}
                className={
                  view === "days"
                    ? "inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white"
                    : "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
                }
              >
                <CalendarDays className="h-4 w-4" /> {t("sidebar.dayLists")}
              </button>
              <button
                type="button"
                onClick={() => updateView("kanban")}
                className={
                  view === "kanban"
                    ? "inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white"
                    : "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
                }
              >
                <LayoutGrid className="h-4 w-4" /> {t("sidebar.horizontal")}
              </button>
              <button
                type="button"
                onClick={() => setStatsOpen((open) => !open)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
              >
                <BarChart3 className="h-4 w-4" /> {t("board.details")}
                <ChevronDown className={`h-4 w-4 transition ${statsOpen ? "rotate-180" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setFilterOpen((open) => !open)}
                className={
                  hasActiveFilters
                    ? "inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-400/30 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-100 hover:bg-blue-500/15"
                    : "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
                }
              >
                <SlidersHorizontal className="h-4 w-4" /> {t("board.filter")}
              </button>
              {board ? (
                <div ref={boardMenuRef} className="relative z-40 shrink-0">
                  <button
                    type="button"
                    onClick={() => setBoardMenuOpen((open) => !open)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/50 px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
                  >
                    <MoreVertical className="h-4 w-4" /> {t("board.menu")}
                  </button>
                  {boardMenuOpen ? (
                    <div className="absolute left-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-zinc-950 p-2 text-sm shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:left-auto sm:right-0">
                      <button
                        type="button"
                        onClick={() => { setBoardMenuOpen(false); void handleRenameBoard(); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-zinc-300 hover:bg-white/5 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" /> {t("board.rename")}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteBoard()}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-red-200 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" /> {t("board.archive")}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {hasActiveFilters || filterOpen ? (
          <div className="space-y-4 border-t border-white/5 p-4 md:p-5">
          {hasActiveFilters ? (
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span>{filteredTasks.length} {t("filter.matches")}</span>
              {activeFilter === "today" ? (
                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2 py-1 text-blue-200">{t("filter.todayDue")}</span>
              ) : null}
              {selectedLabel ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
                  <Tag className="h-3 w-3" /> {selectedLabel}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  updateBoardSearch("");
                  setSelectedLabel(null);
                  setPriorityFilter("all");
                  setStatusFilter("open");
                  if (activeFilter === "today") router.push(activeBoardId ? `/board?board=${activeBoardId}` : "/board");
                }}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-zinc-500 hover:bg-white/5 hover:text-white"
              >
                <X className="h-3 w-3" /> {t("filter.reset")}
              </button>
            </div>
          ) : null}

          {filterOpen ? (
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-4 md:grid-cols-3">
              <label className="space-y-1.5 text-xs text-zinc-500">
                {t("filter.status")}
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
                >
                  <option value="open">{t("filter.open")}</option>
                  <option value="done">{t("filter.done")}</option>
                  <option value="all">{t("filter.all")}</option>
                </select>
              </label>

              <label className="space-y-1.5 text-xs text-zinc-500">
                {t("filter.priority")}
                <select
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value as typeof priorityFilter)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
                >
                  <option value="all">{t("filter.allPriorities")}</option>
                  <option value="high">{t("task.priorityHigh")}</option>
                  <option value="normal">{t("task.priorityNormal")}</option>
                  <option value="low">{t("task.priorityLow")}</option>
                </select>
              </label>

              <label className="space-y-1.5 text-xs text-zinc-500">
                {t("filter.label")}
                <select
                  value={selectedLabel ?? ""}
                  onChange={(event) => setSelectedLabel(event.target.value || null)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
                >
                  <option value="">{t("filter.allLabels")}</option>
                  {availableLabels.map((label) => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
              </label>

              {availableLabels.length > 0 ? (
                <div className="md:col-span-3">
                  <p className="mb-2 text-xs text-zinc-500">{t("filter.quickLabels")}</p>
                  <div className="flex flex-wrap gap-2">
                    {availableLabels.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedLabel((current) => current === label ? null : label)}
                        className={
                          selectedLabel === label
                            ? "inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-xs text-blue-100"
                            : "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                        }
                      >
                        <Tag className="h-3 w-3" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">{t("board.errorTitle")}</p>
              <p className="mt-1 text-red-100/80">{error}</p>
              <button
                type="button"
                onClick={() => void reload()}
                className="mt-3 rounded-xl border border-red-100/20 px-3 py-1.5 text-xs hover:bg-red-100/10"
              >
                {t("board.reload")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {statsOpen ? <BoardStats tasks={tasks} mode={mode} isSaving={isSaving} /> : null}

      {view === "days" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          autoScroll={false}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={boardLists.map((list) => `list:${list.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-5">
              {boardLists.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-[#111113] p-8 text-center">
                  <p className="text-sm font-medium text-zinc-300">
                    {t("board.noListsTitle")}
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    {t("board.noListsBody")}
                  </p>
                </div>
              ) : null}
              {boardLists.map((list) => {
                const tasksForList = filteredTasks
                  .filter(
                    (task) =>
                      task.listId === list.id ||
                      (!task.listId &&
                        list.date &&
                        toDateKey(task.scheduledDate) === list.date),
                  )
                  .sort((a, b) => a.position - b.position);
                return (
                  <DayList
                    key={list.id}
                    list={list}
                    tasks={tasksForList}
                    onToggleTask={toggleTask}
                    onAddTask={addTask}
                    onEditTask={editTask}
                    onDeleteTask={deleteTask}
                    onDeleteList={deleteList}
                    onRenameList={renameList}
                    onToggleCollapsed={toggleListCollapsed}
                    isTaskDragActive={activeDrag?.type === "task"}
                    showTaskCounts={preferences.showTaskCounts}
                    visibleStatus={statusFilter}
                  />
                );
              })}
              <button
                type="button"
                onClick={() => void addList()}
                className="mx-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/80 px-6 py-3 text-sm text-zinc-300 hover:bg-white/5"
              >
                <Plus className="h-4 w-4" /> {t("board.addList")}
              </button>
            </div>
          </SortableContext>
          <DragOverlay
            dropAnimation={{
              duration: 180,
              easing: "cubic-bezier(0.2, 0, 0, 1)",
            }}
          >
            {activeTask ? (
              <TaskCard
                task={activeTask}
                onToggle={() => undefined}
                onEdit={() => undefined}
                onDelete={() => undefined}
                sortable={false}
                overlay
              />
            ) : activeList ? (
              <div className="rounded-[1.6rem] border border-blue-400/40 bg-[#16181c] p-5 shadow-2xl shadow-black/50 ring-1 ring-blue-400/20">
                <p className="font-semibold text-zinc-100">
                  {activeList.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{t("board.moveList")}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {kanbanColumns.map((column) => (
            <section
              key={column.id}
              className="min-h-96 rounded-[2rem] border border-white/10 bg-zinc-950/70 p-4 shadow-2xl shadow-black/20"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-zinc-100">{column.title}</h2>
                <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-500">
                  {column.tasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {column.tasks.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-zinc-600">
                    {t("kanban.emptyColumn")}
                  </p>
                ) : (
                  column.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <p className="break-words text-sm font-medium text-zinc-100">
                        {task.title}
                      </p>
                      {task.notes ? (
                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                          {task.notes}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
