import { format } from "date-fns";
import { de } from "date-fns/locale";
import { supabase } from "@/lib/supabase/client";
import type { BoardList } from "@/types/board";
import { mapList } from "./mappers";

export async function listBoardLists(boardId: string): Promise<BoardList[]> {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("board_id", boardId)
    .order("position", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapList);
}

export async function createList(input: {
  userId: string;
  boardId: string;
  title: string;
  date?: string | null;
  position: number;
}): Promise<BoardList> {
  const { data, error } = await supabase
    .from("lists")
    .insert({
      user_id: input.userId,
      board_id: input.boardId,
      title: input.title,
      date: input.date ?? null,
      position: input.position,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapList(data);
}

export async function createCustomList(input: {
  userId: string;
  boardId: string;
  title?: string;
}): Promise<BoardList> {
  const { data: maxPositionData, error: maxPositionError } = await supabase
    .from("lists")
    .select("position")
    .eq("board_id", input.boardId)
    .order("position", { ascending: false })
    .limit(1);

  if (maxPositionError) throw maxPositionError;

  const nextPosition = maxPositionData?.[0]?.position
    ? Number(maxPositionData[0].position) + 1
    : 1;

  return createList({
    userId: input.userId,
    boardId: input.boardId,
    title: input.title?.trim() || "Neue Liste",
    date: null,
    position: nextPosition,
  });
}

export async function deleteListById(listId: string): Promise<void> {
  const { error } = await supabase.from("lists").delete().eq("id", listId);

  if (error) throw error;
}

export async function updateListTitle(
  listId: string,
  title: string,
): Promise<BoardList> {
  const { data, error } = await supabase
    .from("lists")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", listId)
    .select("*")
    .single();

  if (error) throw error;
  return mapList(data);
}

export async function updateListCollapsed(
  listId: string,
  collapsed: boolean,
): Promise<BoardList> {
  const { data, error } = await supabase
    .from("lists")
    .update({ collapsed, updated_at: new Date().toISOString() })
    .eq("id", listId)
    .select("*")
    .single();

  if (error) throw error;
  return mapList(data);
}

export async function updateListPositions(
  updates: Array<{ id: string; position: number }>,
): Promise<void> {
  const now = new Date().toISOString();
  const results = await Promise.all(
    updates.map((item) =>
      supabase
        .from("lists")
        .update({ position: item.position, updated_at: now })
        .eq("id", item.id),
    ),
  );

  const error = results.find((result) => result.error)?.error;
  if (error) throw error;
}

export function titleForDate(dateKey: string) {
  // Use noon to avoid timezone edge cases when formatting date-only strings.
  return format(new Date(`${dateKey}T12:00:00`), "EEEE, dd.MM.yyyy", {
    locale: de,
  });
}

export async function ensureDateLists(input: {
  userId: string;
  boardId: string;
  existingLists: BoardList[];
  dateKeys: string[];
}): Promise<BoardList[]> {
  const lists = [...input.existingLists];
  let nextPosition =
    lists.length > 0 ? Math.max(...lists.map((list) => list.position)) + 1 : 1;

  for (const dateKey of input.dateKeys) {
    if (lists.some((list) => list.date === dateKey)) continue;

    const created = await createList({
      userId: input.userId,
      boardId: input.boardId,
      title: titleForDate(dateKey),
      date: dateKey,
      position: nextPosition,
    });
    lists.push(created);
    nextPosition += 1;
  }

  return lists.sort((a, b) => a.position - b.position);
}
