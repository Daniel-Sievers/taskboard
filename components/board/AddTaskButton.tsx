"use client";

import { Plus } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

export function AddTaskButton({ onClick }: { onClick: () => void }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 flex items-center gap-3 rounded-2xl px-1 py-2 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-blue-300"
    >
      <Plus className="h-4 w-4 text-blue-400" />
      {t("task.add")}
    </button>
  );
}
