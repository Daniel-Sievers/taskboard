"use client";

import { useEffect, useState } from "react";
import {
  type AppPreferences,
  defaultPreferences,
  preferencesChangedEventName,
  readPreferences,
  updatePreferences as persistPreferences,
} from "@/lib/preferences";

export function usePreferences() {
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);

  useEffect(() => {
    setPreferences(readPreferences());

    function handlePreferencesChanged(event: Event) {
      const customEvent = event as CustomEvent<AppPreferences>;
      setPreferences(customEvent.detail ?? readPreferences());
    }

    function handleStorage() {
      setPreferences(readPreferences());
    }

    window.addEventListener(preferencesChangedEventName, handlePreferencesChanged);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(preferencesChangedEventName, handlePreferencesChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function updatePreferences(next: Partial<AppPreferences>) {
    const updated = persistPreferences(next);
    setPreferences(updated);
  }

  return { preferences, updatePreferences };
}
