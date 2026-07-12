"use client";

/**
 * Rectangular project note card — deliberately different from the round
 * pastel category bubbles. Standard cards are small notes; featured cards
 * are ~15–20% larger with a thicker work-type accent and a star.
 *
 * Badge budget (enforced here, per the design spec): one Featured marker,
 * one work-type badge, one status badge, at most two category labels, one
 * summary line. Everything else lives in the right panel and case study.
 */
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { PortfolioProject } from "@/types/content";
import { categoryMap } from "@/content/categories";
import { workTypeStyles } from "@/config/workTypes";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useWindowStore } from "@/stores/windowStore";
import { FeaturedBadge, StatusBadge, WorkTypeBadge } from "@/components/ui/Badge";
import { cardReveal, quickTransition } from "@/lib/motion";

export function ProjectCard({
  project,
  index = 0,
}: {
  project: PortfolioProject;
  index?: number;
}) {
  const reduceMotion = useReducedMotion();
  const hoverProject = useWorkspaceStore((s) => s.hoverProject);
  const selectProject = useWorkspaceStore((s) => s.selectProject);
  const markExplored = useWorkspaceStore((s) => s.markExplored);
  const openWindow = useWindowStore((s) => s.openWindow);

  const accent = workTypeStyles[project.workType].accent;
  const featured = project.featured;
  const thumbnail = project.gallery[0];

  const categoryLabels = [
    categoryMap[project.primaryCategory].shortLabel ??
      categoryMap[project.primaryCategory].label,
    ...(project.secondaryCategories.length > 0
      ? [
          categoryMap[project.secondaryCategories[0]].shortLabel ??
            categoryMap[project.secondaryCategories[0]].label,
        ]
      : []),
  ];

  function handleOpen(e: React.MouseEvent | React.KeyboardEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    selectProject(project.id);
    markExplored(project.id);
    openWindow(project.id, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  return (
    <motion.button
      type="button"
      onClick={handleOpen}
      onMouseEnter={() => hoverProject(project.id)}
      onMouseLeave={() => hoverProject(null)}
      onFocus={() => hoverProject(project.id)}
      onBlur={() => hoverProject(null)}
      aria-label={`Open ${project.title} case study`}
      className={`group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-line bg-surface-2 text-left ${
        featured ? "p-4" : "p-3"
      }`}
      style={{
        boxShadow: featured ? "var(--shadow-lift)" : "var(--shadow-soft)",
        borderLeft: `${featured ? 5 : 3}px solid ${accent}`,
      }}
      {...(reduceMotion
        ? {}
        : {
            initial: cardReveal.initial,
            animate: cardReveal.animate,
            exit: cardReveal.exit,
          })}
      transition={{ ...quickTransition, delay: reduceMotion ? 0 : index * 0.045 }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
    >
      <div className="flex items-start gap-2.5">
        {featured && thumbnail ? (
          <span className="relative block h-12 w-16 shrink-0 overflow-hidden rounded-md border border-line">
            <Image
              src={thumbnail.src}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
        ) : (
          <span aria-hidden className="mt-0.5 text-lg leading-none">
            {project.icon}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span
              className={`truncate font-serif font-semibold text-ink ${
                featured ? "text-[15px]" : "text-[13.5px]"
              }`}
            >
              {project.shortTitle ?? project.title}
            </span>
            <span
              aria-hidden
              className="ml-auto shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              ↗
            </span>
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted">
            {categoryLabels.join(" · ")}
          </span>
        </span>
      </div>

      <span
        className={`mt-2 block text-xs leading-snug text-muted ${featured ? "text-[12.5px]" : ""}`}
      >
        {project.cardLine}
      </span>

      <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {featured && <FeaturedBadge />}
        <WorkTypeBadge project={project} />
        <StatusBadge project={project} />
      </span>
    </motion.button>
  );
}
