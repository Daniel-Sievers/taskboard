import type { Board, BoardList } from "@/types/board";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

type BoardRow = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

type ListRow = {
  id: string;
  user_id: string;
  board_id: string;
  title: string;
  date: string | null;
  position: number;
  collapsed: boolean;
  created_at: string;
  updated_at: string;
};

type TaskRow = {
  id: string;
  user_id: string;
  board_id: string;
  list_id: string | null;
  title: string;
  notes: string | null;
  status: string;
  scheduled_date: string | null;
  position: number;
  priority: number | string | null;
  tags: string[] | null;
  is_encrypted: boolean;
  encrypted_payload: string | null;
  completed_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export function mapBoard(row: BoardRow): Board {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at
  };
}

export function mapList(row: ListRow): BoardList {
  return {
    id: row.id,
    userId: row.user_id,
    boardId: row.board_id,
    title: row.title,
    date: row.date,
    position: Number(row.position),
    collapsed: row.collapsed,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapPriority(priority: number | string | null): TaskPriority {
  if (priority === "low" || priority === 0) return "low";
  if (priority === "high" || priority === 2) return "high";
  return "normal";
}

export function priorityToDb(priority: TaskPriority) {
  if (priority === "low") return 0;
  if (priority === "high") return 2;
  return 1;
}

export function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    userId: row.user_id,
    boardId: row.board_id,
    listId: row.list_id,
    title: row.title,
    notes: row.notes ?? "",
    status: (row.status as TaskStatus) ?? "open",
    scheduledDate: row.scheduled_date ?? row.created_at.slice(0, 10),
    position: Number(row.position),
    priority: mapPriority(row.priority),
    tags: row.tags ?? [],
    isEncrypted: row.is_encrypted,
    encryptedPayload: row.encrypted_payload,
    completedAt: row.completed_at,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
