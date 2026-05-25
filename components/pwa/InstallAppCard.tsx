"use client";

import { useEffect, useState } from "react";
import { Download, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/hooks/useI18n";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export function InstallAppCard() {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setInstalled(isStandalone());
    setCanInstall(Boolean(window.taskboardInstallPrompt));

    function refreshInstallState() {
      setInstalled(isStandalone());
      setCanInstall(Boolean(window.taskboardInstallPrompt));
    }

    window.addEventListener("taskboard-install-available", refreshInstallState);
    window.addEventListener("appinstalled", refreshInstallState);

    return () => {
      window.removeEventListener("taskboard-install-available", refreshInstallState);
      window.removeEventListener("appinstalled", refreshInstallState);
    };
  }, []);

  async function installApp() {
    const promptEvent = window.taskboardInstallPrompt;
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") {
      window.taskboardInstallPrompt = undefined;
      setCanInstall(false);
      setInstalled(true);
    }
  }

  return (
    <section className="rounded-[2rem] border border-blue-400/15 bg-blue-400/5 p-5 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-blue-300">{t("pwa.label")}</p>
          <h2 className="mt-2 font-semibold text-zinc-100">{t("pwa.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {t("pwa.body")}
          </p>
          {installed ? (
            <p className="mt-3 text-sm text-emerald-300">{t("pwa.installed")}</p>
          ) : !canInstall ? (
            <p className="mt-3 text-sm text-zinc-500">
              {t("pwa.browserHint")}
            </p>
          ) : null}
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-500/10 text-blue-300">
          <MonitorSmartphone className="h-5 w-5" />
        </span>
      </div>

      <Button type="button" className="mt-5" onClick={installApp} disabled={!canInstall || installed}>
        <Download className="h-4 w-4" />
        {installed ? t("pwa.installedButton") : canInstall ? t("pwa.install") : t("pwa.installMenu")}
      </Button>
    </section>
  );
}
