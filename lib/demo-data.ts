import { addDays, format, startOfDay } from "date-fns";
import { de } from "date-fns/locale";
import type { Board, BoardList } from "@/types/board";
import type { Task } from "@/types/task";

const demoUserId = "demo";
const demoBoardId = "demo-board";

function nowIso() {
  return new Date().toISOString();
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function day(offset: number, baseDate = new Date()) {
  return dateKey(addDays(startOfDay(baseDate), offset));
}

function titleForDemoDate(date: Date) {
  return format(date, "EEEE, dd.MM.yyyy", { locale: de });
}

export function createDemoBoard(): Board {
  const iso = nowIso();

  return {
    id: demoBoardId,
    userId: demoUserId,
    title: "Demo-Board",
    createdAt: iso,
    updatedAt: iso,
    archivedAt: null,
  };
}

export function createInitialDemoLists(baseDate = new Date()): BoardList[] {
  const start = startOfDay(baseDate);
  const iso = nowIso();

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    const key = dateKey(date);

    return {
      id: `demo-list-${key}`,
      userId: demoUserId,
      boardId: demoBoardId,
      title: titleForDemoDate(date),
      date: key,
      position: index + 1,
      collapsed: false,
      createdAt: iso,
      updatedAt: iso,
    };
  });
}

export function createInitialDemoTasks(baseDate = new Date()): Task[] {
  const iso = nowIso();

  return [
    {
      id: "demo-task-1",
      userId: demoUserId,
      boardId: demoBoardId,
      title: "README und Screenshots prüfen",
      notes: "Vor Veröffentlichung kontrollieren, dass keine privaten Daten sichtbar sind.",
      status: "open",
      scheduledDate: day(0, baseDate),
      position: 1,
      priority: "high",
      tags: ["Portfolio"],
      isEncrypted: false,
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceAnchorDate: null,
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-task-2",
      userId: demoUserId,
      boardId: demoBoardId,
      title: "Task per Drag & Drop verschieben",
      notes: "Aufgabe in eine andere Tagesliste ziehen und Reihenfolge testen.",
      status: "open",
      scheduledDate: day(0, baseDate),
      position: 2,
      priority: "normal",
      tags: ["Demo", "UX"],
      isEncrypted: false,
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceAnchorDate: null,
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-task-3",
      userId: demoUserId,
      boardId: demoBoardId,
      title: "Wöchentliche Planung wiederholen",
      notes: "Beim Abhaken erzeugt Taskboard die nächste geplante Instanz.",
      status: "open",
      scheduledDate: day(0, baseDate),
      position: 3,
      priority: "normal",
      tags: ["Wiederholung"],
      isEncrypted: false,
      recurrenceType: "weekly",
      recurrenceInterval: 1,
      recurrenceAnchorDate: day(0, baseDate),
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-task-4",
      userId: demoUserId,
      boardId: demoBoardId,
      title: "Mobile Ansicht auf Smartphone prüfen",
      notes: "Hamburger-Menü, horizontale Ansicht und Touch-Bedienung testen.",
      status: "open",
      scheduledDate: day(1, baseDate),
      position: 1,
      priority: "normal",
      tags: ["Mobile"],
      isEncrypted: false,
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceAnchorDate: null,
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-task-5",
      userId: demoUserId,
      boardId: demoBoardId,
      title: "JSON-Backup exportieren",
      notes: "Backup-/Export-Bereich in den Einstellungen öffnen und Funktion prüfen.",
      status: "open",
      scheduledDate: day(1, baseDate),
      position: 2,
      priority: "low",
      tags: ["Backup"],
      isEncrypted: false,
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceAnchorDate: null,
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-task-6",
      userId: demoUserId,
      boardId: demoBoardId,
      title: "Task-Modal als nächsten UX-Schritt planen",
      notes: "Neue Aufgaben und Bearbeitung später in einem kompakten Dialog öffnen.",
      status: "open",
      scheduledDate: day(3, baseDate),
      position: 1,
      priority: "normal",
      tags: ["Roadmap"],
      isEncrypted: false,
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceAnchorDate: null,
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-task-7",
      userId: demoUserId,
      boardId: demoBoardId,
      title: "GitHub Actions Build-Check einrichten",
      notes: "CI prüft TypeScript und Production Build bei jedem Push.",
      status: "done",
      scheduledDate: day(0, baseDate),
      position: 4,
      priority: "normal",
      tags: ["CI", "Portfolio"],
      isEncrypted: false,
      completedAt: iso,
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceAnchorDate: null,
      createdAt: iso,
      updatedAt: iso,
    },
  ];
}

export const demoBoard = createDemoBoard();
export const initialDemoLists = createInitialDemoLists();
export const initialDemoTasks = createInitialDemoTasks();
