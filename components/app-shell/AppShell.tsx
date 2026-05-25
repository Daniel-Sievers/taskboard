"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AppIcon } from "./AppIcon";
import { useI18n } from "@/hooks/useI18n";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="min-h-screen text-zinc-100">
      <TopBar onOpenSidebar={() => setMobileSidebarOpen(true)} />

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-[1000] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label={t("nav.close")}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex h-full w-[min(22rem,calc(100vw-2rem))] flex-col border-r border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
            <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
              <div className="flex items-center gap-3 font-semibold tracking-tight">
                <AppIcon />
                <span>Taskboard</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-2xl p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                aria-label={t("nav.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <Sidebar mobile onNavigate={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
