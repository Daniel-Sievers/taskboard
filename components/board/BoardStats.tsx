"use client";

import { CheckCircle2, Cloud, Database, Loader2, Lock, Wifi } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import type { Task } from "@/types/task";
import { useI18n } from "@/hooks/useI18n";

export function BoardStats({ tasks, mode, isSaving }: { tasks: Task[]; mode: "demo" | "supabase"; isSaving: boolean }) {
  const { t } = useI18n();
  const completed = tasks.filter((task) => task.status === "done").length;
  const encrypted = tasks.filter((task) => task.isEncrypted).length;
  const estimatedBytes = new Blob([JSON.stringify(tasks)]).size;

  const stats = [
    { label: t("stats.tasks"), value: tasks.length, icon: CheckCircle2 },
    { label: t("stats.done"), value: completed, icon: CheckCircle2 },
    { label: t("stats.sensitive"), value: encrypted, icon: Lock },
    { label: t("stats.storage"), value: formatBytes(estimatedBytes), icon: Database }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <Icon className="h-4 w-4 text-zinc-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">{stat.value}</p>
          </div>
        );
      })}
      <div className={mode === "supabase" ? "rounded-3xl border border-emerald-400/15 bg-emerald-400/5 p-4 shadow-2xl shadow-black/20 sm:col-span-2 xl:col-span-4" : "rounded-3xl border border-amber-400/15 bg-amber-400/5 p-4 shadow-2xl shadow-black/20 sm:col-span-2 xl:col-span-4"}>
        <div className={mode === "supabase" ? "flex flex-wrap items-center gap-2 text-sm text-emerald-200" : "flex flex-wrap items-center gap-2 text-sm text-amber-200"}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "supabase" ? <Cloud className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
          {isSaving
            ? t("stats.saving")
            : mode === "supabase"
              ? t("stats.supabaseConnected")
              : t("stats.demoMode")}
        </div>
      </div>
    </div>
  );
}
