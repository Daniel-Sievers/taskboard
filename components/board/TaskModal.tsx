"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Flag, Info, Lock, Repeat2, Save, StickyNote, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { usePreferences } from "@/hooks/usePreferences";
import { useI18n } from "@/hooks/useI18n";
import { getRecurrenceRuleLabel, getRecurringTaskStatus, isRecurringTask } from "@/lib/recurrence";
import type { Task, TaskPriority, TaskRecurrenceType } from "@/types/task";

export type TaskModalInput = {
  title: string;
  notes: string;
  scheduledDate?: string;
  priority: TaskPriority;
  tags: string[];
  isEncrypted: boolean;
  recurrenceType: TaskRecurrenceType;
  recurrenceInterval: number;
  recurrenceAnchorDate: string | null;
};

type FieldKey = "notes" | "date" | "priority" | "recurrence" | "tags" | "sensitive";

type VisibleFields = Record<FieldKey, boolean>;

function tagsToText(tags: string[]) {
  return tags.join(", ");
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function defaultVisibleFields(): VisibleFields {
  return {
    notes: true,
    date: true,
    priority: true,
    recurrence: true,
    tags: true,
    sensitive: true,
  };
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

export function TaskModal({
  mode,
  task,
  defaultScheduledDate,
  listTitle,
  onSave,
  onCancel,
}: {
  mode: "create" | "edit";
  task?: Task;
  defaultScheduledDate?: string | null;
  listTitle?: string;
  onSave: (input: TaskModalInput) => void;
  onCancel: () => void;
}) {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const [title, setTitle] = useState(task?.title ?? "");
  const [notes, setNotes] = useState(task?.notes ?? "");
  const [scheduledDate, setScheduledDate] = useState(
    task?.scheduledDate ?? defaultScheduledDate ?? "",
  );
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "normal",
  );
  const [tags, setTags] = useState(tagsToText(task?.tags ?? []));
  const [isEncrypted, setIsEncrypted] = useState(task?.isEncrypted ?? false);
  const [recurrenceType, setRecurrenceType] = useState<TaskRecurrenceType>(
    task?.recurrenceType ?? "none",
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState(
    String(task?.recurrenceInterval || 1),
  );
  const [visibleFields, setVisibleFields] = useState<VisibleFields>(() =>
    defaultVisibleFields(),
  );
  const [titleTouched, setTitleTouched] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const options = useMemo(
    () => recurrenceOptions(preferences.language),
    [preferences.language],
  );
  const showInterval = recurrenceType === "interval";
  const titleError = titleTouched && title.trim().length === 0;
  const wasRecurring = Boolean(task && isRecurringTask(task));
  const currentRecurrenceLabel = task ? getRecurrenceRuleLabel(task, preferences.language) : null;
  const currentRecurrenceStatus = task ? getRecurringTaskStatus(task, preferences.language) : null;
  const recurrenceStopped = wasRecurring && recurrenceType === "none";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  function toggleField(field: FieldKey) {
    setVisibleFields((current) => ({ ...current, [field]: !current[field] }));
  }

  function stopRecurrence() {
    setVisibleFields((current) => ({ ...current, recurrence: true }));
    setRecurrenceType("none");
    setRecurrenceInterval("1");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTitleTouched(true);

    const nextTitle = title.trim();
    if (!nextTitle) return;

    const interval = Math.max(1, Number.parseInt(recurrenceInterval, 10) || 1);
    const nextScheduledDate = scheduledDate || "";
    const nextRecurrenceType = recurrenceType;

    onSave({
      title: nextTitle,
      notes: notes.trim(),
      scheduledDate: nextScheduledDate || undefined,
      priority,
      tags: parseTags(tags),
      isEncrypted,
      recurrenceType: nextRecurrenceType,
      recurrenceInterval: nextRecurrenceType === "none" ? 1 : interval,
      recurrenceAnchorDate:
        nextRecurrenceType === "none" ? null : nextScheduledDate || null,
    });
  }

  const fieldButtons: Array<{
    key: FieldKey;
    label: string;
    icon: typeof StickyNote;
  }> = [
    { key: "date", label: t("task.fieldDate"), icon: CalendarDays },
    { key: "notes", label: t("task.fieldNotes"), icon: StickyNote },
    { key: "priority", label: t("task.fieldPriority"), icon: Flag },
    { key: "recurrence", label: t("task.fieldRecurrence"), icon: Repeat2 },
    { key: "tags", label: t("task.fieldLabels"), icon: Tag },
    { key: "sensitive", label: t("task.fieldSensitive"), icon: Lock },
  ];

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-zinc-950/60 px-3 py-4 backdrop-blur-[2px] sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <form
        onSubmit={submit}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#101114]/98 shadow-2xl shadow-black/70 ring-1 ring-white/[0.04] sm:max-h-[min(88dvh,52rem)]"
      >
        <div className="border-b border-white/10 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-300">
                {mode === "create" ? t("task.new") : t("task.edit")}
              </p>
              <h2
                id="task-modal-title"
                className="mt-1 text-lg font-semibold tracking-tight text-zinc-100"
              >
                {mode === "create" ? t("task.modalCreateTitle") : t("task.modalEditTitle")}
              </h2>
              {listTitle ? (
                <p className="mt-1 truncate text-xs text-zinc-500">{listTitle}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl p-2 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-100"
              aria-label={t("task.closeEditor")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="space-y-1.5">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={() => setTitleTouched(true)}
              placeholder={t("task.titlePlaceholder")}
              autoFocus
              aria-invalid={titleError}
            />
            {titleError ? (
              <p className="px-1 text-xs text-red-300">{t("task.titleRequired")}</p>
            ) : null}
          </div>

          {mode === "edit" && wasRecurring ? (
            <div className="rounded-3xl border border-cyan-400/15 bg-cyan-500/[0.045] p-3 text-sm text-cyan-50/80">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-2 text-cyan-200">
                  <Repeat2 className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <p className="font-semibold text-cyan-100">{t("task.recurrenceSeriesTitle")}</p>
                    <p className="mt-1 text-xs leading-5 text-cyan-100/65">
                      {t("task.recurrenceEditHint")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {currentRecurrenceLabel ? (
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-cyan-100">
                        {currentRecurrenceLabel}
                      </span>
                    ) : null}
                    {currentRecurrenceStatus ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-cyan-100/70">
                        {currentRecurrenceStatus}
                      </span>
                    ) : null}
                  </div>
                  {recurrenceStopped ? (
                    <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100/80">
                      {t("task.recurrenceWillStop")}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecurrence}
                      className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-100 transition hover:bg-cyan-500/15"
                    >
                      <X className="h-3.5 w-3.5" />
                      {t("task.stopRecurrence")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-3">
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-xs font-medium text-zinc-300">{t("task.fieldsTitle")}</p>
              <p className="text-xs text-zinc-600">{t("task.fieldsHint")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {fieldButtons.map((field) => {
                const Icon = field.icon;
                const active = visibleFields[field.key];
                return (
                  <button
                    key={field.key}
                    type="button"
                    onClick={() => toggleField(field.key)}
                    className={
                      active
                        ? "inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-xs font-medium text-blue-100"
                        : "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                    }
                    aria-pressed={active}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {field.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {visibleFields.notes ? (
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t("task.notesPlaceholder")}
              />
            ) : null}

            {(visibleFields.date || visibleFields.priority) ? (
              <div className="grid gap-3 md:grid-cols-2">
                {visibleFields.date ? (
                  <label className="space-y-1.5 text-xs text-zinc-500">
                    {t("task.due")}
                    <Input
                      type="date"
                      value={scheduledDate}
                      onChange={(event) => setScheduledDate(event.target.value)}
                    />
                  </label>
                ) : null}

                {visibleFields.priority ? (
                  <label className="space-y-1.5 text-xs text-zinc-500">
                    {t("task.priority")}
                    <select
                      value={priority}
                      onChange={(event) =>
                        setPriority(event.target.value as TaskPriority)
                      }
                      className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="low">{t("task.priorityLow")}</option>
                      <option value="normal">{t("task.priorityNormal")}</option>
                      <option value="high">{t("task.priorityHigh")}</option>
                    </select>
                  </label>
                ) : null}
              </div>
            ) : null}

            {visibleFields.recurrence ? (
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1.5 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Repeat2 className="h-3.5 w-3.5" /> {t("task.recurrence")}
                  </span>
                  <select
                    value={recurrenceType}
                    onChange={(event) =>
                      setRecurrenceType(event.target.value as TaskRecurrenceType)
                    }
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                {showInterval ? (
                  <label className="space-y-1.5 text-xs text-zinc-500">
                    {t("task.intervalDays")}
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
            ) : null}

            {visibleFields.recurrence && recurrenceType !== "none" ? (
              <p className="flex gap-2 rounded-2xl border border-cyan-400/15 bg-cyan-500/5 px-3 py-2 text-xs leading-5 text-cyan-100/75">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{t("task.recurrenceHelp")}</span>
              </p>
            ) : null}

            {visibleFields.tags ? (
              <Input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder={t("task.tagsPlaceholder")}
              />
            ) : null}

            {visibleFields.sensitive ? (
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
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-white/10 bg-[#101114]/95 px-4 py-3 sm:px-5">
          <Button type="submit" size="sm">
            <Save className="h-4 w-4" />{" "}
            {mode === "create" ? t("task.addSubmit") : t("task.save")}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            {t("task.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );

  if (!isMounted) return null;

  return createPortal(modal, document.body);
}
