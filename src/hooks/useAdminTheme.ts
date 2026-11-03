import { useEffect, useState } from "react";

const STORAGE_KEY = "exalto-admin-theme";

/**
 * Light/dark preference for the admin and sales-manager dashboards.
 *
 * The value is read synchronously on the first render (not in an effect), so a
 * reload paints straight into the saved mode instead of flashing dark first.
 * Both dashboards share one key, so the choice carries across them too.
 *
 * Defaults to dark, which is how these dashboards are designed.
 */
export function useAdminTheme() {
  const [lightMode, setLightMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "light";
    } catch {
      // Private mode / storage blocked — fall back to the dark default.
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lightMode ? "light" : "dark");
    } catch {
      // Storage unavailable: the toggle still works, it just won't persist.
    }
  }, [lightMode]);

  return [lightMode, setLightMode] as const;
}
