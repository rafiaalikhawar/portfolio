"use client";

/** Hosts all open project windows above the workspace. */
import { AnimatePresence } from "framer-motion";
import { useWindowStore, activeWindowId } from "@/stores/windowStore";
import { getProject } from "@/content/project-index";
import { useContainerSize } from "@/hooks/useContainerSize";
import { MacWindow } from "./MacWindow";

export function WindowLayer() {
  const windows = useWindowStore((s) => s.windows);
  const { ref, size } = useContainerSize<HTMLDivElement>();
  const activeId = activeWindowId(windows);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      aria-live="polite"
    >
      <AnimatePresence>
        {windows
          .filter((w) => !w.minimized)
          .map((w) => {
            const project = getProject(w.projectId);
            if (!project) return null;
            return (
              <MacWindow
                key={w.projectId}
                win={w}
                project={project}
                isActive={w.projectId === activeId}
                layerSize={size}
              />
            );
          })}
      </AnimatePresence>
    </div>
  );
}
