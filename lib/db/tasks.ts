import { supabase } from "@/lib/supabase/client";
import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskRecurrenceType,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task";
import { mapTask, priorityToDb } from "./mappers";

type BaseTaskRow = Parameters<typeof mapTask>[0];

type TaskRow = BaseTaskRow & {
  recurrence_type?: unknown;
  recurrence_interval?: unknown;
  recurrence_anchor_date?: unknown;
};

function normalizeRecurrenceType(value: unknown): TaskRecurrenceType {
  if (
    value === "daily" ||
    value === "weekly" ||
    value === "monthly" ||
    value === "interval"
  ) {
    return value;
  }
  return "none";
}

function normalizeInterval(value: unknown) {
  const parsed = Number(value ?? 1);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(365, Math.floor(parsed));
}

function mapRecurringTask(row: TaskRow): Task {
  const task = mapTask(row);
  return {
    ...task,
    recurrenceType: normalizeRecurrenceType(row.recurrence_type),
    recurrenceInterval: normalizeInterval(row.recurrence_interval),
    recurrenceAnchorDate:
      typeof row.recurrence_anchor_date === "string"
        ? row.recurrence_anchor_date
        : null,
  };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getNextRecurrenceDate(task: Task, completedAt = new Date()) {
  if ((task.recurrenceType ?? "none") === "none") return null;

  const interval = Math.max(1, task.recurrenceInterval || 1);
  const base = new Date(completedAt);
  base.setHours(0, 0, 0, 0);

  if (Number.isNaN(base.getTime())) return null;

  if (task.recurrenceType === "daily") return toDateKey(addDays(base, interval));
  if (task.recurrenceType === "weekly") return toDateKey(addDays(base, interval * 7));
  if (task.recurrenceType === "monthly") return toDateKey(addMonths(base, interval));
  if (task.recurrenceType === "interval") return toDateKey(addDays(base, interval));

  return null;
}

export async function listTasks(boardId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("board_id", boardId)
    .is("deleted_at", null)
    .order("position", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as TaskRow[]).map(mapRecurringTask);
}

export async function createTask(userId: string, input: CreateTaskInput): Promise<Task> {
  const { data: maxPositionData, error: maxPositionError } = await supabase
    .from("tasks")
    .select("position")
    .eq("list_id", input.listId)
    .is("deleted_at", null)
    .order("position", { ascending: false })
    .limit(1);

  if (maxPositionError) throw maxPositionError;

  const nextPosition = maxPositionData?.[0]?.position ? Number(maxPositionData[0].position) + 1 : 1;
  const recurrenceType = input.recurrenceType ?? "none";
  const scheduledDate = input.scheduledDate ?? null;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      board_id: input.boardId,
      list_id: input.listId,
      title: input.title,
      notes: input.notes ?? "",
      status: "open",
      scheduled_date: scheduledDate,
      position: nextPosition,
      priority: priorityToDb(input.priority ?? "normal"),
      tags: input.tags ?? [],
      is_encrypted: input.isEncrypted ?? false,
      recurrence_type: recurrenceType,
      recurrence_interval: Math.max(1, input.recurrenceInterval ?? 1),
      recurrence_anchor_date:
        recurrenceType === "none" ? null : input.recurrenceAnchorDate ?? scheduledDate,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRecurringTask(data as TaskRow);
}

export async function createNextRecurringTask(userId: string, task: Task): Promise<Task | null> {
  const nextDate = getNextRecurrenceDate(task);
  if (!nextDate || !task.boardId || !task.listId || (task.recurrenceType ?? "none") === "none") return null;

  return createTask(userId, {
    boardId: task.boardId,
    listId: task.listId,
    title: task.title,
    notes: task.notes,
    scheduledDate: nextDate,
    priority: task.priority,
    tags: task.tags,
    isEncrypted: task.isEncrypted,
    recurrenceType: task.recurrenceType ?? "none",
    recurrenceInterval: task.recurrenceInterval ?? 1,
    recurrenceAnchorDate: nextDate,
  });
}

export async function updateTaskStatus(task: Task, status: TaskStatus): Promise<Task> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: status === "done" ? now : null,
      updated_at: now
    })
    .eq("id", task.id)
    .select("*")
    .single();

  if (error) throw error;
  return mapRecurringTask(data as TaskRow);
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  };

  if (input.title !== undefined) patch.title = input.title;
  if (input.notes !== undefined) patch.notes = input.notes;
  if (input.scheduledDate !== undefined) patch.scheduled_date = input.scheduledDate || null;
  if (input.priority !== undefined) patch.priority = priorityToDb(input.priority);
  if (input.tags !== undefined) patch.tags = input.tags;
  if (input.isEncrypted !== undefined) patch.is_encrypted = input.isEncrypted;
  if (input.recurrenceType !== undefined) patch.recurrence_type = input.recurrenceType;
  if (input.recurrenceInterval !== undefined) patch.recurrence_interval = Math.max(1, input.recurrenceInterval);
  if (input.recurrenceAnchorDate !== undefined) patch.recurrence_anchor_date = input.recurrenceAnchorDate || null;

  if (input.recurrenceType === "none") {
    patch.recurrence_interval = 1;
    patch.recurrence_anchor_date = null;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(patch)
    .eq("id", taskId)
    .select("*")
    .single();

  if (error) throw error;
  return mapRecurringTask(data as TaskRow);
}

export async function updateTaskText(taskId: string, input: { title: string; notes: string }): Promise<Task> {
  return updateTask(taskId, input);
}

export async function updateTaskOrder(updates: Array<{ id: string; listId: string | null; position: number; scheduledDate?: string | null }>): Promise<void> {
  const now = new Date().toISOString();
  const results = await Promise.all(
    updates.map((item) =>
      supabase
        .from("tasks")
        .update({
          list_id: item.listId,
          position: item.position,
          scheduled_date: item.scheduledDate || null,
          updated_at: now
        })
        .eq("id", item.id)
    )
  );

  const error = results.find((result) => result.error)?.error;
  if (error) throw error;
}

export async function softDeleteTask(id: string) {
  const { error } = await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  return { id };
}
