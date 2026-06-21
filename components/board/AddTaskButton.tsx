"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskModal } from "./TaskModal";
import { useI18n } from "@/hooks/useI18n";
import type { TaskPriority, TaskRecurrenceType } from "@/types/task";

export function AddTaskButton({
  listId,
  dateKey,
  listTitle,
  onAddTask,
}: {
  listId: string;
  dateKey?: string | null;
  listTitle?: string;
  onAddTask: (input: {
    listId: string;
    title: string;
    notes: string;
    scheduledDate?: string;
    priority: TaskPriority;
    tags: string[];
    isEncrypted: boolean;
    recurrenceType?: TaskRecurrenceType;
    recurrenceInterval?: number;
    recurrenceAnchorDate?: string | null;
  }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-5 flex items-center gap-3 rounded-2xl px-1 py-2 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-blue-300"
      >
        <Plus className="h-4 w-4 text-blue-400" />
        {t("task.add")}
      </button>

      {isOpen ? (
        <TaskModal
          mode="create"
          defaultScheduledDate={dateKey}
          listTitle={listTitle}
          onCancel={() => setIsOpen(false)}
          onSave={(input) => {
            onAddTask({
              listId,
              title: input.title,
              notes: input.notes,
              scheduledDate: input.scheduledDate,
              priority: input.priority,
              tags: input.tags,
              isEncrypted: input.isEncrypted,
              recurrenceType: input.recurrenceType,
              recurrenceInterval: input.recurrenceInterval,
              recurrenceAnchorDate: input.recurrenceAnchorDate,
            });
            setIsOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
