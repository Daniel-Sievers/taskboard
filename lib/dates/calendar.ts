import { addDays, format, isToday, isTomorrow, startOfDay } from "date-fns";
import { de } from "date-fns/locale";

export function getVisibleDays(startDate = new Date(), count = 7) {
  const start = startOfDay(startDate);
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

export function toDateKey(date: Date | string) {
  if (date instanceof Date) return date.toISOString().slice(0, 10);

  const value = String(date ?? "").trim();
  if (!value) return "";

  // Supabase/date inputs normally use YYYY-MM-DD. Keep that stable and avoid
  // timezone shifts from `new Date("YYYY-MM-DD")`.
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  // Defensive fallback for accidentally localized dates like DD.MM.YYYY.
  const deMatch = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (deMatch) {
    const day = deMatch[1].padStart(2, "0");
    const month = deMatch[2].padStart(2, "0");
    return `${deMatch[3]}-${month}-${day}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
}

export function compareDateKeys(a: Date | string | null | undefined, b: Date | string | null | undefined) {
  const left = a ? toDateKey(a) : "";
  const right = b ? toDateKey(b) : "";
  if (!left && !right) return 0;
  if (!left) return -1;
  if (!right) return 1;
  return left.localeCompare(right);
}

export function isFutureDateKey(date: Date | string | null | undefined, today: Date | string = new Date()) {
  if (!date) return false;
  return compareDateKeys(date, today) > 0;
}

export function isTodayDateKey(date: Date | string | null | undefined, today: Date | string = new Date()) {
  if (!date) return false;
  return compareDateKeys(date, today) === 0;
}

export function isPastDateKey(date: Date | string | null | undefined, today: Date | string = new Date()) {
  if (!date) return false;
  return compareDateKeys(date, today) < 0;
}

export function formatDayTitle(date: Date) {
  if (isToday(date)) return `Heute, ${format(date, "dd.MM.yyyy")}`;
  if (isTomorrow(date)) return `Morgen, ${format(date, "dd.MM.yyyy")}`;
  return format(date, "EEEE, dd.MM.yyyy", { locale: de });
}
