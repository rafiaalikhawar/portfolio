"use client";

/**
 * The focused-category view: project note cards unfold beside the brain
 * map when a world is selected. Featured projects come first; long
 * categories collapse behind a "View all" control.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categoryMap } from "@/content/categories";
import { projectsForCategory } from "@/content/project-index";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { ProjectCard } from "@/components/project-cards/ProjectCard";
import { fadeUp, softTransition } from "@/lib/motion";

const VISIBLE_LIMIT = 4;

export function CategoryFocusPanel() {
  const reduceMotion = useReducedMotion();
  const selectedCategory = useWorkspaceStore((s) => s.selectedCategory);
  const showAll = useWorkspaceStore((s) => s.showAllInCategory);
  const setShowAll = useWorkspaceStore((s) => s.setShowAllInCategory);
  const backToBrain = useWorkspaceStore((s) => s.backToBrain);

  if (!selectedCategory) return null;
  const category = categoryMap[selectedCategory];
  const projects = projectsForCategory(selectedCategory);
  const visible = showAll ? projects : projects.slice(0, VISIBLE_LIMIT);
  const hiddenCount = projects.length - visible.length;

  return (
    <motion.aside
      key={selectedCategory}
      aria-label={`${category.label} projects`}
      className="flex h-full w-[340px] shrink-0 flex-col gap-3 overflow-hidden"
      {...(reduceMotion
        ? {}
        : {
            initial: { opacity: 0, x: 24 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 16 },
          })}
      transition={softTransition}
    >
      <div
        className="panel px-4 py-3"
        style={{ background: `var(${category.colorVar})` }}
      >
        <button
          type="button"
          onClick={backToBrain}
          className="mb-2 inline-flex cursor-pointer items-center gap-1 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted transition-colors hover:text-ink"
        >
          ← Back to brain
        </button>
        <p className="font-serif text-lg font-semibold text-ink">
          <span aria-hidden>{category.icon} </span>
          {category.label}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink/80">
          {category.description}
        </p>
        <p className="mt-1.5 font-mono text-[10.5px] text-ink/60">
          {projects.length} project{projects.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pb-2 pr-1">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </AnimatePresence>

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="cursor-pointer rounded-xl border border-dashed border-line-strong bg-surface-2/60 px-3 py-2.5 text-xs font-semibold text-muted transition-colors hover:text-ink"
          >
            View all {projects.length} projects
          </button>
        )}
        {showAll && projects.length > VISIBLE_LIMIT && (
          <motion.button
            type="button"
            onClick={() => setShowAll(false)}
            className="cursor-pointer rounded-xl border border-dashed border-line px-3 py-2 text-[11px] text-muted hover:text-ink"
            {...(reduceMotion ? {} : fadeUp)}
          >
            Show featured only
          </motion.button>
        )}
      </div>
    </motion.aside>
  );
}
