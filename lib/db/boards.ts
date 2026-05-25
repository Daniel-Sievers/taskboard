import { supabase } from "@/lib/supabase/client";
import type { Board } from "@/types/board";
import { mapBoard } from "./mappers";

export async function listBoards(userId: string): Promise<Board[]> {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("user_id", userId)
    .is("archived_at", null)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapBoard);
}

export async function createBoard(
  userId: string,
  title = "Hauptboard",
): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .insert({ user_id: userId, title })
    .select("*")
    .single();

  if (error) throw error;
  return mapBoard(data);
}

export async function updateBoardTitle(
  boardId: string,
  title: string,
): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", boardId)
    .select("*")
    .single();

  if (error) throw error;
  return mapBoard(data);
}

export async function archiveBoard(boardId: string): Promise<void> {
  const { error } = await supabase
    .from("boards")
    .update({ archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", boardId);

  if (error) throw error;
}

export async function getOrCreateDefaultBoard(userId: string): Promise<Board> {
  const boards = await listBoards(userId);
  if (boards[0]) return boards[0];
  return createBoard(userId, "Hauptboard");
}
