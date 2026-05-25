"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { PreferencesPanel } from "@/components/settings/PreferencesPanel";
import { DataManagementPanel } from "@/components/settings/DataManagementPanel";
import { InstallAppCard } from "@/components/pwa/InstallAppCard";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

function SettingsFallback() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/25">
          <p className="text-sm text-zinc-400">Einstellungen werden geladen ...</p>
        </div>
      </div>
    </div>
  );
}

function SettingsContent() {
  const { t } = useI18n();

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/25">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-300">
            {t("settings.pageLabel")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {t("settings.pageTitle")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            {t("settings.pageBody")}
          </p>
        </div>

        <PreferencesPanel />

        <InstallAppCard />

        <DataManagementPanel />

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-zinc-100">
                  {t("settings.encryptionTitle")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {t("settings.encryptionBody")}
                </p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-500/10 text-blue-300">
                <KeyRound className="h-5 w-5" />
              </span>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-zinc-100">
                  {t("settings.securityTitle")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {t("settings.securityBody")}
                </p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </span>
            </div>
          </article>
        </section>
      </section>
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsFallback />}>
      <SettingsContent />
    </Suspense>
  );
}