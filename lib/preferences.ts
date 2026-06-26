export type AppTheme = "dark" | "light" | "system";
export type AppLanguage = "de" | "en";
export type WeekStartsOn =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export type DefaultView = "days" | "kanban";
export type AccentTheme = "cobalt" | "violet" | "emerald" | "graphite";

export type AppPreferences = {
  theme: AppTheme;
  language: AppLanguage;
  weekStartsOn: WeekStartsOn;
  defaultView: DefaultView;
  startOnDefaultBoard: boolean;
  accentTheme: AccentTheme;
  showTaskCounts: boolean;
  soundEffects: boolean;
  confirmBeforeDelete: boolean;
  notificationsEnabled: boolean;
};

export const preferencesStorageKey = "taskboard:preferences";
export const preferencesChangedEventName = "taskboard:preferences-changed";

export const defaultPreferences: AppPreferences = {
  theme: "dark",
  language: "de",
  weekStartsOn: "monday",
  defaultView: "days",
  startOnDefaultBoard: true,
  accentTheme: "cobalt",
  showTaskCounts: true,
  soundEffects: true,
  confirmBeforeDelete: true,
  notificationsEnabled: false,
};

export function readPreferences(): AppPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = window.localStorage.getItem(preferencesStorageKey);
    if (!raw) return defaultPreferences;
    return { ...defaultPreferences, ...JSON.parse(raw) } as AppPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(preferences: AppPreferences) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
  applyPreferences(preferences);
  window.dispatchEvent(
    new CustomEvent<AppPreferences>(preferencesChangedEventName, {
      detail: preferences,
    }),
  );
}

export function resolveTheme(theme: AppTheme): "dark" | "light" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyPreferences(preferences: AppPreferences) {
  if (typeof document === "undefined") return;
  const resolvedTheme = resolveTheme(preferences.theme);
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themeChoice = preferences.theme;
  document.documentElement.dataset.weekStartsOn = preferences.weekStartsOn;
  document.documentElement.dataset.accent = preferences.accentTheme;
  document.documentElement.lang = preferences.language;
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function updatePreferences(next: Partial<AppPreferences>) {
  const merged = { ...readPreferences(), ...next };
  savePreferences(merged);
  return merged;
}