import { addDays, format, isToday, isTomorrow, startOfDay } from "date-fns";
import { de } from "date-fns/locale";

export function getVisibleDays(startDate = new Date(), count = 7) {
  const start = startOfDay(startDate);
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

export function toDateKey(date: Date | string) {
  return new Date(date).toISOString().slice(0, 10);
}

export function formatDayTitle(date: Date) {
  if (isToday(date)) return `Heute, ${format(date, "dd.MM.yyyy")}`;
  if (isTomorrow(date)) return `Morgen, ${format(date, "dd.MM.yyyy")}`;
  return format(date, "EEEE, dd.MM.yyyy", { locale: de });
}
