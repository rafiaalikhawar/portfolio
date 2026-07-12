/**
 * Core content types for The Soft Lab.
 *
 * Everything the interface renders — graph nodes, project cards, case-study
 * tabs, search results, gallery images — is derived from these types.
 * Projects live in `src/content/projects/` and are validated at module load
 * by the Zod schema in `src/lib/schema.ts`.
 */

export const CATEGORY_IDS = [
  "ai-engineering",
  "research",
  "product",
  "marketing",
  "business",
  "games",
  "social-impact",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const WORK_TYPES = [
  "founded-venture",
  "internship-project",
  "university-project",
  "client-work",
  "personal-project",
  "research-project",
  "hackathon-project",
  "collaborative-project",
  "social-impact-initiative",
] as const;

export type WorkType = (typeof WORK_TYPES)[number];

export const PROJECT_STATUSES = [
  "idea",
  "planning",
  "in-progress",
  "completed",
  "paused",
  "archived",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const GALLERY_KINDS = [
  "ui",
  "mobile",
  "branding",
  "marketing",
  "research",
  "architecture",
  "process",
  "results",
  "gameplay",
] as const;

export type GalleryKind = (typeof GALLERY_KINDS)[number];

export type GalleryItem = {
  /** Path under /public, e.g. "/projects/hostelwalla/hero.svg" */
  src: string;
  alt: string;
  caption: string;
  kind: GalleryKind;
  /** True while the asset is a generated placeholder frame. */
  placeholder?: boolean;
  width: number;
  height: number;
};

export type ContentBlock = {
  heading?: string;
  body: string;
  /** Optional image path rendered alongside the block. */
  image?: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type ResultItem = {
  /** A verified, real outcome. Never invent these. */
  statement: string;
  detail?: string;
};

export type ProjectLinks = {
  live?: string;
  github?: string;
  demo?: string;
  report?: string;
};

export type CaseStudy = {
  problem?: string;
  importance?: string;
  constraints?: string[];
  process?: ProcessStep[];
  decisions?: string[];
  tools?: string[];
  architecture?: ContentBlock[];
  methodology?: ContentBlock[];
  strategy?: ContentBlock[];
  gameplay?: ContentBlock[];
  results?: ResultItem[];
  failures?: string[];
  learnings?: string[];
  nextSteps?: string[];
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  /** Emoji used on cards, tabs, and the dock. */
  icon: string;
  summary: string;
  /** One line for the collapsed note card. */
  cardLine: string;
  introduction?: string;

  primaryCategory: CategoryId;
  secondaryCategories: CategoryId[];
  tags: string[];

  status: ProjectStatus;
  /** Shows the "Currently building" badge with the little pulse dot. */
  activelyBuilding?: boolean;

  workType: WorkType;
  featured: boolean;
  foundedByRafia?: boolean;
  collaborationType?: "solo" | "team" | "co-founded";

  role?: string;
  timeline?: string;
  audience?: string;
  collaborators?: string[];

  graph: {
    relatedProjects?: string[];
    cardOrder?: number;
  };

  caseStudy: CaseStudy;
  gallery: GalleryItem[];
  links?: ProjectLinks;
};

export type Category = {
  id: CategoryId;
  label: string;
  shortLabel?: string;
  icon: string;
  description: string;
  /** CSS custom property name carrying the category pastel, e.g. "--cat-ai". */
  colorVar: string;
  /** Position on the brain map as percentages of the graph canvas. */
  position: { x: number; y: number };
};
