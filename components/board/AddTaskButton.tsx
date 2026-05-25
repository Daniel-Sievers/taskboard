"use client";

import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useI18n } from "@/hooks/useI18n";
import type { TaskPriority } from "@/types/task";

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function AddTaskButton({
  listId,
  dateKey,
  onAddTask
}: {
  listId: string;
  dateKey?: string | null;
  onAddTask: (input: { listId: string; title: string; notes: string; scheduledDate?: string; priority: TaskPriority; tags: string[]; isEncrypted: boolean }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("normal");
  const [tags, setTags] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const { t } = useI18n();

  function reset() {
    setTitle("");
    setNotes("");
    setPriority("normal");
    setTags("");
    setIsEncrypted(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      listId,
      title: title.trim(),
      notes: notes.trim(),
      scheduledDate: dateKey ?? undefined,
      priority,
      tags: parseTags(tags),
      isEncrypted
    });
    reset();
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-5 flex items-center gap-3 rounded-2xl px-1 py-2 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-blue-300"
      >
        <Plus className="h-4 w-4 text-blue-400" />
        {t("task.add")}
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-200">{t("task.new")}</p>
        <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white" aria-label={t("task.closeEditor")}>
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 space-y-3">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t("task.titlePlaceholder")} autoFocus />
        <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={t("task.notesPlaceholder")} />
        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="low">{t("task.priorityLow")}</option>
            <option value="normal">{t("task.priorityNormal")}</option>
            <option value="high">{t("task.priorityHigh")}</option>
          </select>
          <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder={t("task.tagsPlaceholder")} />
        </div>
        <label className="flex items-center gap-3 text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={isEncrypted}
            onChange={(event) => setIsEncrypted(event.target.checked)}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 accent-blue-500"
          />
          {t("task.markSensitive")}
        </label>
        <div className="flex gap-2">
          <Button type="submit" size="sm">{t("task.addSubmit")}</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>{t("task.cancel")}</Button>
        </div>
      </div>
    </form>
  );
}
