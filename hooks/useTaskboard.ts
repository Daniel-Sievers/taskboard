"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { archiveBoard, createBoard, getOrCreateDefaultBoard, listBoards, updateBoardTitle } from "@/lib/db/boards";
import {
  createCustomList,
  deleteListById,
  listBoardLists,
  updateListCollapsed,
  updateListPositions,
  updateListTitle,
} from "@/lib/db/lists";
import {
  createNextRecurringTask,
  createTask,
  getNextRecurrenceDate,
  listTasks,
  softDeleteTask,
  updateTask,
  updateTaskOrder,
  updateTaskStatus,
} from "@/lib/db/tasks";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { isFutureDateKey, toDateKey } from "@/lib/dates/calendar";
import {
  findMatchingDateList,
  findOpenList,
  getListDateKey,
  isDateKeyOlderThanDays,
  parseListDateFromTitle,
} from "@/lib/dates/list-dates";
import { reorderById, withSequentialPositions } from "@/lib/dnd/reorder";
import { createDemoBoard, createInitialDemoLists, createInitialDemoTasks, initialDemoLists, initialDemoTasks } from "@/lib/demo-data";
import type { Board, BoardList } from "@/types/board";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task";
import type { User } from "@supabase/supabase-js";


function isFutureLockedTask(task: Task) {
  return task.status === "open" && isFutureDateKey(task.scheduledDate);
}

function createDemoList({
  title,
  boardId = "demo-board",
  position,
}: {
  title: string;
  boardId?: string;
  position: number;
}): BoardList {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    userId: "demo",
    boardId,
    title,
    date: parseListDateFromTitle(title),
    position,
    collapsed: false,
    createdAt: now,
    updatedAt: now,
  };
}

function taskRoutingSignature(lists: BoardList[], tasks: Task[]) {
  const listPart = lists
    .map((list) => `${list.id}:${list.title}:${list.date ?? ""}`)
    .sort()
    .join("|");
  const taskPart = tasks
    .filter((task) => task.status === "open")
    .map(
      (task) =>
        `${task.id}:${task.listId ?? ""}:${task.scheduledDate}:${task.position}`,
    )
    .sort()
    .join("|");

  return `${listPart}::${taskPart}`;
}

function getNextPositionForList(
  currentTasks: Task[],
  listId: string | null | undefined,
  excludeTaskId?: string,
) {
  const positions = currentTasks
    .filter((task) => task.id !== excludeTaskId && task.listId === listId)
    .map((task) => task.position);

  return positions.length > 0 ? Math.max(...positions) + 1 : 1;
}


function findExistingNextRecurringTask(currentTasks: Task[], task: Task, nextDate: string) {
  const recurrenceType = task.recurrenceType ?? "none";

  return currentTasks.find(
    (item) =>
      item.id !== task.id &&
      item.status === "open" &&
      item.boardId === task.boardId &&
      item.listId === task.listId &&
      item.title === task.title &&
      item.scheduledDate === nextDate &&
      (item.recurrenceType ?? "none") === recurrenceType,
  );
}

function getAutoTargetList(task: Task, currentLists: BoardList[]) {
  if (task.status !== "open") return null;

  const dateKey = task.scheduledDate ? toDateKey(task.scheduledDate) : "";
  if (!dateKey) return null;

  if (isDateKeyOlderThanDays(dateKey, 7)) {
    return findOpenList(currentLists);
  }

  return findMatchingDateList(currentLists, dateKey);
}

