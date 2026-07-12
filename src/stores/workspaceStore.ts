/**
 * Workspace state: which view is active, which category is focused,
 * which project is selected/hovered, tour progress, and which projects
 * the visitor has already explored (persisted).
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryId } from "@/types/content";

export type WorkspaceView =
  "brain" | "search" | "images" | "about" | "contact" | "resume" | "experiments";

export type TourState = {
  tourId: string;
  stepIndex: number;
} | null;

type WorkspaceState = {
  view: WorkspaceView;
  /** Focused category on the brain map (null = default brain view). */
  selectedCategory: CategoryId | null;
  hoveredCategory: CategoryId | null;
  /** Project highlighted in the right panel / graph connections. */
  selectedProject: string | null;
  hoveredProject: string | null;
  /** Show all projects of a category (View all), not just featured. */
  showAllInCategory: boolean;
  tour: TourState;
  tourPickerOpen: boolean;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  paletteOpen: boolean;
  /** Welcome hero visible on top of the default brain view. */
  welcomeDismissed: boolean;
  exploredProjects: string[];

  setView: (view: WorkspaceView) => void;
  selectCategory: (id: CategoryId | null) => void;
  hoverCategory: (id: CategoryId | null) => void;
  selectProject: (id: string | null) => void;
  hoverProject: (id: string | null) => void;
  setShowAllInCategory: (v: boolean) => void;
  backToBrain: () => void;
  resetBrain: () => void;
  startTour: (tourId: string) => void;
  advanceTour: (stepCount: number) => void;
  previousTourStep: () => void;
  exitTour: () => void;
  setTourPickerOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setPaletteOpen: (open: boolean) => void;
  dismissWelcome: () => void;
  markExplored: (projectId: string) => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      view: "brain",
      selectedCategory: null,
      hoveredCategory: null,
      selectedProject: null,
      hoveredProject: null,
      showAllInCategory: false,
      tour: null,
      tourPickerOpen: false,
      sidebarOpen: true,
      mobileMenuOpen: false,
      paletteOpen: false,
      welcomeDismissed: false,
      exploredProjects: [],

      setView: (view) =>
        set({ view, mobileMenuOpen: false, ...(view !== "brain" ? {} : {}) }),
      selectCategory: (id) =>
        set({
          view: "brain",
          selectedCategory: id,
          selectedProject: null,
          showAllInCategory: false,
          welcomeDismissed: true,
        }),
      hoverCategory: (id) => set({ hoveredCategory: id }),
      selectProject: (id) => set({ selectedProject: id }),
      hoverProject: (id) => set({ hoveredProject: id }),
      setShowAllInCategory: (v) => set({ showAllInCategory: v }),
      backToBrain: () =>
        set({
          view: "brain",
          selectedCategory: null,
          selectedProject: null,
          hoveredProject: null,
          showAllInCategory: false,
        }),
      resetBrain: () =>
        set({
          view: "brain",
          selectedCategory: null,
          selectedProject: null,
          hoveredProject: null,
          hoveredCategory: null,
          showAllInCategory: false,
          tour: null,
          welcomeDismissed: false,
        }),
      startTour: (tourId) =>
        set({
          tour: { tourId, stepIndex: 0 },
          tourPickerOpen: false,
          view: "brain",
          selectedCategory: null,
          welcomeDismissed: true,
        }),
      advanceTour: (stepCount) => {
        const t = get().tour;
        if (!t) return;
        if (t.stepIndex + 1 >= stepCount) {
          set({ tour: null });
        } else {
          set({ tour: { ...t, stepIndex: t.stepIndex + 1 } });
        }
      },
      previousTourStep: () => {
        const t = get().tour;
        if (!t || t.stepIndex === 0) return;
        set({ tour: { ...t, stepIndex: t.stepIndex - 1 } });
      },
      exitTour: () => set({ tour: null }),
      setTourPickerOpen: (open) => set({ tourPickerOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setPaletteOpen: (open) => set({ paletteOpen: open }),
      dismissWelcome: () => set({ welcomeDismissed: true }),
      markExplored: (projectId) =>
        set((s) =>
          s.exploredProjects.includes(projectId)
            ? s
            : { exploredProjects: [...s.exploredProjects, projectId] },
        ),
    }),
    {
      name: "softlab-workspace",
      // Only preferences worth remembering across visits.
      partialize: (s) => ({
        exploredProjects: s.exploredProjects,
        sidebarOpen: s.sidebarOpen,
      }),
    },
  ),
);
