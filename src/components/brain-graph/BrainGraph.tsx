"use client";

/**
 * The Soft Lab brain map.
 *
 * Three-level hierarchy, enforced visually:
 *   1. Rafia — the large central anchor.
 *   2. Seven pastel category bubbles at hand-placed positions (no physics).
 *   3. Project note cards — revealed elsewhere (CategoryFocusPanel), never
 *      as bubbles on this map.
 *
 * Cross-category relationships appear only temporarily: hovering or
 * selecting a project draws thin curved lines from its primary category
 * to its secondary categories, and fades unrelated worlds.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categories, categoryMap } from "@/content/categories";
import { countProjectsForCategory, getProject } from "@/content/project-index";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useContainerSize } from "@/hooks/useContainerSize";
import { quickTransition, softTransition } from "@/lib/motion";
import type { Category, CategoryId } from "@/types/content";

type Point = { x: number; y: number };

function toPixels(
  pos: { x: number; y: number },
  size: { width: number; height: number },
): Point {
  return { x: (pos.x / 100) * size.width, y: (pos.y / 100) * size.height };
}

/** A gentle quadratic curve between two points, bowed toward the centre. */
function curvedPath(a: Point, b: Point, center: Point, bow = 0.18): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const cx = mx + (center.x - mx) * bow;
  const cy = my + (center.y - my) * bow;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

type Emphasis = "strong" | "soft" | "dim" | "normal";

function categoryEmphasis(
  cat: Category,
  selectedCategory: CategoryId | null,
  highlight: { primary: CategoryId; secondary: CategoryId[] } | null,
): Emphasis {
  if (highlight) {
    if (cat.id === highlight.primary) return "strong";
    if (highlight.secondary.includes(cat.id)) return "soft";
    return "dim";
  }
  if (selectedCategory) {
    return cat.id === selectedCategory ? "strong" : "dim";
  }
  return "normal";
}

