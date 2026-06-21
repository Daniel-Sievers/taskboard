import type { BoardList } from "@/types/board";

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function toYear(value: string, fallbackYear: number) {
  if (!value) return fallbackYear;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallbackYear;
  if (value.length === 2) return 2000 + numeric;
  return numeric;
}

function makeDateKey(year: number, month: number, day: number) {
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function parseDateKey(dateKey: string) {
  const match = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

export function parseListDateFromTitle(title: string, today = new Date()) {
  const value = title.trim();
  if (!value) return null;

  const isoMatch = value.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (isoMatch) {
    return makeDateKey(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const deMatch = value.match(/(?:^|\D)(\d{1,2})\.(\d{1,2})\.(?:(\d{2}|\d{4})\b)?/);
  if (!deMatch) return null;

  const day = Number(deMatch[1]);
  const month = Number(deMatch[2]);
  const year = toYear(deMatch[3] ?? "", today.getFullYear());

  return makeDateKey(year, month, day);
}

export function getListDateKey(list: BoardList, today = new Date()) {
  if (list.date) return list.date;
  return parseListDateFromTitle(list.title, today);
}

export function findMatchingDateList(
  lists: BoardList[],
  dateKey: string | null | undefined,
  today = new Date(),
) {
  if (!dateKey) return null;
  return (
    lists.find((list) => getListDateKey(list, today) === dateKey) ?? null
  );
}

export function isOpenListTitle(title: string) {
  return /^(offen|open)$/i.test(title.trim());
}

export function findOpenList(lists: BoardList[]) {
  return lists.find((list) => isOpenListTitle(list.title)) ?? null;
}

export function isDateKeyOlderThanDays(
  dateKey: string | null | undefined,
  days: number,
  today = new Date(),
) {
  if (!dateKey) return false;
  const parsed = parseDateKey(dateKey);
  if (!parsed) return false;

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const differenceMs = todayStart.getTime() - parsed.getTime();
  const differenceDays = Math.floor(differenceMs / 86_400_000);
  return differenceDays > days;
}
