export type TaskStatus = "open" | "done" | "archived";
export type TaskPriority = "low" | "normal" | "high";
export type TaskRecurrenceType = "none" | "daily" | "weekly" | "monthly" | "interval";

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
  recurrenceType?: TaskRecurrenceType;
  recurrenceInterval?: number;
  recurrenceAnchorDate?: string | null;
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
  recurrenceType?: TaskRecurrenceType;
  recurrenceInterval?: number;
  recurrenceAnchorDate?: string | null;
};

export type UpdateTaskInput = {
  title?: string;
  notes?: string;
  scheduledDate?: string | null;
  listId?: string | null;
  position?: number;
  priority?: TaskPriority;
  tags?: string[];
  isEncrypted?: boolean;
  recurrenceType?: TaskRecurrenceType;
  recurrenceInterval?: number;
  recurrenceAnchorDate?: string | null;
};