export function BrainGraph() {
  const { ref, size } = useContainerSize<HTMLDivElement>();
  const reduceMotion = useReducedMotion();

  const selectedCategory = useWorkspaceStore((s) => s.selectedCategory);
  const hoveredCategory = useWorkspaceStore((s) => s.hoveredCategory);
  const hoveredProject = useWorkspaceStore((s) => s.hoveredProject);
  const selectedProject = useWorkspaceStore((s) => s.selectedProject);
  const selectCategory = useWorkspaceStore((s) => s.selectCategory);
  const hoverCategory = useWorkspaceStore((s) => s.hoverCategory);

  const ready = size.width > 0 && size.height > 0;
  const center: Point = { x: size.width / 2, y: size.height / 2 };

  // Temporary highlighting driven by the hovered/selected project card.
  const activeProjectId = hoveredProject ?? selectedProject;
  const activeProject = activeProjectId ? getProject(activeProjectId) : undefined;
  const highlight = activeProject
    ? {
        primary: activeProject.primaryCategory,
        secondary: activeProject.secondaryCategories,
      }
    : null;

  const previewCategory =
    hoveredCategory && !selectedCategory ? categoryMap[hoveredCategory] : null;

  return (
    <div
      ref={ref}
      className="relative h-full w-full select-none"
      role="group"
      aria-label="Brain map of Rafia's main worlds"
    >
      {/* Connection layer */}
      {ready && (
        <svg
          className="absolute inset-0 h-full w-full"
          width={size.width}
          height={size.height}
          aria-hidden="true"
        >
          {/* Level 1→2: Rafia to each world (always visible, very soft) */}
          {categories.map((cat) => {
            const p = toPixels(cat.position, size);
            const emphasized =
              highlight?.primary === cat.id || selectedCategory === cat.id;
            const dimmed =
              (highlight && !emphasized && !highlight.secondary.includes(cat.id)) ||
              (selectedCategory && selectedCategory !== cat.id);
            return (
              <path
                key={cat.id}
                d={curvedPath(center, p, center, 0)}
                stroke="var(--line-strong)"
                strokeWidth={emphasized ? 2.2 : 1.2}
                opacity={dimmed ? 0.18 : emphasized ? 0.9 : 0.45}
                fill="none"
                style={{ transition: "opacity 0.25s, stroke-width 0.25s" }}
              />
            );
          })}

          {/* Temporary cross-category curves: primary → each secondary */}
          <AnimatePresence>
            {highlight &&
              highlight.secondary.map((secId) => {
                const a = toPixels(categoryMap[highlight.primary].position, size);
                const b = toPixels(categoryMap[secId].position, size);
                return (
                  <motion.path
                    key={`${highlight.primary}-${secId}`}
                    d={curvedPath(a, b, center, 0.35)}
                    stroke="var(--work-personal)"
                    strokeWidth={1.6}
                    fill="none"
                    initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.75 }}
                    exit={{ opacity: 0 }}
                    transition={softTransition}
                  />
                );
              })}
          </AnimatePresence>
        </svg>
      )}

      {/* Level 2: category bubbles */}
      {categories.map((cat) => {
        const emphasis = categoryEmphasis(cat, selectedCategory, highlight);
        const count = countProjectsForCategory(cat.id);
        return (
          <motion.button
            key={cat.id}
            type="button"
            onClick={() => selectCategory(selectedCategory === cat.id ? null : cat.id)}
            onMouseEnter={() => hoverCategory(cat.id)}
            onMouseLeave={() => hoverCategory(null)}
            onFocus={() => hoverCategory(cat.id)}
            onBlur={() => hoverCategory(null)}
            aria-label={`${cat.label} — ${count} project${count === 1 ? "" : "s"}`}
            aria-pressed={selectedCategory === cat.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1.5 rounded-3xl border px-5 py-3.5 text-center"
            style={{
              left: `${cat.position.x}%`,
              top: `${cat.position.y}%`,
              background: `var(${cat.colorVar})`,
              borderColor: "var(--line)",
              boxShadow:
                emphasis === "strong" ? "var(--shadow-lift)" : "var(--shadow-soft)",
            }}
            animate={{
              opacity: emphasis === "dim" ? 0.35 : 1,
              scale: emphasis === "strong" ? 1.08 : emphasis === "soft" ? 1.03 : 1,
            }}
            whileHover={
              reduceMotion ? undefined : { scale: emphasis === "dim" ? 0.98 : 1.06 }
            }
            transition={quickTransition}
          >
            <span aria-hidden className="text-xl leading-none">
              {cat.icon}
            </span>
            <span className="whitespace-nowrap text-[13px] font-bold text-ink">
              {cat.label}
            </span>
          </motion.button>
        );
      })}

      {/* Level 1: Rafia — the anchor */}
      <motion.div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border text-center"
        style={{
          width: 148,
          height: 148,
          background:
            "radial-gradient(circle at 32% 28%, var(--pink), var(--lilac) 55%, var(--sky))",
          borderColor: "var(--line-strong)",
          boxShadow: "var(--shadow-lift)",
        }}
        animate={{ opacity: selectedCategory || highlight ? 0.85 : 1 }}
        transition={softTransition}
      >
        <span aria-hidden className="text-2xl">
          ✦
        </span>
        <span className="font-serif text-lg font-semibold text-ink-strong">
          Rafia ♡
        </span>
        <span className="font-mono text-[10px] tracking-wider text-muted">
          the soft lab
        </span>
      </motion.div>

      {/* Category hover preview */}
      <AnimatePresence>
        {previewCategory && (
          <motion.div
            key={previewCategory.id}
            role="status"
            className="panel pointer-events-none absolute z-10 w-60 px-4 py-3"
            style={{
              left: `calc(${Math.min(Math.max(previewCategory.position.x, 16), 78)}% )`,
              top: `calc(${previewCategory.position.y}% + 52px)`,
              transform: "translateX(-50%)",
            }}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 6 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 4 },
                })}
            transition={quickTransition}
          >
            <p className="font-serif text-sm font-semibold text-ink">
              {previewCategory.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {previewCategory.description}
            </p>
            <p className="mt-1.5 font-mono text-[10.5px] text-muted">
              {countProjectsForCategory(previewCategory.id)} project
              {countProjectsForCategory(previewCategory.id) === 1 ? "" : "s"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
