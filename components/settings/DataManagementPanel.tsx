"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArchiveRestore,
  Download,
  FileJson,
  RefreshCw,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase/client";
import { useI18n } from "@/hooks/useI18n";
import {
  downloadTextFile,
  estimateBytes,
  formatBytes,
  rowsToCsv,
  safeBackupFilename,
  type TaskboardBackup,
} from "@/lib/backup/export";

type BackupStats = {
  boards: number;
  archivedBoards: number;
  lists: number;
  tasks: number;
  doneTasks: number;
  deletedTasks: number;
  bytes: number;
};

type RawRows = {
  boards: Record<string, unknown>[];
  lists: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  taskVersions: Record<string, unknown>[];
};

const emptyRows: RawRows = {
  boards: [],
  lists: [],
  tasks: [],
  taskVersions: [],
};

function isDeletedTask(task: Record<string, unknown>) {
  return Boolean(task.deleted_at);
}

function isDoneTask(task: Record<string, unknown>) {
  return task.status === "done";
}

function isArchivedBoard(board: Record<string, unknown>) {
  return Boolean(board.archived_at);
}

function getString(row: Record<string, unknown>, key: string, fallback = "") {
  const value = row[key];
  return typeof value === "string" ? value : fallback;
}

function getDateLabel(value: unknown) {
  if (typeof value !== "string" || !value) return "—";
  try {
    return new Date(value).toLocaleString("de-DE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export function DataManagementPanel() {
  const { user, isLoggedIn, isSupabaseConfigured } = useAuth();
  const { t } = useI18n();
  const [rows, setRows] = useState<RawRows>(emptyRows);
  const [isLoading, setIsLoading] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const boardTitleById = useMemo(() => {
    const map = new Map<string, string>();
    rows.boards.forEach((board) => {
      map.set(getString(board, "id"), getString(board, "title", "Board"));
    });
    return map;
  }, [rows.boards]);

  const listTitleById = useMemo(() => {
    const map = new Map<string, string>();
    rows.lists.forEach((list) => {
      map.set(getString(list, "id"), getString(list, "title", "Liste"));
    });
    return map;
  }, [rows.lists]);

  const deletedTasks = useMemo(
    () => rows.tasks.filter(isDeletedTask),
    [rows.tasks],
  );

  const archivedBoards = useMemo(
    () => rows.boards.filter(isArchivedBoard),
    [rows.boards],
  );

  const stats = useMemo<BackupStats>(() => {
    const dataForSize = {
      boards: rows.boards,
      lists: rows.lists,
      tasks: rows.tasks,
      taskVersions: rows.taskVersions,
    };

    return {
      boards: rows.boards.length,
      archivedBoards: archivedBoards.length,
      lists: rows.lists.length,
      tasks: rows.tasks.length,
      doneTasks: rows.tasks.filter(isDoneTask).length,
      deletedTasks: deletedTasks.length,
      bytes: estimateBytes(dataForSize),
    };
  }, [archivedBoards.length, deletedTasks.length, rows]);

  async function loadRows() {
    if (!user || !isSupabaseConfigured) return;
    setIsLoading(true);
    setError(null);

    try {
      const [boardsResult, listsResult, tasksResult, versionsResult] =
        await Promise.all([
          supabase
            .from("boards")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true }),
          supabase
            .from("lists")
            .select("*")
            .eq("user_id", user.id)
            .order("position", { ascending: true }),
          supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false }),
          supabase
            .from("task_versions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1000),
        ]);

      const firstError =
        boardsResult.error ??
        listsResult.error ??
        tasksResult.error ??
        versionsResult.error;
      if (firstError) throw firstError;

      setRows({
        boards: (boardsResult.data ?? []) as Record<string, unknown>[],
        lists: (listsResult.data ?? []) as Record<string, unknown>[],
        tasks: (tasksResult.data ?? []) as Record<string, unknown>[],
        taskVersions: (versionsResult.data ?? []) as Record<string, unknown>[],
      });
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : t("backup.loadError"),
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isSupabaseConfigured]);

  function buildBackup(): TaskboardBackup | null {
    if (!user) return null;
    const data = {
      boards: rows.boards,
      lists: rows.lists,
      tasks: rows.tasks,
      taskVersions: rows.taskVersions,
    };
    return {
      app: "taskboard",
      version: 1,
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
      data,
      stats: {
        boards: stats.boards,
        archivedBoards: stats.archivedBoards,
        lists: stats.lists,
        tasks: stats.tasks,
        deletedTasks: stats.deletedTasks,
        bytes: estimateBytes(data),
      },
    };
  }

  function exportJson() {
    const backup = buildBackup();
    if (!backup) return;
    downloadTextFile(
      safeBackupFilename("taskboard-backup", "json"),
      JSON.stringify(backup, null, 2),
      "application/json;charset=utf-8",
    );
    setMessage(t("backup.jsonDownloaded"));
  }

  function exportCsv() {
    const csv = rowsToCsv(rows.tasks);
    downloadTextFile(
      safeBackupFilename("taskboard-tasks", "csv"),
      csv || `${t("backup.noTasksCsv")}\n`,
      "text/csv;charset=utf-8",
    );
    setMessage(t("backup.csvDownloaded"));
  }

  async function restoreTask(taskId: string) {
    if (!user) return;
    setIsWorking(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("tasks")
        .update({ deleted_at: null, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("id", taskId);

      if (updateError) throw updateError;

      setMessage("Aufgabe wurde wiederhergestellt.");
      await loadRows();
      window.dispatchEvent(new Event("taskboard:reload"));
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Aufgabe konnte nicht wiederhergestellt werden.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function permanentlyDeleteTask(taskId: string) {
    if (!user) return;
    const confirmed = window.confirm(
      "Diese Aufgabe endgültig löschen? Das kann nicht rückgängig gemacht werden.",
    );
    if (!confirmed) return;

    setIsWorking(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("user_id", user.id)
        .eq("id", taskId)
        .not("deleted_at", "is", null);

      if (deleteError) throw deleteError;

      setMessage("Aufgabe wurde endgültig gelöscht.");
      await loadRows();
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Aufgabe konnte nicht endgültig gelöscht werden.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function emptyTrash() {
    if (!user) return;
    if (stats.deletedTasks === 0) {
      setMessage(t("backup.trashAlreadyEmpty"));
      return;
    }

    const confirmed = window.confirm(
      t("backup.confirmEmptyTrash", { count: stats.deletedTasks }),
    );
    if (!confirmed) return;

    setIsWorking(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("user_id", user.id)
        .not("deleted_at", "is", null);
      if (deleteError) throw deleteError;
      setMessage(t("backup.trashEmptied"));
      await loadRows();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : t("backup.trashError"),
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function restoreBoard(boardId: string) {
    if (!user) return;
    setIsWorking(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("boards")
        .update({ archived_at: null, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("id", boardId);

      if (updateError) throw updateError;

      setMessage("Board wurde wiederhergestellt.");
      await loadRows();
      window.dispatchEvent(new Event("taskboard:boards-changed"));
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Board konnte nicht wiederhergestellt werden.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function permanentlyDeleteBoard(boardId: string) {
    if (!user) return;
    const confirmed = window.confirm(
      "Dieses archivierte Board endgültig löschen? Alle Listen und Aufgaben dieses Boards werden ebenfalls gelöscht. Das kann nicht rückgängig gemacht werden.",
    );
    if (!confirmed) return;

    setIsWorking(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("boards")
        .delete()
        .eq("user_id", user.id)
        .eq("id", boardId)
        .not("archived_at", "is", null);

      if (deleteError) throw deleteError;

      setMessage("Archiviertes Board wurde endgültig gelöscht.");
      await loadRows();
      window.dispatchEvent(new Event("taskboard:boards-changed"));
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : t("backup.archivedBoardsError"),
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function deleteArchivedBoards() {
    if (!user) return;
    if (stats.archivedBoards === 0) {
      setMessage(t("backup.noArchivedBoards"));
      return;
    }

    const confirmed = window.confirm(
      t("backup.confirmDeleteArchivedBoards", { count: stats.archivedBoards }),
    );
    if (!confirmed) return;

    setIsWorking(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("boards")
        .delete()
        .eq("user_id", user.id)
        .not("archived_at", "is", null);
      if (deleteError) throw deleteError;
      setMessage(t("backup.archivedBoardsDeleted"));
      await loadRows();
      window.dispatchEvent(new Event("taskboard:boards-changed"));
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : t("backup.archivedBoardsError"),
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function importJson(file: File) {
    if (!user) return;
    setIsWorking(true);
    setError(null);
    setMessage(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<TaskboardBackup>;
      if (
        parsed.app !== "taskboard" ||
        !parsed.data?.boards ||
        !parsed.data?.lists ||
        !parsed.data?.tasks
      ) {
        throw new Error(t("backup.invalidFile"));
      }

      const firstBoard = parsed.data.boards[0];
      const originalBoardId = String(firstBoard?.id ?? "");
      const importTitle = `Import ${new Date().toLocaleString("de-DE", {
        dateStyle: "short",
        timeStyle: "short",
      })}`;

      const { data: boardData, error: boardError } = await supabase
        .from("boards")
        .insert({ user_id: user.id, title: importTitle })
        .select("*")
        .single();
      if (boardError) throw boardError;

      const newBoardId = String(boardData.id);
      const sourceLists = parsed.data.lists.filter((list) => {
        return originalBoardId ? list.board_id === originalBoardId : true;
      });

      const listIdMap = new Map<string, string>();
      for (const [index, list] of sourceLists.entries()) {
        const { data: createdList, error: listError } = await supabase
          .from("lists")
          .insert({
            user_id: user.id,
            board_id: newBoardId,
            title: String(list.title ?? t("backup.importedList")),
            date: (list.date as string | null | undefined) ?? null,
            position: Number(list.position ?? index + 1),
            collapsed: Boolean(list.collapsed),
          })
          .select("*")
          .single();
        if (listError) throw listError;
        listIdMap.set(String(list.id), String(createdList.id));
      }

      const sourceTasks = parsed.data.tasks.filter((task) => {
        if (originalBoardId) return task.board_id === originalBoardId;
        return true;
      });

      const taskRows = sourceTasks.map((task, index) => ({
        user_id: user.id,
        board_id: newBoardId,
        list_id: task.list_id
          ? (listIdMap.get(String(task.list_id)) ?? null)
          : null,
        title: String(task.title ?? t("backup.importedTask")),
        notes: String(task.notes ?? ""),
        status:
          task.status === "done"
            ? "done"
            : task.status === "archived"
              ? "archived"
              : "open",
        scheduled_date:
          (task.scheduled_date as string | null | undefined) ?? null,
        position: Number(task.position ?? index + 1),
        priority:
          task.priority === "low" || task.priority === "high"
            ? task.priority
            : "normal",
        tags: Array.isArray(task.tags) ? task.tags : [],
        is_encrypted: Boolean(task.is_encrypted),
        encrypted_payload:
          (task.encrypted_payload as string | null | undefined) ?? null,
        completed_at: (task.completed_at as string | null | undefined) ?? null,
        deleted_at: null,
      }));

      if (taskRows.length > 0) {
        const { error: tasksError } = await supabase
          .from("tasks")
          .insert(taskRows);
        if (tasksError) throw tasksError;
      }

      setMessage(t("backup.importSuccess", { title: importTitle }));
      await loadRows();
      window.dispatchEvent(new Event("taskboard:boards-changed"));
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : t("backup.importError"),
      );
    } finally {
      setIsWorking(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <section className="rounded-[2rem] border border-amber-300/20 bg-amber-300/5 p-5 text-sm text-amber-100/80">
        {t("backup.notConfigured")}
      </section>
    );
  }

  if (!isLoggedIn) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 text-sm text-zinc-400">
        {t("backup.loginRequired")}
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-blue-300">
            {t("backup.label")}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            {t("backup.title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            {t("backup.body")}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => void loadRows()}
          disabled={isLoading || isWorking}
        >
          <RefreshCw
            className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
          />{" "}
          {t("backup.refresh")}
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat label={t("backup.boards")} value={stats.boards} />
        <Stat label={t("backup.lists")} value={stats.lists} />
        <Stat label={t("backup.tasks")} value={stats.tasks} />
        <Stat label={t("backup.done")} value={stats.doneTasks} />
        <Stat label={t("backup.trash")} value={stats.deletedTasks} />
        <Stat label={t("backup.storage")} value={formatBytes(stats.bytes)} />
      </div>

      {message ? (
        <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Button type="button" onClick={exportJson} disabled={isLoading || isWorking}>
          <FileJson className="h-4 w-4" /> {t("backup.json")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={exportCsv}
          disabled={isLoading || isWorking}
        >
          <Download className="h-4 w-4" /> {t("backup.csv")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isWorking}
        >
          <Upload className="h-4 w-4" /> {t("backup.importJson")}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importJson(file);
          }}
        />
      </div>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.025] p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-semibold text-zinc-100">Papierkorb</h3>
            <p className="text-sm text-zinc-500">
              Gelöschte Aufgaben bleiben hier wiederherstellbar, bis du sie
              endgültig löschst.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void emptyTrash()}
            disabled={isWorking || stats.deletedTasks === 0}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/15 bg-red-400/5 px-4 py-2 text-sm text-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> {t("backup.emptyTrash")}
          </button>
        </div>

        {deletedTasks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-zinc-600">
            Der Papierkorb ist leer.
          </p>
        ) : (
          <div className="space-y-2">
            {deletedTasks.map((task) => {
              const boardTitle =
                boardTitleById.get(getString(task, "board_id")) ?? "Board";
              const listTitle =
                listTitleById.get(getString(task, "list_id")) ?? "Liste";
              return (
                <article
                  key={getString(task, "id")}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/55 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-zinc-100">
                      {getString(task, "title", "Aufgabe ohne Titel")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      {boardTitle} · {listTitle} · gelöscht am{" "}
                      {getDateLabel(task.deleted_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void restoreTask(getString(task, "id"))}
                      disabled={isWorking}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-100 disabled:opacity-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Wiederherstellen
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void permanentlyDeleteTask(getString(task, "id"))
                      }
                      disabled={isWorking}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-100 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Endgültig löschen
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.025] p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-semibold text-zinc-100">Archivierte Boards</h3>
            <p className="text-sm text-zinc-500">
              Archivierte Boards sind aus der normalen Board-Liste ausgeblendet,
              können hier aber wiederhergestellt oder endgültig gelöscht werden.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void deleteArchivedBoards()}
            disabled={isWorking || stats.archivedBoards === 0}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/15 bg-amber-300/5 px-4 py-2 text-sm text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArchiveRestore className="h-4 w-4" />{" "}
            {t("backup.deleteArchivedBoards")}
          </button>
        </div>

        {archivedBoards.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-zinc-600">
            Es gibt keine archivierten Boards.
          </p>
        ) : (
          <div className="space-y-2">
            {archivedBoards.map((board) => {
              const boardId = getString(board, "id");
              const listCount = rows.lists.filter(
                (list) => getString(list, "board_id") === boardId,
              ).length;
              const taskCount = rows.tasks.filter(
                (task) => getString(task, "board_id") === boardId,
              ).length;

              return (
                <article
                  key={boardId}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/55 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-zinc-100">
                      {getString(board, "title", "Archiviertes Board")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      {listCount} Listen · {taskCount} Aufgaben · archiviert am{" "}
                      {getDateLabel(board.archived_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void restoreBoard(boardId)}
                      disabled={isWorking}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-100 disabled:opacity-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Wiederherstellen
                    </button>
                    <button
                      type="button"
                      onClick={() => void permanentlyDeleteBoard(boardId)}
                      disabled={isWorking}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-100 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Endgültig löschen
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
