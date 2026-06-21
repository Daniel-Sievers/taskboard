import { isFutureDateKey, isPastDateKey, isTodayDateKey, toDateKey } from "@/lib/dates/calendar";
import type { Task } from "@/types/task";

export function isRecurringTask(task: Pick<Task, "recurrenceType">) {
  return (task.recurrenceType ?? "none") !== "none";
}

export function isFutureLockedTask(task: Pick<Task, "status" | "scheduledDate">) {
  return task.status === "open" && isFutureDateKey(task.scheduledDate);
}

export function formatDateForDisplay(date: string | null | undefined, language: string) {
  const dateKey = date ? toDateKey(date) : "";
  if (!dateKey) return "";

  if (language === "de") {
    const match = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return `${match[3]}.${match[2]}.${match[1]}`;
  }

  return dateKey;
}

export function getRecurrenceRuleLabel(task: Pick<Task, "recurrenceType" | "recurrenceInterval">, language: string) {
  if (!isRecurringTask(task)) return null;

  const interval = Math.max(1, task.recurrenceInterval || 1);

  if (language === "en") {
    if (task.recurrenceType === "daily") return interval === 1 ? "daily" : `every ${interval} days`;
    if (task.recurrenceType === "weekly") return interval === 1 ? "weekly" : `every ${interval} weeks`;
    if (task.recurrenceType === "monthly") return interval === 1 ? "monthly" : `every ${interval} months`;
    if (task.recurrenceType === "interval") return `every ${interval} days`;
    return null;
  }

  if (task.recurrenceType === "daily") return interval === 1 ? "täglich" : `alle ${interval} Tage`;
  if (task.recurrenceType === "weekly") return interval === 1 ? "wöchentlich" : `alle ${interval} Wochen`;
  if (task.recurrenceType === "monthly") return interval === 1 ? "monatlich" : `alle ${interval} Monate`;
  if (task.recurrenceType === "interval") return `alle ${interval} Tage`;

  return null;
}

export function getRecurringTaskStatus(task: Task, language: string) {
  if (!isRecurringTask(task)) return null;

  const date = formatDateForDisplay(task.scheduledDate, language);

  if (language === "en") {
    if (task.status === "done") return "Completed repeat instance";
    if (isFutureDateKey(task.scheduledDate)) return date ? `Not due until ${date}` : "Not due yet";
    if (isTodayDateKey(task.scheduledDate)) return "Repeat due today";
    if (isPastDateKey(task.scheduledDate)) return date ? `Overdue repeat since ${date}` : "Overdue repeat";
    return "Repeat is active";
  }

  if (task.status === "done") return "Erledigte Wiederholungsinstanz";
  if (isFutureDateKey(task.scheduledDate)) return date ? `Noch nicht fällig bis ${date}` : "Noch nicht fällig";
  if (isTodayDateKey(task.scheduledDate)) return "Wiederholung heute fällig";
  if (isPastDateKey(task.scheduledDate)) return date ? `Überfällige Wiederholung seit ${date}` : "Überfällige Wiederholung";
  return "Wiederholung aktiv";
}
