/**
 * Mac Preview-style image viewer state. The viewer sits above the window
 * layering system (it is modal), so it never fights project windows for z.
 */
import { create } from "zustand";
import type { GalleryItem } from "@/types/content";

export type ViewerImage = GalleryItem & {
  projectId: string;
  projectTitle: string;
};

type ViewerState = {
  images: ViewerImage[];
  index: number | null;
  zoom: number;
  open: (images: ViewerImage[], index: number) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
  setZoom: (zoom: number) => void;
};

export const useViewerStore = create<ViewerState>((set, get) => ({
  images: [],
  index: null,
  zoom: 1,
  open: (images, index) => set({ images, index, zoom: 1 }),
  close: () => set({ index: null, zoom: 1 }),
  next: () => {
    const { images, index } = get();
    if (index === null || images.length === 0) return;
    set({ index: (index + 1) % images.length, zoom: 1 });
  },
  previous: () => {
    const { images, index } = get();
    if (index === null || images.length === 0) return;
    set({ index: (index - 1 + images.length) % images.length, zoom: 1 });
  },
  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.5, zoom)) }),
}));
