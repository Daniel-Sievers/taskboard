export type TaskStatus = "open" | "done" | "archived";
export type TaskPriority = "low" | "normal" | "high";

export type Task = {
  id: string;
  userId?: string;
  boardId?: string;
  listId?: string | null;
  title: string;
  notes: string;
  status: TaskStatus;
  scheduledDate: string;
  position: number;
  priority: TaskPriority;
  tags: string[];
  isEncrypted: boolean;
  encryptedPayload?: string | null;
  completedAt?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
  boardId: string;
  listId: string;
  title: string;
  notes?: string;
  scheduledDate?: string;
  priority?: TaskPriority;
  tags?: string[];
  isEncrypted?: boolean;
};

export type UpdateTaskInput = {
  title?: string;
  notes?: string;
  scheduledDate?: string | null;
  priority?: TaskPriority;
  tags?: string[];
  isEncrypted?: boolean;
};
