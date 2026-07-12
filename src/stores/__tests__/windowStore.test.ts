import { beforeEach, describe, expect, it } from "vitest";
import { useWindowStore, activeWindowId } from "@/stores/windowStore";
import { site } from "@/config/site";

beforeEach(() => {
  useWindowStore.getState().closeAll();
});

describe("window manager", () => {
  it("opens, focuses, and closes windows", () => {
    const s = useWindowStore.getState();
    expect(s.openWindow("hostelwalla")).toBe("opened");
    expect(useWindowStore.getState().openWindow("hostelwalla")).toBe("focused");
    expect(useWindowStore.getState().windows).toHaveLength(1);
    useWindowStore.getState().closeWindow("hostelwalla");
    expect(useWindowStore.getState().windows).toHaveLength(0);
  });

  it("enforces the maximum open window count", () => {
    const ids = ["a", "b", "c", "d", "e"];
    const outcomes = ids.map((id) => useWindowStore.getState().openWindow(id));
    expect(outcomes.filter((o) => o === "opened")).toHaveLength(site.maxOpenWindows);
    expect(outcomes[outcomes.length - 1]).toBe("limit");
  });

  it("minimise removes from active set; restore brings it back on top", () => {
    useWindowStore.getState().openWindow("a");
    useWindowStore.getState().openWindow("b");
    useWindowStore.getState().minimizeWindow("b");
    expect(activeWindowId(useWindowStore.getState().windows)).toBe("a");
    useWindowStore.getState().restoreWindow("b");
    const state = useWindowStore.getState();
    expect(activeWindowId(state.windows)).toBe("b");
    expect(state.windows.find((w) => w.projectId === "b")!.minimized).toBe(false);
  });

  it("focus raises z-order", () => {
    useWindowStore.getState().openWindow("a");
    useWindowStore.getState().openWindow("b");
    useWindowStore.getState().focusWindow("a");
    expect(activeWindowId(useWindowStore.getState().windows)).toBe("a");
  });

  it("maximise toggles and clears minimised state", () => {
    useWindowStore.getState().openWindow("a");
    useWindowStore.getState().minimizeWindow("a");
    useWindowStore.getState().toggleMaximize("a");
    const w = useWindowStore.getState().windows[0];
    expect(w.maximized).toBe(true);
    expect(w.minimized).toBe(false);
  });

  it("resize enforces sensible minimums", () => {
    useWindowStore.getState().openWindow("a");
    useWindowStore.getState().resizeWindow("a", { w: 10, h: 10 });
    const w = useWindowStore.getState().windows[0];
    expect(w.size.w).toBeGreaterThanOrEqual(420);
    expect(w.size.h).toBeGreaterThanOrEqual(320);
  });

  it("tracks the active case-study tab per window", () => {
    useWindowStore.getState().openWindow("a");
    useWindowStore.getState().setActiveTab("a", "results");
    expect(useWindowStore.getState().windows[0].activeTab).toBe("results");
  });
});
