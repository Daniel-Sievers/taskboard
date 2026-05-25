"use client";

import { useEffect } from "react";
import { applyPreferences, readPreferences } from "@/lib/preferences";

export function PreferencesManager() {
  useEffect(() => {
    function applyCurrentPreferences() {
      applyPreferences(readPreferences());
    }

    applyCurrentPreferences();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", applyCurrentPreferences);
    window.addEventListener("storage", applyCurrentPreferences);

    return () => {
      mediaQuery.removeEventListener("change", applyCurrentPreferences);
      window.removeEventListener("storage", applyCurrentPreferences);
    };
  }, []);

  return null;
}
