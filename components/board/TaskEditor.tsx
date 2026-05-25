"use client";

import { FormEvent, useState } from "react";
import { Lock, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useI18n } from "@/hooks/useI18n";
import type { Task, TaskPriority, UpdateTaskInput } from "@/types/task";

function tagsToText(tags: string[]) {
  return tags.join(", ");
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function TaskEditor({
  task,
  onSave,
  onCancel
}: {
  task: Task;
  onSave: (input: UpdateTaskInput) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes);
  const [scheduledDate, setScheduledDate] = useState(task.scheduledDate ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [tags, setTags] = useState(tagsToText(task.tags));
  const [isEncrypted, setIsEncrypted] = useState(task.isEncrypted);
  const { t } = useI18n();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;

    onSave({
      title: nextTitle,
      notes: notes.trim(),
      scheduledDate: scheduledDate || null,
      priority,
      tags: parseTags(tags),
      isEncrypted
    });
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-blue-400/20 bg-blue-950/10 p-4 shadow-2xl shadow-black/25">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-200">{t("task.edit")}</p>
        <button type="button" onClick={onCancel} className="rounded-xl p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-100" aria-label={t("task.closeEditor")}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t("task.titlePlaceholder")} autoFocus />
        <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={t("task.notesPlaceholder")} />

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5 text-xs text-zinc-500">
            {t("task.due")}
            <Input type="date" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} />
          </label>
          <label className="space-y-1.5 text-xs text-zinc-500">
            {t("task.priority")}
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="low">{t("task.priorityLow")}</option>
              <option value="normal">{t("task.priorityNormal")}</option>
              <option value="high">{t("task.priorityHigh")}</option>
            </select>
          </label>
        </div>

        <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder={t("task.tagsPlaceholder")} />

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={isEncrypted}
            onChange={(event) => setIsEncrypted(event.target.checked)}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 accent-blue-500"
          />
          <Lock className="h-4 w-4 text-amber-300" />
          {t("task.markSensitive")}
        </label>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm"><Save className="h-4 w-4" /> {t("task.save")}</Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>{t("task.cancel")}</Button>
        </div>
      </div>
    </form>
  );
}
