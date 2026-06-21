"use client";

import {
  CalendarDays,
  Languages,
  LayoutDashboard,
  ListChecks,
  Moon,
  Palette,
  Trash2,
  Volume2,
} from "lucide-react";
import { usePreferences } from "@/hooks/usePreferences";
import type { AppPreferences } from "@/lib/preferences";
import { useI18n } from "@/hooks/useI18n";
import { weekStartsOnOptions } from "@/lib/i18n";

export function PreferencesPanel() {
  const { preferences, updatePreferences } = usePreferences();
  const { t, language } = useI18n();

  const confirmDeleteLabel =
    language === "en" ? "Ask before deleting" : "Vor dem Löschen nachfragen";
  const taskDoneSoundLabel =
    language === "en" ? "Completion sound" : "Abhak-Sound";
  const taskDeleteSoundLabel =
    language === "en" ? "Delete sound" : "Löschsound";
  const soundPreferences = preferences as AppPreferences & {
    taskDoneSoundEffects?: boolean;
    taskDeleteSoundEffects?: boolean;
  };
  const taskDoneSoundEnabled =
    soundPreferences.taskDoneSoundEffects ?? preferences.soundEffects;
  const taskDeleteSoundEnabled =
    soundPreferences.taskDeleteSoundEffects ?? preferences.soundEffects;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-zinc-100">{t("settings.behaviorTitle")}</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {t("settings.behaviorBody")}
          </p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-500/10 text-blue-300">
          <LayoutDashboard className="h-5 w-5" />
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5 text-xs text-zinc-500">
          <span className="flex items-center gap-2">
            <Moon className="h-4 w-4" /> {t("settings.design")}
          </span>
          <select
            value={preferences.theme}
            onChange={(event) =>
              updatePreferences({ theme: event.target.value as AppPreferences["theme"] })
            }
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
          >
            <option value="dark">{t("settings.dark")}</option>
            <option value="light">{t("settings.light")}</option>
            <option value="system">{t("settings.system")}</option>
          </select>
        </label>

        <label className="space-y-1.5 text-xs text-zinc-500">
          <span className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> {t("settings.accentTheme")}
          </span>
          <select
            value={preferences.accentTheme}
            onChange={(event) =>
              updatePreferences({
                accentTheme: event.target.value as AppPreferences["accentTheme"],
              })
            }
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
          >
            <option value="cobalt">{t("settings.accentCobalt")}</option>
            <option value="violet">{t("settings.accentViolet")}</option>
            <option value="emerald">{t("settings.accentEmerald")}</option>
            <option value="graphite">{t("settings.accentGraphite")}</option>
          </select>
        </label>

        <label className="space-y-1.5 text-xs text-zinc-500">
          <span className="flex items-center gap-2">
            <Languages className="h-4 w-4" /> {t("settings.language")}
          </span>
          <select
            value={preferences.language}
            onChange={(event) =>
              updatePreferences({ language: event.target.value as AppPreferences["language"] })
            }
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
          <span className="block text-[11px] leading-5 text-zinc-600">
            {t("settings.languageHint")}
          </span>
        </label>

        <label className="space-y-1.5 text-xs text-zinc-500">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> {t("settings.weekStartsOn")}
          </span>
          <select
            value={preferences.weekStartsOn}
            onChange={(event) =>
              updatePreferences({
                weekStartsOn: event.target.value as AppPreferences["weekStartsOn"],
              })
            }
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
          >
            {weekStartsOnOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option[language]}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5 text-xs text-zinc-500">
          <span className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> {t("settings.defaultView")}
          </span>
          <select
            value={preferences.defaultView}
            onChange={(event) =>
              updatePreferences({
                defaultView: event.target.value as AppPreferences["defaultView"],
              })
            }
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
          >
            <option value="days">{t("sidebar.dayLists")}</option>
            <option value="kanban">{t("sidebar.horizontal")}</option>
          </select>
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          {t("settings.showTaskCounts")}
          <input
            type="checkbox"
            checked={preferences.showTaskCounts}
            onChange={(event) => updatePreferences({ showTaskCounts: event.target.checked })}
            className="h-4 w-4 accent-blue-500"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          <span className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" /> {taskDoneSoundLabel}
          </span>
          <input
            type="checkbox"
            checked={taskDoneSoundEnabled}
            onChange={(event) =>
              updatePreferences({
                taskDoneSoundEffects: event.target.checked,
              } as Partial<AppPreferences>)
            }
            className="h-4 w-4 accent-blue-500"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          <span className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" /> {taskDeleteSoundLabel}
          </span>
          <input
            type="checkbox"
            checked={taskDeleteSoundEnabled}
            onChange={(event) =>
              updatePreferences({
                taskDeleteSoundEffects: event.target.checked,
              } as Partial<AppPreferences>)
            }
            className="h-4 w-4 accent-blue-500"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          <span className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" /> {confirmDeleteLabel}
          </span>
          <input
            type="checkbox"
            checked={preferences.confirmBeforeDelete}
            onChange={(event) =>
              updatePreferences({ confirmBeforeDelete: event.target.checked })
            }
            className="h-4 w-4 accent-blue-500"
          />
        </label>
      </div>
    </section>
  );
}