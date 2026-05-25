import { supabase } from "@/lib/supabase/client";
import type { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from "@/types/task";
import { mapTask, priorityToDb } from "./mappers";

export async function listTasks(boardId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("board_id", boardId)
    .is("deleted_at", null)
    .order("position", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapTask);
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

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      board_id: input.boardId,
      list_id: input.listId,
      title: input.title,
      notes: input.notes ?? "",
      status: "open",
      scheduled_date: input.scheduledDate ?? null,
      position: nextPosition,
      priority: priorityToDb(input.priority ?? "normal"),
      tags: input.tags ?? [],
      is_encrypted: input.isEncrypted ?? false
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapTask(data);
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
  return mapTask(data);
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

  const { data, error } = await supabase
    .from("tasks")
    .update(patch)
    .eq("id", taskId)
    .select("*")
    .single();

  if (error) throw error;
  return mapTask(data);
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
