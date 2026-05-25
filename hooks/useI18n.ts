"use client";

import { useCallback } from "react";
import { translate, type TranslationKey } from "@/lib/i18n";
import { usePreferences } from "./usePreferences";

export function useI18n() {
  const { preferences } = usePreferences();
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(preferences.language, key, params),
    [preferences.language],
  );

  return { t, language: preferences.language };
}
