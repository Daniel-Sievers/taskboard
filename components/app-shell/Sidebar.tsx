"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Archive,
  CalendarCheck,
  CalendarDays,
  Database,
  Globe2,
  KanbanSquare,
  Loader2,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { useI18n } from "@/hooks/useI18n";
import { createBoard, listBoards } from "@/lib/db/boards";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Board } from "@/types/board";

const viewItems = [
  { labelKey: "sidebar.dayLists", icon: CalendarDays, key: "days" },
  { labelKey: "sidebar.horizontal", icon: KanbanSquare, key: "kanban" },
  { labelKey: "sidebar.todayDue", icon: CalendarCheck, key: "today" },
  { labelKey: "sidebar.settings", icon: Settings, key: "settings" },
] as const;

function boardHref(boardId: string) {
  return `/board?board=${boardId}`;
}

function viewHref(key: string, boardId: string | null) {
  if (key === "settings") return "/settings";
  const params = new URLSearchParams();
  if (boardId) params.set("board", boardId);
  if (key === "kanban") params.set("view", "kanban");
  if (key === "today") params.set("filter", "today");
  const query = params.toString();
  return query ? `/board?${query}` : "/board";
}

type SidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useI18n();

  const activeBoardId = searchParams.get("board");
  const activeView = useMemo(() => {
    if (pathname === "/settings") return "settings";
    if (searchParams.get("filter") === "today") return "today";
    if (searchParams.get("view") === "kanban") return "kanban";
    return preferences.defaultView;
  }, [pathname, preferences.defaultView, searchParams]);

  async function reloadBoards() {
    if (!isSupabaseConfigured || !user) {
      setBoards([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const remoteBoards = await listBoards(user.id);
      setBoards(remoteBoards);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Boards could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void reloadBoards();
    function handleBoardsChanged() {
      void reloadBoards();
    }
    window.addEventListener("taskboard:boards-changed", handleBoardsChanged);
    return () => {
      window.removeEventListener("taskboard:boards-changed", handleBoardsChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleAddBoard() {
    if (!user || authLoading) {
      router.push("/login");
      return;
    }

    const title = window.prompt(preferences.language === "en" ? "Name of the new board" : "Name des neuen Boards", preferences.language === "en" ? "New board" : "Neues Board");
    if (!title?.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const created = await createBoard(user.id, title.trim());
      const nextBoards = [...boards, created];
      setBoards(nextBoards);
      window.dispatchEvent(new Event("taskboard:boards-changed"));
      onNavigate?.();
      router.push(boardHref(created.id));
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Board could not be created.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const wrapperClassName = mobile
    ? "block w-full"
    : "hidden w-64 shrink-0 lg:block";
  const innerClassName = mobile ? "space-y-4" : "sticky top-20 space-y-4";

  return (
    <aside className={wrapperClassName}>
      <div className={innerClassName}>
        <nav className="rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/20">
          {viewItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            return (
              <Link
                key={item.key}
                href={viewHref(item.key, activeBoardId)}
                onClick={() => {
                  if (item.key === "days" || item.key === "kanban") updatePreferences({ defaultView: item.key });
                  onNavigate?.();
                }}
                className={
                  isActive
                    ? "flex items-center gap-3 rounded-2xl bg-blue-500 px-3 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20"
                    : "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                }
              >
                <Icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-3 text-sm text-zinc-400 shadow-2xl shadow-black/20">
          <div className="mb-2 flex items-center justify-between px-1 text-zinc-200">
            <span className="font-medium">{t("sidebar.boards")}</span>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-zinc-500" /> : null}
          </div>

          <div className="space-y-1">
            {boards.length === 0 ? (
              <p className="px-3 py-2 text-xs leading-5 text-zinc-500">
                {isSupabaseConfigured
                  ? "After signing in, your boards will appear here."
                  : "Supabase is not connected yet."}
              </p>
            ) : null}

            {boards.map((board) => {
              const isActive = activeBoardId
                ? activeBoardId === board.id
                : boards[0]?.id === board.id;
              return (
                <Link
                  key={board.id}
                  href={boardHref(board.id)}
                  onClick={onNavigate}
                  className={
                    isActive
                      ? "block rounded-2xl border border-blue-400/20 bg-blue-500/10 px-3 py-2.5 text-sm font-medium text-blue-100"
                      : "block rounded-2xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                  }
                  title={board.title}
                >
                  <span className="block truncate">{board.title}</span>
                </Link>
              );
            })}
          </div>

          {error ? <p className="mt-2 px-3 text-xs text-red-300">{error}</p> : null}

          <button
            type="button"
            onClick={() => void handleAddBoard()}
            className="mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <Plus className="h-4 w-4" /> {t("sidebar.addBoard")}
          </button>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 text-sm text-zinc-400 shadow-2xl shadow-black/20">
          <div className="mb-3 flex items-center gap-2 text-zinc-200">
            <Sparkles className="h-4 w-4 text-blue-400" />
            {t("sidebar.projectStatus")}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2"><Database className="h-4 w-4" /> Supabase</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">{t("status.active")}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Boards</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">{t("status.active")}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2"><Archive className="h-4 w-4" /> Backup</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">{t("status.manual")}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2"><Globe2 className="h-4 w-4" /> Vercel</span>
              <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-400">{t("status.next")}</span>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
