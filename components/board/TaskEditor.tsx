"use client";

import { FormEvent, useState } from "react";
import { Lock, Repeat2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { usePreferences } from "@/hooks/usePreferences";
import { useI18n } from "@/hooks/useI18n";
import type { Task, TaskPriority, TaskRecurrenceType, UpdateTaskInput } from "@/types/task";

function tagsToText(tags: string[]) {
  return tags.join(", ");
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function recurrenceOptions(language: string) {
  if (language === "en") {
    return [
      { value: "none", label: "No repeat" },
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "interval", label: "Every X days" },
    ] as const;
  }

  return [
    { value: "none", label: "Keine Wiederholung" },
    { value: "daily", label: "Täglich" },
    { value: "weekly", label: "Wöchentlich" },
    { value: "monthly", label: "Monatlich" },
    { value: "interval", label: "Alle X Tage" },
  ] as const;
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
  const [recurrenceType, setRecurrenceType] = useState<TaskRecurrenceType>(task.recurrenceType ?? "none");
  const [recurrenceInterval, setRecurrenceInterval] = useState(String(task.recurrenceInterval || 1));
  const { t } = useI18n();
  const { preferences } = usePreferences();
  const options = recurrenceOptions(preferences.language);
  const showInterval = recurrenceType === "interval";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;

    const interval = Math.max(1, Number.parseInt(recurrenceInterval, 10) || 1);
    const nextScheduledDate = scheduledDate || null;

    onSave({
      title: nextTitle,
      notes: notes.trim(),
      scheduledDate: nextScheduledDate,
      priority,
      tags: parseTags(tags),
      isEncrypted,
      recurrenceType,
      recurrenceInterval: recurrenceType === "none" ? 1 : interval,
      recurrenceAnchorDate: recurrenceType === "none" ? null : nextScheduledDate,
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

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><Repeat2 className="h-3.5 w-3.5" /> {preferences.language === "en" ? "Repeat" : "Wiederholung"}</span>
            <select
              value={recurrenceType}
              onChange={(event) => setRecurrenceType(event.target.value as TaskRecurrenceType)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          {showInterval ? (
            <label className="space-y-1.5 text-xs text-zinc-500">
              {preferences.language === "en" ? "Interval in days" : "Intervall in Tagen"}
              <Input
                type="number"
                min="1"
                max="365"
                value={recurrenceInterval}
                onChange={(event) => setRecurrenceInterval(event.target.value)}
              />
            </label>
          ) : null}
        </div>

        {recurrenceType !== "none" ? (
          <p className="rounded-2xl border border-cyan-400/15 bg-cyan-500/5 px-3 py-2 text-xs leading-5 text-cyan-100/75">
            {preferences.language === "en"
              ? "When this task is completed, Taskboard creates the next open copy in the same list. Future copies are visible, but cannot be checked off before their date."
              : "Wenn diese Aufgabe erledigt wird, erstellt Taskboard die nächste offene Kopie in derselben Liste. Zukünftige Kopien sind sichtbar, können aber erst am Fälligkeitsdatum abgehakt werden."}
          </p>
        ) : null}

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