function routeOpenTasksToLists(currentLists: BoardList[], currentTasks: Task[]) {
  const moves = currentTasks
    .map((task) => {
      const targetList = getAutoTargetList(task, currentLists);
      if (!targetList || targetList.id === task.listId) return null;
      return { task, targetListId: targetList.id };
    })
    .filter(Boolean) as Array<{ task: Task; targetListId: string }>;

  if (moves.length === 0) return null;

  const now = new Date().toISOString();
  const movedTaskIds = new Set(moves.map((move) => move.task.id));
  const affectedListIds = new Set<string>();

  moves.forEach((move) => {
    if (move.task.listId) affectedListIds.add(move.task.listId);
    affectedListIds.add(move.targetListId);
  });

  const remainingTasks = currentTasks.filter((task) => !movedTaskIds.has(task.id));
  const nextTasks: Task[] = remainingTasks.filter(
    (task) => !affectedListIds.has(task.listId ?? ""),
  );

  affectedListIds.forEach((listId) => {
    const existingTasks = remainingTasks
      .filter((task) => task.listId === listId)
      .sort((a, b) => a.position - b.position);
    const incomingTasks = moves
      .filter((move) => move.targetListId === listId)
      .map((move) => ({
        ...move.task,
        listId,
        updatedAt: now,
      }));

    nextTasks.push(...withSequentialPositions<Task>([...existingTasks, ...incomingTasks]));
  });

  return nextTasks;
}

function reorderTasksForMove({
  currentTasks,
  currentLists,
  taskId,
  targetListId,
  overTaskId,
}: {
  currentTasks: Task[];
  currentLists: BoardList[];
  taskId: string;
  targetListId: string;
  overTaskId?: string | null;
}) {
  const movingTask = currentTasks.find((task) => task.id === taskId);
  const targetList = currentLists.find((list) => list.id === targetListId);
  if (!movingTask || !targetList) return currentTasks;

  const sourceListId = movingTask.listId ?? null;
  const remainingTasks = currentTasks.filter((task) => task.id !== taskId);
  const nextScheduledDate = getListDateKey(targetList) ?? movingTask.scheduledDate;
  const movedTask: Task = {
    ...movingTask,
    listId: targetListId,
    scheduledDate: nextScheduledDate,
    updatedAt: new Date().toISOString(),
  };

  const targetTasks = remainingTasks
    .filter((task) => task.listId === targetListId)
    .sort((a, b) => a.position - b.position);

  const insertIndex = overTaskId
    ? targetTasks.findIndex((task) => task.id === overTaskId)
    : targetTasks.length;
  const safeInsertIndex = insertIndex < 0 ? targetTasks.length : insertIndex;

  targetTasks.splice(safeInsertIndex, 0, movedTask);
  const positionedTargetTasks: Task[] =
    withSequentialPositions<Task>(targetTasks);

  const sourceTasks =
    sourceListId && sourceListId !== targetListId
      ? withSequentialPositions<Task>(
          remainingTasks
            .filter((task) => task.listId === sourceListId)
            .sort((a, b) => a.position - b.position),
        )
      : [];

  const affectedListIds = new Set([targetListId, sourceListId].filter(Boolean));
  const unaffectedTasks = remainingTasks.filter(
    (task) => !affectedListIds.has(task.listId ?? null),
  );

  return [...unaffectedTasks, ...positionedTargetTasks, ...sourceTasks];
}

