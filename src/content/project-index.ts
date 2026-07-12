/**
 * The single registry of every project in the portfolio.
 *
 * ── ADDING A PROJECT ────────────────────────────────────────────────────
 * 1. Create `src/content/projects/<slug>.ts` (copy an existing file).
 * 2. Import it below and add it to `allProjects`.
 * That's it. The graph, category views, search, image gallery, sidebar,
 * dock, related projects, and tours all derive from this list — no
 * component edits needed. Validation runs at module load, so bad content
 * fails immediately in development.
 */
import { validateProject } from "@/lib/schema";
import type { CategoryId, PortfolioProject } from "@/types/content";

import { hostelwalla } from "./projects/hostelwalla";
import { weatherKg } from "./projects/weather-kg";
import { fabsRental } from "./projects/fabs-rental";
import { climateHealth } from "./projects/climate-health";
import { civicInnovation } from "./projects/civic-innovation";
import { futera } from "./projects/futera";
import { pookieEnterprises } from "./projects/pookie-enterprises";
import { chronoRift, sonicGame, marioGame, uniGameExperiments } from "./projects/games";

export const allProjects: PortfolioProject[] = [
  hostelwalla,
  pookieEnterprises,
  weatherKg,
  fabsRental,
  climateHealth,
  civicInnovation,
  futera,
  chronoRift,
  sonicGame,
  marioGame,
  uniGameExperiments,
].map(validateProject);

export const projectMap: Record<string, PortfolioProject> = Object.fromEntries(
  allProjects.map((p) => [p.id, p]),
);

export function getProject(id: string): PortfolioProject | undefined {
  return projectMap[id];
}

/** Projects whose primary home is the given category, featured first. */
export function projectsForCategory(categoryId: CategoryId): PortfolioProject[] {
  return allProjects
    .filter((p) => p.primaryCategory === categoryId)
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        (a.graph.cardOrder ?? 99) - (b.graph.cardOrder ?? 99),
    );
}

/** Projects connected to a category as a secondary world. */
export function secondaryProjectsForCategory(
  categoryId: CategoryId,
): PortfolioProject[] {
  return allProjects.filter((p) => p.secondaryCategories.includes(categoryId));
}

export function featuredProjects(): PortfolioProject[] {
  return allProjects
    .filter((p) => p.featured)
    .sort((a, b) => (a.graph.cardOrder ?? 99) - (b.graph.cardOrder ?? 99));
}

export function currentlyBuildingProjects(): PortfolioProject[] {
  return allProjects.filter((p) => p.activelyBuilding || p.status === "in-progress");
}

export function relatedProjects(project: PortfolioProject): PortfolioProject[] {
  const explicit = (project.graph.relatedProjects ?? [])
    .map((id) => projectMap[id])
    .filter((p): p is PortfolioProject => Boolean(p));
  if (explicit.length > 0) return explicit;
  // Fall back to shared-category neighbours so the panel is never empty.
  return allProjects
    .filter((p) => p.id !== project.id && p.primaryCategory === project.primaryCategory)
    .slice(0, 3);
}

export function countProjectsForCategory(categoryId: CategoryId): number {
  return allProjects.filter((p) => p.primaryCategory === categoryId).length;
}
