"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Menu,
  Moon,
  RefreshCw,
  Search,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { AuthStatus } from "./AuthStatus";
import { AppIcon } from "./AppIcon";
import { usePreferences } from "@/hooks/usePreferences";
import { useI18n } from "@/hooks/useI18n";
import {
  getBrowserNotificationPermission,
  type BrowserNotificationPermission,
} from "@/lib/notifications";

type TopBarProps = {
  onOpenSidebar?: () => void;
};

export function TopBar({ onOpenSidebar }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<BrowserNotificationPermission>("default");
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useI18n();

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    setNotificationPermission(getBrowserNotificationPermission());

    function handleVisibilityChange() {
      if (!document.hidden) {
        setNotificationPermission(getBrowserNotificationPermission());
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!notificationRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function toggleTheme() {
    updatePreferences({
      theme: preferences.theme === "light" ? "dark" : "light",
    });
  }

  function handleRefresh() {
    window.dispatchEvent(new Event("taskboard:reload"));
    router.refresh();
  }

  function getNotificationBody() {
    if (notificationPermission === "unsupported") {
      return t("notifications.bodyUnsupported");
    }

    if (notificationPermission === "denied") {
      return t("notifications.bodyDenied");
    }

    if (preferences.notificationsEnabled && notificationPermission === "granted") {
      return t("notifications.bodyPrepared");
    }

    return t("notifications.bodyDisabled");
  }

  const notificationStatusClass =
    preferences.notificationsEnabled && notificationPermission === "granted"
      ? "bg-emerald-400"
      : notificationPermission === "denied"
        ? "bg-amber-400"
        : "bg-zinc-500";

  function handleBrandClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/board") {
      event.preventDefault();
      window.dispatchEvent(new Event("taskboard:toggle-board-header"));
    }
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = nextQuery.trim();

    if (trimmed) params.set("q", trimmed);
    else params.delete("q");

    const nextPath = pathname === "/settings" ? "/board" : pathname;
    const nextUrl = params.toString()
      ? `${nextPath}?${params.toString()}`
      : nextPath;
    router.replace(nextUrl, { scroll: false });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-2xl p-2.5 text-zinc-300 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label={t("nav.open")}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          href="/board"
          onClick={handleBrandClick}
          className="flex items-center gap-3 rounded-2xl px-1.5 py-1 font-semibold tracking-tight transition hover:bg-white/5"
          title={
            pathname === "/board" ? t("board.toggleHeader") : t("app.name")
          }
        >
          <AppIcon />
          <span className="hidden sm:inline">Taskboard</span>
        </Link>

        <label className="ml-auto flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-sm text-zinc-500 transition focus-within:border-blue-500/60 focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-white/15 hover:bg-white/[0.06] sm:px-4 md:ml-8 md:max-w-xl">
          <Search className="h-4 w-4 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder={t("search.placeholder")}
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />
          {query ? (
            <button
              type="button"
              onClick={() => updateQuery("")}
              className="rounded-lg px-1.5 py-0.5 text-xs text-zinc-500 hover:bg-white/10 hover:text-white"
              aria-label={t("search.clear")}
            >
              <X className="h-3 w-3" />
            </button>
          ) : (
            <kbd className="ml-auto hidden rounded-lg border border-white/10 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400 sm:inline-flex">
              /
            </kbd>
          )}
        </label>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-2xl p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label={t("refresh.title")}
            title={t("refresh.title")}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-2xl p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label={
              preferences.theme === "light"
                ? t("theme.toDark")
                : t("theme.toLight")
            }
            title={
              preferences.theme === "light"
                ? t("theme.toDark")
                : t("theme.toLight")
            }
          >
            {preferences.theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              className="rounded-2xl p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white"
              aria-label={t("notifications.title")}
              title={t("notifications.title")}
            >
              <span className="relative inline-flex">
                <Bell className="h-4 w-4" />
                <span
                  className={`absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full ${notificationStatusClass}`}
                />
              </span>
            </button>
            {notificationsOpen ? (
              <div className="absolute right-0 z-40 mt-2 w-80 rounded-2xl border border-white/10 bg-zinc-950 p-3 text-sm shadow-2xl shadow-black/50">
                <p className="font-medium text-zinc-100">
                  {t("notifications.title")}
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {getNotificationBody()}
                </p>
                <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] leading-5 text-zinc-500">
                  {t("notifications.settingsHint")}
                </p>
              </div>
            ) : null}
          </div>
          <Link
            href="/settings"
            className="rounded-2xl p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label={t("settings.title")}
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>

        <AuthStatus />
      </div>
    </header>
  );
}
