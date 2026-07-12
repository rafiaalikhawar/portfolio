"use client";

/**
 * A Soft Lab browser window: Safari's softness, Chrome's tab shape, and a
 * pastel identity of its own. Draggable, resizable, minimisable (to dock),
 * maximisable, layered, with real back/forward controls that walk the
 * window's own tab history.
 */
import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PortfolioProject } from "@/types/content";
import { buildTabs } from "@/lib/tabs";
import { site } from "@/config/site";
import { useWindowStore, type ProjectWindow } from "@/stores/windowStore";
import { CaseStudyContent } from "@/components/case-study/CaseStudyContent";
import { windowSpring } from "@/lib/motion";

const microcopyByCategory: Record<string, string> = {
  "ai-engineering": "Technical details ahead. Glasses may help.",
  research: "The evidence is probably hiding in another tab.",
  marketing: "This was messier than the final screenshot suggests.",
  product: "Opening one of Rafia’s many tabs…",
  business: "This one became much bigger than expected.",
  games: "You have officially entered the rabbit hole.",
  "social-impact": "Connecting the dots…",
};

export function MacWindow({
  win,
  project,
  isActive,
  layerSize,
}: {
  win: ProjectWindow;
  project: PortfolioProject;
  isActive: boolean;
  layerSize: { width: number; height: number };
}) {
  const reduceMotion = useReducedMotion();
  const {
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    moveWindow,
    resizeWindow,
    setActiveTab,
  } = useWindowStore();

  const tabs = useMemo(() => buildTabs(project), [project]);
  const activeTab = tabs.find((t) => t.id === win.activeTab) ?? tabs[0];

  // Per-window tab history so the back/forward controls are real.
  const [history, setHistory] = useState<{ stack: string[]; index: number }>({
    stack: [win.activeTab],
    index: 0,
  });

  function navigateToTab(tabId: string) {
    setHistory({
      stack: [...history.stack.slice(0, history.index + 1), tabId],
      index: history.index + 1,
    });
    setActiveTab(win.projectId, tabId);
  }

  function goBack() {
    if (history.index === 0) return;
    const index = history.index - 1;
    setHistory({ ...history, index });
    setActiveTab(win.projectId, history.stack[index]);
  }

  function goForward() {
    if (history.index >= history.stack.length - 1) return;
    const index = history.index + 1;
    setHistory({ ...history, index });
    setActiveTab(win.projectId, history.stack[index]);
  }

  const canGoBack = history.index > 0;
  const canGoForward = history.index < history.stack.length - 1;

  // While the user drags or resizes, position/size must track the pointer
  // 1:1 — the spring only animates programmatic moves (open, maximise).
  const [interacting, setInteracting] = useState(false);

  // ── Dragging (title bar) ────────────────────────────────────────────
  const dragState = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  function onHeaderPointerDown(e: React.PointerEvent) {
    if (win.maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    focusWindow(win.projectId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: win.position.x,
      origY: win.position.y,
    };
    setInteracting(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onHeaderPointerMove(e: React.PointerEvent) {
    const d = dragState.current;
    if (!d) return;
    // Keep the window inside the left edge (the sidebar would swallow the
    // traffic lights) and keep a grabbable strip on the right.
    const x = Math.min(
      Math.max(d.origX + e.clientX - d.startX, 0),
      Math.max(layerSize.width - 120, 0),
    );
    const y = Math.min(
      Math.max(d.origY + e.clientY - d.startY, 0),
      Math.max(layerSize.height - 48, 0),
    );
    moveWindow(win.projectId, { x, y });
  }

  function onHeaderPointerUp(e: React.PointerEvent) {
    dragState.current = null;
    setInteracting(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  // ── Resizing (bottom-right handle) ──────────────────────────────────
  const resizeState = useRef<{
    startX: number;
    startY: number;
    origW: number;
    origH: number;
  } | null>(null);

  function onResizePointerDown(e: React.PointerEvent) {
    if (win.maximized) return;
    e.stopPropagation();
    focusWindow(win.projectId);
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: win.size.w,
      origH: win.size.h,
    };
    setInteracting(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onResizePointerMove(e: React.PointerEvent) {
    const r = resizeState.current;
    if (!r) return;
    resizeWindow(win.projectId, {
      w: r.origW + (e.clientX - r.startX),
      h: r.origH + (e.clientY - r.startY),
    });
  }

  function onResizePointerUp(e: React.PointerEvent) {
    resizeState.current = null;
    setInteracting(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  const frame = win.maximized
    ? { x: 8, y: 8, w: layerSize.width - 16, h: layerSize.height - 16 }
    : { x: win.position.x, y: win.position.y, w: win.size.w, h: win.size.h };

  const origin = win.origin;

  return (
    <motion.section
      role="dialog"
      aria-label={`${project.title} case study window`}
      className="pointer-events-auto absolute flex flex-col overflow-hidden rounded-xl border"
      style={{
        zIndex: win.z,
        borderColor: isActive ? "var(--line-strong)" : "var(--line)",
        background: "var(--surface-2)",
        boxShadow: isActive ? "var(--shadow-lift)" : "var(--shadow-soft)",
      }}
      initial={
        reduceMotion || !origin
          ? {
              opacity: 0,
              left: frame.x,
              top: frame.y,
              width: frame.w,
              height: frame.h,
              scale: 0.98,
            }
          : {
              opacity: 0,
              left: origin.x - 60,
              top: origin.y - 40,
              width: 120,
              height: 80,
              scale: 0.9,
            }
      }
      animate={{
        opacity: 1,
        left: frame.x,
        top: frame.y,
        width: frame.w,
        height: frame.h,
        scale: 1,
      }}
      exit={
        reduceMotion
          ? { opacity: 0, transition: { duration: 0.01 } }
          : origin
            ? {
                opacity: 0,
                left: origin.x - 60,
                top: origin.y - 40,
                width: 120,
                height: 80,
                scale: 0.9,
                transition: { duration: 0.24, ease: [0.32, 0.72, 0.24, 1] },
              }
            : {
                opacity: 0,
                scale: 0.96,
                transition: { duration: 0.2, ease: [0.32, 0.72, 0.24, 1] },
              }
      }
      transition={reduceMotion || interacting ? { duration: 0.01 } : windowSpring}
      onPointerDown={() => focusWindow(win.projectId)}
      onKeyDown={(e) => {
        if (e.key === "Escape") closeWindow(win.projectId);
      }}
    >
      {/* Title bar */}
      <header
        className="flex shrink-0 cursor-grab touch-none items-center gap-3 border-b border-line px-3 py-2 active:cursor-grabbing"
        style={{ background: "var(--surface-3)", opacity: isActive ? 1 : 0.85 }}
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        onDoubleClick={() => toggleMaximize(win.projectId)}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Close window"
            onClick={() => closeWindow(win.projectId)}
            className="group flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full text-[8px] leading-none text-transparent hover:text-[#7c2d2d]"
            style={{ background: "#f38f8a", border: "1px solid rgba(0,0,0,0.12)" }}
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Minimise window to dock"
            onClick={() => minimizeWindow(win.projectId)}
            className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full text-[8px] leading-none text-transparent hover:text-[#7a5a1e]"
            style={{ background: "#f7ce69", border: "1px solid rgba(0,0,0,0.12)" }}
          >
            −
          </button>
          <button
            type="button"
            aria-label={win.maximized ? "Restore window size" : "Maximise window"}
            onClick={() => toggleMaximize(win.projectId)}
            className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full text-[7px] leading-none text-transparent hover:text-[#2e5a2e]"
            style={{ background: "#8fd08a", border: "1px solid rgba(0,0,0,0.12)" }}
          >
            {win.maximized ? "▾" : "▴"}
          </button>
        </div>

        {/* Back / forward + address bar */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            aria-label="Back (previous tab in this window)"
            onClick={goBack}
            disabled={!canGoBack}
            className="cursor-pointer rounded-md px-1.5 py-0.5 text-sm text-muted transition-colors hover:bg-surface-2 disabled:cursor-default disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Forward (next tab in this window)"
            onClick={goForward}
            disabled={!canGoForward}
            className="cursor-pointer rounded-md px-1.5 py-0.5 text-sm text-muted transition-colors hover:bg-surface-2 disabled:cursor-default disabled:opacity-30"
          >
            →
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1">
            <span aria-hidden className="text-[10px]">
              🔒
            </span>
            <span className="truncate font-mono text-[11px] text-muted">
              {site.localDomain}/brain/{project.slug}
              {activeTab && activeTab.id !== "overview" ? `#${activeTab.id}` : ""}
            </span>
          </div>
        </div>

        <span aria-hidden className="hidden shrink-0 text-sm sm:block">
          {project.icon}
        </span>
      </header>

      {/* Browser-style tabs */}
      <nav
        aria-label={`${project.title} case study sections`}
        className="flex shrink-0 items-end gap-0.5 overflow-x-auto border-b border-line px-2 pt-1.5"
        style={{ background: "var(--surface-3)" }}
        role="tablist"
      >
        {tabs.map((tab) => {
          const active = tab.id === activeTab?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`tabpanel-${win.projectId}`}
              onClick={() => navigateToTab(tab.id)}
              className={`relative shrink-0 cursor-pointer rounded-t-lg border border-b-0 px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                active
                  ? "border-line bg-surface-2 text-ink"
                  : "border-transparent text-muted hover:bg-surface-2/50 hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <div
        id={`tabpanel-${win.projectId}`}
        role="tabpanel"
        aria-label={activeTab?.label}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        <p className="px-6 pt-3 font-serif text-lg font-semibold text-ink">
          <span aria-hidden>{project.icon} </span>
          {project.title}
        </p>
        <p className="px-6 pt-0.5 font-mono text-[10px] italic text-muted/80">
          {microcopyByCategory[project.primaryCategory]}
        </p>
        {activeTab && <CaseStudyContent project={project} tab={activeTab} />}
      </div>

      {/* Resize handle */}
      {!win.maximized && (
        <div
          role="presentation"
          aria-hidden
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize touch-none"
          style={{
            backgroundImage:
              "linear-gradient(135deg, transparent 55%, var(--line-strong) 55%, var(--line-strong) 62%, transparent 62%, transparent 72%, var(--line-strong) 72%, var(--line-strong) 79%, transparent 79%)",
          }}
        />
      )}
    </motion.section>
  );
}
