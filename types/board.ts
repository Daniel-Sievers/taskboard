export type Board = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
};

export type BoardList = {
  id: string;
  userId: string;
  boardId: string;
  title: string;
  date?: string | null;
  position: number;
  collapsed: boolean;
  createdAt: string;
  updatedAt: string;
};