export function useTaskboard(user: User | null, requestedBoardId?: string | null, forceDemo = false) {
  const [boards, setBoards] = useState<Board[]>(() => [createDemoBoard()]);
  const [board, setBoard] = useState<Board | null>(() => createDemoBoard());
  const [lists, setLists] = useState<BoardList[]>(initialDemoLists);
  const [tasks, setTasks] = useState<Task[]>(initialDemoTasks);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"demo" | "supabase">("demo");
  const [realtimeStatus, setRealtimeStatus] = useState<"off" | "connecting" | "live" | "syncing" | "error">("off");
  const [lastRealtimeUpdate, setLastRealtimeUpdate] = useState<string | null>(null);
  const listsRef = useRef<BoardList[]>(initialDemoLists);
  const tasksRef = useRef<Task[]>(initialDemoTasks);
  const realtimeRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRoutingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRoutingInFlightRef = useRef(false);
  const autoRoutingLastSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    listsRef.current = lists;
  }, [lists]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const load = useCallback(async (options?: { showLoading?: boolean }) => {
    const showLoading = options?.showLoading ?? true;

    if (forceDemo || !isSupabaseConfigured || !user) {
      const nextBoard = createDemoBoard();
      const nextLists = createInitialDemoLists();
      const nextTasks = createInitialDemoTasks();

      setMode("demo");
      setBoards([nextBoard]);
      setBoard(nextBoard);
      setLists(nextLists);
      setTasks(nextTasks);
      listsRef.current = nextLists;
      tasksRef.current = nextTasks;
      setRealtimeStatus("off");
      setError(null);
      setIsLoading(false);
      return;
    }

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const defaultBoard = await getOrCreateDefaultBoard(user.id);
      const availableBoards = await listBoards(user.id);
      const selectedBoard =
        availableBoards.find((item) => item.id === requestedBoardId) ??
        availableBoards.find((item) => item.id === defaultBoard.id) ??
        availableBoards[0] ??
        defaultBoard;
      const existingLists = await listBoardLists(selectedBoard.id);
      const remoteTasks = await listTasks(selectedBoard.id);

      setBoards(availableBoards.length > 0 ? availableBoards : [defaultBoard]);
      setBoard(selectedBoard);
      listsRef.current = existingLists;
      tasksRef.current = remoteTasks;
      setLists(existingLists);
      setTasks(remoteTasks);
      setMode("supabase");
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Taskboard konnte nicht geladen werden.";
      setError(message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [forceDemo, user, requestedBoardId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!isSupabaseConfigured || !user || !board || mode !== "supabase") {
      setRealtimeStatus("off");
      return;
    }

    setRealtimeStatus("connecting");

    function scheduleRealtimeRefresh() {
      if (realtimeRefreshTimerRef.current) {
        clearTimeout(realtimeRefreshTimerRef.current);
      }

      setRealtimeStatus("syncing");
      realtimeRefreshTimerRef.current = setTimeout(() => {
        setLastRealtimeUpdate(new Date().toISOString());
        void load({ showLoading: false }).finally(() => {
          setRealtimeStatus("live");
        });
      }, 450);
    }

    const channel = supabase
      .channel(`taskboard-realtime:${user.id}:${board.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `board_id=eq.${board.id}`,
        },
        scheduleRealtimeRefresh,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lists",
          filter: `board_id=eq.${board.id}`,
        },
        scheduleRealtimeRefresh,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "boards",
          filter: `user_id=eq.${user.id}`,
        },
        scheduleRealtimeRefresh,
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setRealtimeStatus("live");
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setRealtimeStatus("error");
        }
      });

    return () => {
      if (realtimeRefreshTimerRef.current) {
        clearTimeout(realtimeRefreshTimerRef.current);
        realtimeRefreshTimerRef.current = null;
      }
      supabase.removeChannel(channel);
    };
  }, [board, load, mode, user]);

  useEffect(() => {
    if (!board || isLoading) return;

    const signature = taskRoutingSignature(lists, tasks);
    if (autoRoutingLastSignatureRef.current === signature) return;
    autoRoutingLastSignatureRef.current = signature;

    if (autoRoutingTimerRef.current) {
      clearTimeout(autoRoutingTimerRef.current);
    }

    autoRoutingTimerRef.current = setTimeout(() => {
      void applyAutomaticDateRouting();
    }, 250);

    return () => {
      if (autoRoutingTimerRef.current) {
        clearTimeout(autoRoutingTimerRef.current);
        autoRoutingTimerRef.current = null;
      }
    };
  }, [board, isLoading, lists, tasks]);


  async function ensureOpenListForAutomaticRouting(currentLists: BoardList[]) {
    const existingOpenList = findOpenList(currentLists);
    if (existingOpenList) return { lists: currentLists, list: existingOpenList };

    if (!user || !board || mode === "demo") {
      const created = createDemoList({
        title: "Offen",
        boardId: board?.id ?? "demo-board",
        position: currentLists.length + 1,
      });
      const nextLists = [...currentLists, created];
      listsRef.current = nextLists;
      setLists(nextLists);
      return { lists: nextLists, list: created };
    }

    const created = await createCustomList({
      userId: user.id,
      boardId: board.id,
      title: "Offen",
    });
    const nextLists = [...currentLists, created].sort(
      (a, b) => a.position - b.position,
    );
    listsRef.current = nextLists;
    setLists(nextLists);
    return { lists: nextLists, list: created };
  }

  async function resolveTaskTargetList(input: {
    currentListId: string;
    scheduledDate?: string | null;
    status?: Task["status"];
  }) {
    const dateKey = input.scheduledDate ? toDateKey(input.scheduledDate) : "";
    let currentLists = listsRef.current;

    if ((input.status ?? "open") === "open" && isDateKeyOlderThanDays(dateKey, 7)) {
      const ensured = await ensureOpenListForAutomaticRouting(currentLists);
      currentLists = ensured.lists;
      return { listId: ensured.list.id, scheduledDate: dateKey };
    }

    const matchingDateList = findMatchingDateList(currentLists, dateKey);
    if (matchingDateList) {
      return { listId: matchingDateList.id, scheduledDate: dateKey };
    }

    return { listId: input.currentListId, scheduledDate: dateKey };
  }

  async function applyAutomaticDateRouting() {
    if (autoRoutingInFlightRef.current) return;

    const currentTasks = tasksRef.current;
    let currentLists = listsRef.current;
    const hasOverdueOpenTasks = currentTasks.some(
      (task) =>
        task.status === "open" &&
        isDateKeyOlderThanDays(toDateKey(task.scheduledDate), 7),
    );

    try {
      autoRoutingInFlightRef.current = true;

      if (hasOverdueOpenTasks && !findOpenList(currentLists)) {
        const ensured = await ensureOpenListForAutomaticRouting(currentLists);
        currentLists = ensured.lists;
      }

      const nextTasks = routeOpenTasksToLists(currentLists, currentTasks);
      if (!nextTasks) return;

      tasksRef.current = nextTasks;
      setTasks(nextTasks);

      if (mode === "demo") return;

      setIsSaving(true);
      setError(null);
      await updateTaskOrder(
        nextTasks.map((task) => ({
          id: task.id,
          listId: task.listId ?? null,
          position: task.position,
          scheduledDate: task.scheduledDate,
        })),
      );
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Automatische Datumssortierung konnte nicht gespeichert werden.",
      );
    } finally {
      setIsSaving(false);
      autoRoutingInFlightRef.current = false;
    }
  }


  async function addList(title = "Neue Liste") {
    const now = new Date().toISOString();

    if (!user || !board || mode === "demo") {
      const created = createDemoList({
        title,
        boardId: board?.id ?? "demo-board",
        position: listsRef.current.length + 1,
      });
      const nextLists = [...listsRef.current, created];
      listsRef.current = nextLists;
      setLists(nextLists);
      return created;
    }

    setIsSaving(true);
    setError(null);
    try {
      const created = await createCustomList({
        userId: user.id,
        boardId: board.id,
        title,
      });
      const nextLists = [...listsRef.current, created].sort(
        (a, b) => a.position - b.position,
      );
      listsRef.current = nextLists;
      setLists(nextLists);
      return created;
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Liste konnte nicht gespeichert werden.",
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function addTask(input: Omit<CreateTaskInput, "boardId">) {
    const routing = await resolveTaskTargetList({
      currentListId: input.listId,
      scheduledDate: input.scheduledDate,
    });
    const scheduledDate = routing.scheduledDate;
    const recurrenceType = input.recurrenceType ?? "none";

    if (!user || !board || mode === "demo") {
      const now = new Date().toISOString();
      const created: Task = {
        id: crypto.randomUUID(),
        title: input.title,
        notes: input.notes ?? "",
        status: "open",
        scheduledDate,
        listId: routing.listId,
        position: getNextPositionForList(tasksRef.current, routing.listId),
        priority: input.priority ?? "normal",
        tags: input.tags ?? [],
        isEncrypted: input.isEncrypted ?? false,
        recurrenceType,
        recurrenceInterval: Math.max(1, input.recurrenceInterval ?? 1),
        recurrenceAnchorDate:
          recurrenceType === "none"
            ? null
            : input.recurrenceAnchorDate ?? scheduledDate,
        createdAt: now,
        updatedAt: now,
      };
      const nextTasks = [...tasksRef.current, created];
      tasksRef.current = nextTasks;
      setTasks(nextTasks);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const created = await createTask(user.id, {
        ...input,
        boardId: board.id,
        listId: routing.listId,
        scheduledDate,
        recurrenceAnchorDate:
          recurrenceType === "none"
            ? null
            : input.recurrenceAnchorDate ?? scheduledDate,
      });
      const nextTasks = [...tasksRef.current, created].sort(
        (a, b) => a.position - b.position,
      );
      tasksRef.current = nextTasks;
      setTasks(nextTasks);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Aufgabe konnte nicht gespeichert werden.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleTask(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    if (isFutureLockedTask(task)) {
      setError("Diese Aufgabe ist noch nicht fällig und kann noch nicht abgehakt werden.");
      return;
    }

    const nextStatus = task.status === "done" ? "open" : "done";
    const now = new Date().toISOString();
    const optimistic: Task = {
      ...task,
      status: nextStatus,
      completedAt: nextStatus === "done" ? now : null,
      updatedAt: now,
    };

    setTasks((current) =>
      current.map((item) => (item.id === taskId ? optimistic : item)),
    );

    if (mode === "demo") {
      if (nextStatus === "done" && (task.recurrenceType ?? "none") !== "none") {
        const nextDate = getNextRecurrenceDate(task);
        if (nextDate) {
          setTasks((current) => {
            const existing = findExistingNextRecurringTask(current, task, nextDate);
            if (existing) return current;

            const nextTask: Task = {
              ...task,
              id: crypto.randomUUID(),
              status: "open",
              scheduledDate: nextDate,
              completedAt: null,
              recurrenceAnchorDate: nextDate,
              position: current.filter((item) => item.listId === task.listId).length + 1,
              createdAt: now,
              updatedAt: now,
            };
            return [...current, nextTask];
          });
        }
      }
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateTaskStatus(task, nextStatus);
      const nextRecurringTask =
        nextStatus === "done" && user ? await createNextRecurringTask(user.id, task) : null;

      setTasks((current) => {
        const withUpdated = current.map((item) =>
          item.id === taskId ? updated : item,
        );
        if (!nextRecurringTask) return withUpdated;
        if (withUpdated.some((item) => item.id === nextRecurringTask.id)) {
          return withUpdated;
        }
        return [...withUpdated, nextRecurringTask];
      });
    } catch (nextError) {
      setTasks((current) =>
        current.map((item) => (item.id === taskId ? task : item)),
      );
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Aufgabe konnte nicht aktualisiert werden.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function editTask(taskId: string, input: UpdateTaskInput) {
    const previousTask = tasksRef.current.find((item) => item.id === taskId);
    if (!previousTask) return;

    const nextScheduledDate =
      input.scheduledDate === undefined
        ? previousTask.scheduledDate
        : (input.scheduledDate ?? "");
    const routing = await resolveTaskTargetList({
      currentListId: previousTask.listId ?? input.listId ?? "",
      scheduledDate: nextScheduledDate,
      status: previousTask.status,
    });
    const movedToAnotherList = routing.listId !== previousTask.listId;
    const nextPosition = movedToAnotherList
      ? getNextPositionForList(tasksRef.current, routing.listId, taskId)
      : previousTask.position;
    const patch: UpdateTaskInput = {
      ...input,
      scheduledDate: routing.scheduledDate || null,
      listId: routing.listId,
      position: nextPosition,
    };

    const optimistic: Task = {
      ...previousTask,
      title: input.title ?? previousTask.title,
      notes: input.notes ?? previousTask.notes,
      scheduledDate: routing.scheduledDate,
      listId: routing.listId,
      position: nextPosition,
      priority: input.priority ?? previousTask.priority,
      tags: input.tags ?? previousTask.tags,
      isEncrypted: input.isEncrypted ?? previousTask.isEncrypted,
      recurrenceType: input.recurrenceType ?? previousTask.recurrenceType,
      recurrenceInterval: input.recurrenceInterval ?? previousTask.recurrenceInterval,
      recurrenceAnchorDate:
        input.recurrenceAnchorDate === undefined
          ? previousTask.recurrenceAnchorDate
          : input.recurrenceAnchorDate,
      updatedAt: new Date().toISOString(),
    };

    const optimisticTasks = tasksRef.current.map((item) =>
      item.id === taskId ? optimistic : item,
    );
    tasksRef.current = optimisticTasks;
    setTasks(optimisticTasks);

    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateTask(taskId, patch);
      const nextTasks = tasksRef.current.map((item) =>
        item.id === taskId ? updated : item,
      );
      tasksRef.current = nextTasks;
      setTasks(nextTasks);
    } catch (nextError) {
      const revertedTasks = tasksRef.current.map((item) =>
        item.id === taskId ? previousTask : item,
      );
      tasksRef.current = revertedTasks;
      setTasks(revertedTasks);
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Aufgabe konnte nicht bearbeitet werden.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteTask(taskId: string) {
    const previousTasks = tasks;
    setTasks((current) => current.filter((task) => task.id !== taskId));

    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      await softDeleteTask(taskId);
    } catch (nextError) {
      setTasks(previousTasks);
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Aufgabe konnte nicht gelöscht werden.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteList(listId: string) {
    const previousLists = listsRef.current;
    const previousTasks = tasksRef.current;
    const listTasks = previousTasks.filter((task) => task.listId === listId);

    if (listTasks.length > 0) {
      const confirmed =
        typeof window === "undefined"
          ? true
          : window.confirm(
              `Diese Liste enthält ${listTasks.length} Aufgabe(n). Liste und Aufgaben wirklich löschen?`,
            );
      if (!confirmed) return;
    }

    const nextLists = withSequentialPositions<BoardList>(
      previousLists.filter((list) => list.id !== listId),
    );
    const nextTasks = previousTasks.filter((task) => task.listId !== listId);
    listsRef.current = nextLists;
    tasksRef.current = nextTasks;
    setLists(nextLists);
    setTasks(nextTasks);

    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      await Promise.all(listTasks.map((task) => softDeleteTask(task.id)));
      await deleteListById(listId);
      await updateListPositions(
        nextLists.map((list) => ({ id: list.id, position: list.position })),
      );
    } catch (nextError) {
      listsRef.current = previousLists;
      tasksRef.current = previousTasks;
      setLists(previousLists);
      setTasks(previousTasks);
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Liste konnte nicht gelöscht werden.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function renameList(listId: string, title: string) {
    const previous = listsRef.current;
    const optimisticLists = previous.map((list) =>
      list.id === listId
        ? {
            ...list,
            title,
            date: parseListDateFromTitle(title),
            updatedAt: new Date().toISOString(),
          }
        : list,
    );
    listsRef.current = optimisticLists;
    setLists(optimisticLists);

    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateListTitle(listId, title);
      const nextLists = listsRef.current.map((list) =>
        list.id === listId ? updated : list,
      );
      listsRef.current = nextLists;
      setLists(nextLists);
    } catch (nextError) {
      listsRef.current = previous;
      setLists(previous);
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Liste konnte nicht umbenannt werden.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleListCollapsed(listId: string) {
    const list = lists.find((item) => item.id === listId);
    if (!list) return;
    const nextCollapsed = !list.collapsed;
    const previous = lists;

    setLists((current) =>
      current.map((item) =>
        item.id === listId ? { ...item, collapsed: nextCollapsed } : item,
      ),
    );

    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateListCollapsed(listId, nextCollapsed);
      setLists((current) =>
        current.map((item) => (item.id === listId ? updated : item)),
      );
    } catch (nextError) {
      setLists(previous);
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Liste konnte nicht eingeklappt werden.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function listOrderSignature(nextLists: BoardList[]) {
    return nextLists.map((list) => `${list.id}:${list.position}`).join("|");
  }

  function taskOrderSignature(nextTasks: Task[]) {
    return nextTasks
      .map(
        (task) =>
          `${task.id}:${task.listId ?? "none"}:${task.position}:${task.scheduledDate}`,
      )
      .sort()
      .join("|");
  }

  function previewMoveList(activeListId: string, overListId: string) {
    if (activeListId === overListId) return;
    const previous = listsRef.current;
    const next = reorderById(previous, activeListId, overListId);
    if (listOrderSignature(previous) === listOrderSignature(next)) return;
    listsRef.current = next;
    setLists(next);
  }

  function previewMoveTask(
    taskId: string,
    targetListId: string,
    overTaskId?: string | null,
  ) {
    const previous = tasksRef.current;
    const next = reorderTasksForMove({
      currentTasks: previous,
      currentLists: listsRef.current,
      taskId,
      targetListId,
      overTaskId,
    });
    if (taskOrderSignature(previous) === taskOrderSignature(next)) return;
    tasksRef.current = next;
    setTasks(next);
  }

  async function persistListOrder() {
    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      await updateListPositions(
        listsRef.current.map((list) => ({
          id: list.id,
          position: list.position,
        })),
      );
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Listenreihenfolge konnte nicht gespeichert werden.",
      );
      void load();
    } finally {
      setIsSaving(false);
    }
  }

  async function persistTaskOrder() {
    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      await updateTaskOrder(
        tasksRef.current.map((task) => ({
          id: task.id,
          listId: task.listId ?? null,
          position: task.position,
          scheduledDate: task.scheduledDate,
        })),
      );
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Aufgabenreihenfolge konnte nicht gespeichert werden.",
      );
      void load();
    } finally {
      setIsSaving(false);
    }
  }

  async function addBoard(title = "Neues Board") {
    if (!user || mode === "demo") {
      const now = new Date().toISOString();
      const created: Board = {
        id: crypto.randomUUID(),
        userId: "demo",
        title,
        createdAt: now,
        updatedAt: now,
        archivedAt: null,
      };
      setBoards((current) => [...current, created]);
      setBoard(created);
      setLists([]);
      setTasks([]);
      return created;
    }

    setIsSaving(true);
    setError(null);
    try {
      const created = await createBoard(user.id, title);
      setBoards((current) => [...current, created]);
      setBoard(created);
      setLists([]);
      setTasks([]);
      return created;
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Board konnte nicht erstellt werden.",
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function renameBoard(title: string) {
    if (!board) return null;
    const cleanTitle = title.trim() || "Unbenanntes Board";
    const previousBoard = board;
    const previousBoards = boards;
    const optimistic = { ...board, title: cleanTitle, updatedAt: new Date().toISOString() };
    setBoard(optimistic);
    setBoards((current) => current.map((item) => (item.id === board.id ? optimistic : item)));

    if (mode === "demo") return optimistic;

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateBoardTitle(board.id, cleanTitle);
      setBoard(updated);
      setBoards((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      return updated;
    } catch (nextError) {
      setBoard(previousBoard);
      setBoards(previousBoards);
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Board konnte nicht umbenannt werden.",
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteBoard() {
    if (!board) return null;
    const confirmed =
      typeof window === "undefined"
        ? true
        : window.confirm(
            `Board "${board.title}" archivieren? Listen und Aufgaben bleiben in Supabase erhalten, das Board wird aber ausgeblendet.`,
          );
    if (!confirmed) return null;

    const previousBoard = board;
    const previousBoards = boards;
    const remainingBoards = boards.filter((item) => item.id !== board.id);
    const nextBoard = remainingBoards[0] ?? null;
    setBoards(remainingBoards);
    setBoard(nextBoard);
    setLists([]);
    setTasks([]);

    if (mode === "demo") return nextBoard;

    setIsSaving(true);
    setError(null);
    try {
      await archiveBoard(previousBoard.id);
      if (nextBoard) {
        const nextLists = await listBoardLists(nextBoard.id);
        const nextTasks = await listTasks(nextBoard.id);
        setLists(nextLists);
        setTasks(nextTasks);
      }
      return nextBoard;
    } catch (nextError) {
      setBoards(previousBoards);
      setBoard(previousBoard);
      await load();
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Board konnte nicht archiviert werden.",
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  return {
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
    reload: load,
    addBoard,
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
  };
}
