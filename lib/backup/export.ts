export type TaskboardBackup = {
  app: "taskboard";
  version: 1;
  exportedAt: string;
  user: {
    id: string;
    email?: string | null;
  };
  data: {
    boards: Record<string, unknown>[];
    lists: Record<string, unknown>[];
    tasks: Record<string, unknown>[];
    taskVersions: Record<string, unknown>[];
  };
  stats: {
    boards: number;
    lists: number;
    tasks: number;
    deletedTasks: number;
    archivedBoards: number;
    bytes: number;
  };
};

export function estimateBytes(value: unknown) {
  return new Blob([JSON.stringify(value)]).size;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function escapeCsvCell(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = Array.isArray(value) ? value.join("; ") : String(value);
  if (/[",\n\r;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function rowsToCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const header = keys.join(";");
  const body = rows
    .map((row) => keys.map((key) => escapeCsvCell(row[key])).join(";"))
    .join("\n");
  return `${header}\n${body}\n`;
}

export function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function safeBackupFilename(prefix: string, extension: "json" | "csv") {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${prefix}-${stamp}.${extension}`;
}
