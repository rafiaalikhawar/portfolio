/**
 * The Mac-style window manager: open/close, focus (z-order), drag, resize,
 * minimise-to-dock, restore, and maximise. Windows are keyed by project id
 * so a project can only ever be open once.
 */
import { create } from "zustand";
import { site } from "@/config/site";

export type Rect = { x: number; y: number; w: number; h: number };

export type ProjectWindow = {
  projectId: string;
  /** Where the window animates from/to (the project card). */
  origin: { x: number; y: number } | null;
  position: { x: number; y: number };
  size: { w: number; h: number };
  z: number;
  minimized: boolean;
  maximized: boolean;
  activeTab: string;
};

type WindowState = {
  windows: ProjectWindow[];
  nextZ: number;
  openWindow: (
    projectId: string,
    origin?: { x: number; y: number } | null,
  ) => "opened" | "focused" | "limit";
  closeWindow: (projectId: string) => void;
  focusWindow: (projectId: string) => void;
  moveWindow: (projectId: string, position: { x: number; y: number }) => void;
  resizeWindow: (projectId: string, size: { w: number; h: number }) => void;
  minimizeWindow: (projectId: string) => void;
  restoreWindow: (projectId: string) => void;
  toggleMaximize: (projectId: string) => void;
  setActiveTab: (projectId: string, tab: string) => void;
  closeAll: () => void;
};

const DEFAULT_SIZE = { w: 860, h: 620 };

function initialPosition(index: number): { x: number; y: number } {
  // Cascade new windows like a real desktop.
  const base = 60;
  const step = 36;
  return { x: base + step * (index % 5), y: base + step * (index % 5) };
}

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  nextZ: 10,

  openWindow: (projectId, origin = null) => {
    const { windows, nextZ } = get();
    const existing = windows.find((w) => w.projectId === projectId);
    if (existing) {
      set({
        windows: windows.map((w) =>
          w.projectId === projectId ? { ...w, minimized: false, z: nextZ } : w,
        ),
        nextZ: nextZ + 1,
      });
      return "focused";
    }
    const openCount = windows.length;
    if (openCount >= site.maxOpenWindows) return "limit";
    set({
      windows: [
        ...windows,
        {
          projectId,
          origin,
          position: initialPosition(openCount),
          size: { ...DEFAULT_SIZE },
          z: nextZ,
          minimized: false,
          maximized: false,
          activeTab: "overview",
        },
      ],
      nextZ: nextZ + 1,
    });
    return "opened";
  },

  closeWindow: (projectId) =>
    set((s) => ({
      windows: s.windows.filter((w) => w.projectId !== projectId),
    })),

  focusWindow: (projectId) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.projectId === projectId ? { ...w, z: s.nextZ } : w,
      ),
      nextZ: s.nextZ + 1,
    })),

  moveWindow: (projectId, position) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.projectId === projectId ? { ...w, position } : w,
      ),
    })),

  resizeWindow: (projectId, size) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.projectId === projectId
          ? {
              ...w,
              size: {
                w: Math.max(420, size.w),
                h: Math.max(320, size.h),
              },
            }
          : w,
      ),
    })),

  minimizeWindow: (projectId) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.projectId === projectId ? { ...w, minimized: true } : w,
      ),
    })),

  restoreWindow: (projectId) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.projectId === projectId ? { ...w, minimized: false, z: s.nextZ } : w,
      ),
      nextZ: s.nextZ + 1,
    })),

  toggleMaximize: (projectId) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.projectId === projectId
          ? { ...w, maximized: !w.maximized, minimized: false, z: s.nextZ }
          : w,
      ),
      nextZ: s.nextZ + 1,
    })),

  setActiveTab: (projectId, tab) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.projectId === projectId ? { ...w, activeTab: tab } : w,
      ),
    })),

  closeAll: () => set({ windows: [] }),
}));

/** The topmost non-minimised window, if any. */
export function activeWindowId(windows: ProjectWindow[]): string | null {
  const visible = windows.filter((w) => !w.minimized);
  if (visible.length === 0) return null;
  return visible.reduce((top, w) => (w.z > top.z ? w : top)).projectId;
}
