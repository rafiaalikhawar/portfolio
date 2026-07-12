"use client";

/**
 * Obsidian-inspired file explorer. Folders expand/collapse; leaves focus a
 * category, open a project window, switch a workspace view, or open an
 * external link. Project lists derive from the project index.
 */
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categories } from "@/content/categories";
import {
  allProjects,
  currentlyBuildingProjects,
  featuredProjects,
  projectsForCategory,
} from "@/content/project-index";
import { useWorkspaceStore, type WorkspaceView } from "@/stores/workspaceStore";
import { useWindowStore } from "@/stores/windowStore";
import { quickTransition } from "@/lib/motion";
import type { PortfolioProject } from "@/types/content";

function Leaf({
  label,
  icon,
  onClick,
  active,
  depth = 0,
  badge,
}: {
  label: string;
  icon?: string;
  onClick: () => void;
  active?: boolean;
  depth?: number;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1 pr-2 text-left text-[12.5px] transition-colors ${
        active
          ? "bg-sky font-semibold text-ink"
          : "text-muted hover:bg-surface-3 hover:text-ink"
      }`}
      style={{ paddingLeft: 8 + depth * 14 }}
    >
      {icon && (
        <span aria-hidden className="text-[13px]">
          {icon}
        </span>
      )}
      <span className="truncate">{label}</span>
      {badge}
    </button>
  );
}

function Folder({
  label,
  icon,
  children,
  defaultOpen = false,
  count,
}: {
  label: string;
  icon?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion();
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-left text-[12.5px] font-semibold text-ink hover:bg-surface-3"
      >
        <span
          aria-hidden
          className="inline-block w-3 text-[9px] text-muted transition-transform"
          style={{ transform: open ? "rotate(90deg)" : undefined }}
        >
          ▶
        </span>
        {icon && (
          <span aria-hidden className="text-[13px]">
            {icon}
          </span>
        )}
        <span className="truncate">{label}</span>
        {count !== undefined && (
          <span className="ml-auto font-mono text-[9.5px] text-muted">{count}</span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            {...(reduceMotion
              ? {}
              : {
                  initial: { height: 0, opacity: 0 },
                  animate: { height: "auto", opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                })}
            transition={quickTransition}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectLeaf({ project, depth }: { project: PortfolioProject; depth: number }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const selectProject = useWorkspaceStore((s) => s.selectProject);
  return (
    <Leaf
      label={project.shortTitle ?? project.title}
      icon={project.icon}
      depth={depth}
      onClick={() => {
        selectProject(project.id);
        openWindow(project.id);
      }}
      badge={
        project.activelyBuilding ? (
          <span
            aria-hidden
            className="pulse-dot ml-auto h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: "var(--work-founded)" }}
          />
        ) : undefined
      }
    />
  );
}

export function Sidebar() {
  const {
    view,
    selectedCategory,
    setView,
    selectCategory,
    backToBrain,
    setTourPickerOpen,
  } = useWorkspaceStore();

  const viewLeaf = (label: string, icon: string, v: WorkspaceView) => (
    <Leaf
      label={label}
      icon={icon}
      onClick={() => setView(v)}
      active={view === v}
      depth={0}
    />
  );

  return (
    <nav
      aria-label="Workspace explorer"
      className="flex h-full w-56 shrink-0 flex-col overflow-y-auto border-r border-line bg-surface px-2 py-3"
    >
      <p className="mb-2 px-2 font-mono text-[9.5px] uppercase tracking-widest text-muted">
        rafia’s second brain
      </p>

      <Leaf
        label="Start Here"
        icon="🌱"
        onClick={() => {
          backToBrain();
          useWorkspaceStore.getState().resetBrain();
        }}
        active={view === "brain" && !selectedCategory}
      />
      {viewLeaf("About Rafia", "♡", "about")}
      <Leaf label="Guided Tour" icon="🎈" onClick={() => setTourPickerOpen(true)} />

      <div className="my-2 border-t border-line" />

      <Folder
        label="Selected Work"
        icon="⭐"
        defaultOpen
        count={featuredProjects().length}
      >
        {featuredProjects().map((p) => (
          <ProjectLeaf key={p.id} project={p} depth={1} />
        ))}
      </Folder>

      {categories.map((cat) => {
        const projects = projectsForCategory(cat.id);
        return (
          <Folder
            key={cat.id}
            label={cat.label}
            icon={cat.icon}
            count={projects.length}
          >
            <Leaf
              label={`Open ${cat.shortLabel ?? cat.label} map`}
              icon="◎"
              depth={1}
              active={selectedCategory === cat.id}
              onClick={() => selectCategory(cat.id)}
            />
            {projects.map((p) => (
              <ProjectLeaf key={p.id} project={p} depth={1} />
            ))}
          </Folder>
        );
      })}

      <div className="my-2 border-t border-line" />

      <Folder
        label="Currently Building"
        icon="🔨"
        count={currentlyBuildingProjects().length}
      >
        {currentlyBuildingProjects().map((p) => (
          <ProjectLeaf key={p.id} project={p} depth={1} />
        ))}
      </Folder>

      <Leaf
        label="Tiny Experiments"
        icon="🫙"
        onClick={() => setView("experiments")}
        active={view === "experiments"}
      />

      <div className="my-2 border-t border-line" />

      {viewLeaf("Resume", "📄", "resume")}
      {viewLeaf("Contact", "✉️", "contact")}

      <p className="mt-auto px-2 pt-4 font-mono text-[9px] text-muted/60">
        {allProjects.length} notes · all connected
      </p>
    </nav>
  );
}
