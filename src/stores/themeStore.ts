/**
 * Daylight / Starlight theme state.
 *
 * The chosen theme persists in localStorage; before the store hydrates,
 * a tiny inline script in layout.tsx applies the saved (or system) theme
 * so there is no flash. "system" follows prefers-color-scheme.
 */
import { create } from "zustand";

export type ThemeName = "daylight" | "starlight";
export type ThemePreference = ThemeName | "system";

export const THEME_STORAGE_KEY = "softlab-theme";

export function resolveTheme(pref: ThemePreference): ThemeName {
  if (pref !== "system") return pref;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "starlight";
  }
  return "daylight";
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "daylight" || stored === "starlight") return stored;
  return "system";
}

type ThemeState = {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  toggle: () => void;
};

function applyTheme(pref: ThemePreference) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = resolveTheme(pref);
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: readStoredPreference(),
  setPreference: (pref) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, pref);
    }
    applyTheme(pref);
    set({ preference: pref });
  },
  toggle: () => {
    const current = resolveTheme(get().preference);
    get().setPreference(current === "daylight" ? "starlight" : "daylight");
  },
}));
