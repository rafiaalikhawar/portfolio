"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";

/** ⌘K / Ctrl+K opens the command palette from anywhere. */
export function useGlobalHotkeys() {
  const setPaletteOpen = useWorkspaceStore((s) => s.setPaletteOpen);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!useWorkspaceStore.getState().paletteOpen);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setPaletteOpen]);
}
