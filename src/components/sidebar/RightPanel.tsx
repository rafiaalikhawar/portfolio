"use client";

/**
 * Right contextual panel — the full metadata home. Cards stay clean
 * because tags, tools, collaborators, and related work live here.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categoryMap } from "@/content/categories";
import {
  countProjectsForCategory,
  getProject,
  projectsForCategory,
  relatedProjects,
  secondaryProjectsForCategory,
} from "@/content/project-index";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useWindowStore } from "@/stores/windowStore";
import { workTypeStyles, statusLabels } from "@/config/workTypes";
import { FeaturedBadge, StatusBadge, WorkTypeBadge } from "@/components/ui/Badge";
import { softTransition } from "@/lib/motion";

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-4 font-mono text-[9.5px] uppercase tracking-widest text-muted first:mt-0">
      {children}
    </p>
  );
}

export function RightPanel() {
  const reduceMotion = useReducedMotion();
  const { selectedCategory, selectedProject, hoveredProject } = useWorkspaceStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  const selectProject = useWorkspaceStore((s) => s.selectProject);

  const projectId = hoveredProject ?? selectedProject;
  const project = projectId ? getProject(projectId) : undefined;
  const category = selectedCategory ? categoryMap[selectedCategory] : undefined;

  if (!project && !category) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={project ? `p-${project.id}` : `c-${category!.id}`}
        aria-label="Context"
        className="hidden h-full w-64 shrink-0 flex-col overflow-y-auto border-l border-line bg-surface px-4 py-4 xl:flex"
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, x: 12 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: 8 },
            })}
        transition={softTransition}
      >
        {project ? (
          <>
            <p className="font-serif text-lg font-semibold text-ink">
              <span aria-hidden>{project.icon} </span>
              {project.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.featured && <FeaturedBadge />}
              <WorkTypeBadge project={project} />
              <StatusBadge project={project} />
            </div>

            <PanelLabel>Summary</PanelLabel>
            <p className="text-xs leading-relaxed text-muted">{project.summary}</p>

            <PanelLabel>Primary world</PanelLabel>
            <p className="text-xs font-semibold text-ink">
              {categoryMap[project.primaryCategory].icon}{" "}
              {categoryMap[project.primaryCategory].label}
            </p>

            {project.secondaryCategories.length > 0 && (
              <>
                <PanelLabel>Also connected to</PanelLabel>
                <p className="text-xs text-muted">
                  {project.secondaryCategories
                    .map((c) => categoryMap[c].label)
                    .join(" · ")}
                </p>
              </>
            )}

            {project.tags.length > 0 && (
              <>
                <PanelLabel>Tags</PanelLabel>
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}

            {project.caseStudy.tools && project.caseStudy.tools.length > 0 && (
              <>
                <PanelLabel>Tools</PanelLabel>
                <p className="font-mono text-[10.5px] text-muted">
                  {project.caseStudy.tools.join(" · ")}
                </p>
              </>
            )}

            {project.role && (
              <>
                <PanelLabel>Role</PanelLabel>
                <p className="text-xs leading-relaxed text-muted">{project.role}</p>
              </>
            )}

            {relatedProjects(project).length > 0 && (
              <>
                <PanelLabel>Related projects</PanelLabel>
                <div className="flex flex-col gap-1">
                  {relatedProjects(project).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        selectProject(r.id);
                        openWindow(r.id);
                      }}
                      className="cursor-pointer rounded-md px-1.5 py-1 text-left text-xs text-muted hover:bg-surface-3 hover:text-ink"
                    >
                      <span aria-hidden>{r.icon} </span>
                      {r.shortTitle ?? r.title}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => openWindow(project.id)}
              className="mt-5 cursor-pointer rounded-full border border-line-strong bg-sky px-4 py-2 text-xs font-bold text-ink shadow-sm transition-transform hover:scale-[1.02]"
            >
              Open case study ↗
            </button>
            <p className="mt-2 text-center font-mono text-[9px] text-muted/70">
              {statusLabels[project.status]} · {workTypeStyles[project.workType].label}
            </p>
          </>
        ) : category ? (
          <>
            <p className="font-serif text-lg font-semibold text-ink">
              <span aria-hidden>{category.icon} </span>
              {category.label}
            </p>
            <PanelLabel>About this world</PanelLabel>
            <p className="text-xs leading-relaxed text-muted">{category.description}</p>

            <PanelLabel>Projects</PanelLabel>
            <p className="text-xs text-muted">
              {countProjectsForCategory(category.id)} primary ·{" "}
              {secondaryProjectsForCategory(category.id).length} connected
            </p>

            <PanelLabel>Featured here</PanelLabel>
            <div className="flex flex-col gap-1">
              {projectsForCategory(category.id)
                .filter((p) => p.featured)
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => openWindow(p.id)}
                    className="cursor-pointer rounded-md px-1.5 py-1 text-left text-xs text-muted hover:bg-surface-3 hover:text-ink"
                  >
                    <span aria-hidden>{p.icon} </span>
                    {p.shortTitle ?? p.title}
                  </button>
                ))}
            </div>

            {secondaryProjectsForCategory(category.id).length > 0 && (
              <>
                <PanelLabel>Also passes through here</PanelLabel>
                <div className="flex flex-col gap-1">
                  {secondaryProjectsForCategory(category.id).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => openWindow(p.id)}
                      className="cursor-pointer rounded-md px-1.5 py-1 text-left text-xs text-muted/80 hover:bg-surface-3 hover:text-ink"
                    >
                      <span aria-hidden>{p.icon} </span>
                      {p.shortTitle ?? p.title}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : null}
      </motion.aside>
    </AnimatePresence>
  );
}
