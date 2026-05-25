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
  createTask,
  listTasks,
  softDeleteTask,
  updateTask,
  updateTaskOrder,
  updateTaskStatus,
} from "@/lib/db/tasks";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { toDateKey } from "@/lib/dates/calendar";
import { reorderById, withSequentialPositions } from "@/lib/dnd/reorder";
import { initialDemoTasks } from "@/lib/demo-data";
import type { Board, BoardList } from "@/types/board";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task";
import type { User } from "@supabase/supabase-js";

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
  const nextScheduledDate = targetList.date ?? movingTask.scheduledDate;
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

export function useTaskboard(user: User | null, requestedBoardId?: string | null) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<BoardList[]>([]);
  const [tasks, setTasks] = useState<Task[]>(initialDemoTasks);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"demo" | "supabase">("demo");
  const listsRef = useRef<BoardList[]>([]);
  const tasksRef = useRef<Task[]>(initialDemoTasks);

  useEffect(() => {
    listsRef.current = lists;
  }, [lists]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured || !user) {
      setMode("demo");
      setTasks(initialDemoTasks);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [user, requestedBoardId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function addList(title = "Neue Liste") {
    const now = new Date().toISOString();

    if (!user || !board || mode === "demo") {
      const created: BoardList = {
        id: crypto.randomUUID(),
        userId: "demo",
        boardId: "demo-board",
        title,
        date: null,
        position: lists.length + 1,
        collapsed: false,
        createdAt: now,
        updatedAt: now,
      };
      setLists((current) => [...current, created]);
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
      setLists((current) =>
        [...current, created].sort((a, b) => a.position - b.position),
      );
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
    if (!user || !board || mode === "demo") {
      const now = new Date().toISOString();
      setTasks((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          title: input.title,
          notes: input.notes ?? "",
          status: "open",
          scheduledDate: input.scheduledDate ?? toDateKey(new Date()),
          listId: input.listId,
          position:
            current.filter((task) => task.listId === input.listId).length + 1,
          priority: input.priority ?? "normal",
          tags: input.tags ?? [],
          isEncrypted: input.isEncrypted ?? false,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const created = await createTask(user.id, {
        ...input,
        boardId: board.id,
      });
      setTasks((current) =>
        [...current, created].sort((a, b) => a.position - b.position),
      );
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

    const nextStatus = task.status === "done" ? "open" : "done";
    const optimistic: Task = {
      ...task,
      status: nextStatus,
      completedAt: nextStatus === "done" ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    setTasks((current) =>
      current.map((item) => (item.id === taskId ? optimistic : item)),
    );

    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateTaskStatus(task, nextStatus);
      setTasks((current) =>
        current.map((item) => (item.id === taskId ? updated : item)),
      );
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
    const previousTask = tasks.find((item) => item.id === taskId);
    if (!previousTask) return;

    const optimistic: Task = {
      ...previousTask,
      title: input.title ?? previousTask.title,
      notes: input.notes ?? previousTask.notes,
      scheduledDate:
        input.scheduledDate === undefined
          ? previousTask.scheduledDate
          : (input.scheduledDate ?? ""),
      priority: input.priority ?? previousTask.priority,
      tags: input.tags ?? previousTask.tags,
      isEncrypted: input.isEncrypted ?? previousTask.isEncrypted,
      updatedAt: new Date().toISOString(),
    };

    setTasks((current) =>
      current.map((item) => (item.id === taskId ? optimistic : item)),
    );

    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateTask(taskId, input);
      setTasks((current) =>
        current.map((item) => (item.id === taskId ? updated : item)),
      );
    } catch (nextError) {
      setTasks((current) =>
        current.map((item) => (item.id === taskId ? previousTask : item)),
      );
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
    const previous = lists;
    setLists((current) =>
      current.map((list) => (list.id === listId ? { ...list, title } : list)),
    );

    if (mode === "demo") return;

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateListTitle(listId, title);
      setLists((current) =>
        current.map((list) => (list.id === listId ? updated : list)),
      );
    } catch (nextError) {
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
