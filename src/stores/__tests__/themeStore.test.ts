// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { useThemeStore, resolveTheme, THEME_STORAGE_KEY } from "@/stores/themeStore";

beforeEach(() => {
  window.localStorage.clear();
});

describe("theme persistence", () => {
  it("resolves explicit preferences directly", () => {
    expect(resolveTheme("daylight")).toBe("daylight");
    expect(resolveTheme("starlight")).toBe("starlight");
  });

  it("persists the chosen theme to localStorage and the DOM", () => {
    useThemeStore.getState().setPreference("starlight");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("starlight");
    expect(document.documentElement.dataset.theme).toBe("starlight");
  });

  it("toggle flips between the two themes", () => {
    useThemeStore.getState().setPreference("daylight");
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().preference).toBe("starlight");
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().preference).toBe("daylight");
  });
});
