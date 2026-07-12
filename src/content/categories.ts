/**
 * The seven main worlds of The Soft Lab brain map, plus their fixed,
 * hand-placed positions. Positions are percentages of the graph canvas —
 * no physics, no drift.
 */
import type { Category, CategoryId } from "@/types/content";

export const categories: Category[] = [
  {
    id: "ai-engineering",
    label: "AI & Engineering",
    shortLabel: "AI & Eng",
    icon: "✨",
    description:
      "Data pipelines, knowledge graphs, LLM products, and software that holds up under real use.",
    colorVar: "--cat-ai",
    position: { x: 50, y: 12 },
  },
  {
    id: "research",
    label: "Research",
    icon: "📖",
    description:
      "Literature mapping, methodology, evidence tracking, and questions worth sitting with.",
    colorVar: "--cat-research",
    position: { x: 81, y: 26 },
  },
  {
    id: "product",
    label: "Product & UI/UX",
    shortLabel: "Product",
    icon: "🔷",
    description:
      "Designing and building products around real users — screens, journeys, and decisions.",
    colorVar: "--cat-product",
    position: { x: 88, y: 60 },
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "🌸",
    description: "Strategy, content, campaigns, reporting, and visual storytelling.",
    colorVar: "--cat-marketing",
    position: { x: 66, y: 88 },
  },
  {
    id: "business",
    label: "Business",
    icon: "💼",
    description:
      "Systems, workflows, and analysis that keep small operations honest and running.",
    colorVar: "--cat-business",
    position: { x: 34, y: 88 },
  },
  {
    id: "games",
    label: "Games & Play",
    shortLabel: "Games",
    icon: "🎮",
    description:
      "Game systems, university builds, and the joy of making things that are fun on purpose.",
    colorVar: "--cat-games",
    position: { x: 12, y: 60 },
  },
  {
    id: "social-impact",
    label: "Social Impact",
    icon: "🌍",
    description:
      "Technology pointed at public health, climate, and civic problems that actually matter.",
    colorVar: "--cat-social",
    position: { x: 19, y: 26 },
  },
];

export const categoryMap: Record<CategoryId, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export function getCategory(id: CategoryId): Category {
  return categoryMap[id];
}
