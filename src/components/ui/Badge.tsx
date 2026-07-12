"use client";

import type { PortfolioProject } from "@/types/content";
import { statusLabels, workTypeStyles } from "@/config/workTypes";

/** Small pill badge; colours come from design tokens, never hardcoded. */
export function Badge({
  children,
  accent,
  title,
}: {
  children: React.ReactNode;
  accent?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-3 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide text-muted"
      style={
        accent
          ? {
              borderColor: `color-mix(in srgb, ${accent} 55%, transparent)`,
              color: `color-mix(in srgb, ${accent} 70%, var(--ink))`,
              background: `color-mix(in srgb, ${accent} 12%, var(--surface-2))`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}

/** The single work-type badge a card is allowed to show. */
export function WorkTypeBadge({ project }: { project: PortfolioProject }) {
  const style = workTypeStyles[project.workType];
  return <Badge accent={style.accent}>{style.label}</Badge>;
}

/** Status badge; actively-building projects get the little pulse dot. */
export function StatusBadge({ project }: { project: PortfolioProject }) {
  if (project.activelyBuilding) {
    return (
      <Badge accent="var(--work-founded)" title="Actively being built">
        <span
          aria-hidden
          className="pulse-dot inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--work-founded)" }}
        />
        Currently building
      </Badge>
    );
  }
  return <Badge>{statusLabels[project.status]}</Badge>;
}

export function FeaturedBadge() {
  return (
    <Badge accent="var(--work-client)" title="Featured project">
      ★ Featured
    </Badge>
  );
}
