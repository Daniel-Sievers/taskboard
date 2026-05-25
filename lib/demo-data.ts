import { addDays } from "date-fns";
import type { Task } from "@/types/task";

const now = new Date();
const iso = now.toISOString();
const day = (offset: number) => addDays(now, offset).toISOString();

export const initialDemoTasks: Task[] = [
  {
    id: "task-1",
    title: "Brave aufräumen",
    notes: "Tabs sortieren, alte Recherchen schließen, wichtige Links sichern.",
    status: "open",
    scheduledDate: day(0),
    position: 1,
    priority: "normal",
    tags: ["Orga"],
    isEncrypted: false,
    createdAt: iso,
    updatedAt: iso
  },
  {
    id: "task-2",
    title: "Kenji IBAN mit IBAN-Karte vergleichen",
    notes: "Danach als erledigt markieren und kurze Notiz ergänzen.",
    status: "open",
    scheduledDate: day(0),
    position: 2,
    priority: "high",
    tags: ["Finanzen"],
    isEncrypted: true,
    createdAt: iso,
    updatedAt: iso
  },
  {
    id: "task-3",
    title: "Wasserhahn wechseln",
    notes: "Vorher prüfen: Werkzeug, Dichtungen, Hauptwasserhahn.",
    status: "open",
    scheduledDate: day(0),
    position: 3,
    priority: "normal",
    tags: ["Wohnung"],
    isEncrypted: false,
    createdAt: iso,
    updatedAt: iso
  },
  {
    id: "task-4",
    title: "Handytarif prüfen: Prepaid, Vertragsende, Kündigung",
    notes: "Aktualisierung abwarten. Prüfen, ob alter Vertrag wirklich beendet ist.",
    status: "open",
    scheduledDate: day(0),
    position: 4,
    priority: "high",
    tags: ["Admin"],
    isEncrypted: false,
    createdAt: iso,
    updatedAt: iso
  },
  {
    id: "task-5",
    title: "Einkaufen zusätzlich: Salz",
    notes: "Beim nächsten Einkauf mitnehmen.",
    status: "open",
    scheduledDate: day(1),
    position: 1,
    priority: "low",
    tags: ["Einkauf"],
    isEncrypted: false,
    createdAt: iso,
    updatedAt: iso
  },
  {
    id: "task-6",
    title: "Nect: Arbeiten 18:00–22:00 Uhr",
    notes: "17 Uhr los, 15:30 Uhr Essen vorbereiten.",
    status: "open",
    scheduledDate: day(1),
    position: 2,
    priority: "normal",
    tags: ["Arbeit"],
    isEncrypted: false,
    createdAt: iso,
    updatedAt: iso
  },
  {
    id: "task-7",
    title: "PayPal Fall prüfen",
    notes: "Wenn nichts passiert: Käuferschutzfall eskalieren oder PayPal fragen.",
    status: "open",
    scheduledDate: day(1),
    position: 3,
    priority: "high",
    tags: ["Finanzen"],
    isEncrypted: false,
    createdAt: iso,
    updatedAt: iso
  },
  {
    id: "task-8",
    title: "Taskboard README aktualisieren",
    notes: "Screenshots und nächste Roadmap-Punkte ergänzen.",
    status: "done",
    scheduledDate: day(0),
    position: 5,
    priority: "normal",
    tags: ["Projekt"],
    isEncrypted: false,
    completedAt: iso,
    createdAt: iso,
    updatedAt: iso
  }
];
