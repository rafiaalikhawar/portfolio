/**
 * The Soft Lab's local search engine.
 *
 * Built on MiniSearch: fuzzy matching for minor misspellings, prefix
 * matching for partial queries, and field boosting so titles outrank
 * buried case-study text. Documents are derived from the project index —
 * add a project to `project-index.ts` and it is searchable immediately.
 */
import MiniSearch from "minisearch";
import { allProjects } from "@/content/project-index";
import { categoryMap } from "@/content/categories";
import { workTypeStyles, statusLabels } from "@/config/workTypes";
import type { CategoryId, GalleryItem, PortfolioProject } from "@/types/content";

export type SearchDocType = "project" | "image";

export type SearchDoc = {
  id: string;
  type: SearchDocType;
  projectId: string;
  title: string;
  summary: string;
  tags: string;
  categories: string;
  body: string;
  /** For image docs. */
  imageSrc?: string;
  imageIndex?: number;
};

export type SearchFilter =
  "all" | "projects" | "images" | "research" | "designs" | "marketing" | "games";

export const SEARCH_FILTERS: { id: SearchFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "projects", label: "Projects" },
  { id: "images", label: "Images" },
  { id: "research", label: "Research" },
  { id: "designs", label: "Designs" },
  { id: "marketing", label: "Marketing" },
  { id: "games", label: "Games" },
];

const filterCategoryMap: Partial<Record<SearchFilter, CategoryId>> = {
  research: "research",
  designs: "product",
  marketing: "marketing",
  games: "games",
};

function caseStudyText(p: PortfolioProject): string {
  const cs = p.caseStudy;
  return [
    p.introduction,
    cs.problem,
    cs.importance,
    ...(cs.constraints ?? []),
    ...(cs.process ?? []).map((s) => `${s.title} ${s.description}`),
    ...(cs.decisions ?? []),
    ...(cs.tools ?? []),
    ...(cs.architecture ?? []).map((b) => `${b.heading ?? ""} ${b.body}`),
    ...(cs.methodology ?? []).map((b) => `${b.heading ?? ""} ${b.body}`),
    ...(cs.strategy ?? []).map((b) => `${b.heading ?? ""} ${b.body}`),
    ...(cs.gameplay ?? []).map((b) => `${b.heading ?? ""} ${b.body}`),
    ...(cs.results ?? []).map((r) => `${r.statement} ${r.detail ?? ""}`),
    ...(cs.failures ?? []),
    ...(cs.learnings ?? []),
    ...(cs.nextSteps ?? []),
    p.role,
    p.audience,
    workTypeStyles[p.workType].label,
    statusLabels[p.status],
    p.activelyBuilding ? "currently building" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function categoryLabels(p: PortfolioProject): string {
  return [p.primaryCategory, ...p.secondaryCategories]
    .map((id) => categoryMap[id].label)
    .join(" ");
}

export function buildSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const p of allProjects) {
    docs.push({
      id: `project:${p.id}`,
      type: "project",
      projectId: p.id,
      title: p.title,
      summary: p.summary,
      tags: p.tags.join(" "),
      categories: categoryLabels(p),
      body: caseStudyText(p),
    });
    p.gallery.forEach((g: GalleryItem, i: number) => {
      docs.push({
        id: `image:${p.id}:${i}`,
        type: "image",
        projectId: p.id,
        title: g.caption,
        summary: g.alt,
        tags: `${g.kind} ${p.tags.join(" ")}`,
        categories: categoryLabels(p),
        body: p.title,
        imageSrc: g.src,
        imageIndex: i,
      });
    });
  }
  return docs;
}

export type SearchResult = SearchDoc & {
  score: number;
  matchedTerms: string[];
};

let cachedIndex: MiniSearch<SearchDoc> | null = null;
let cachedDocs: Map<string, SearchDoc> | null = null;

export function getSearchIndex(): {
  index: MiniSearch<SearchDoc>;
  docs: Map<string, SearchDoc>;
} {
  if (!cachedIndex || !cachedDocs) {
    const docs = buildSearchDocs();
    cachedDocs = new Map(docs.map((d) => [d.id, d]));
    cachedIndex = new MiniSearch<SearchDoc>({
      fields: ["title", "summary", "tags", "categories", "body"],
      storeFields: ["type", "projectId"],
      searchOptions: {
        boost: { title: 4, tags: 3, summary: 2, categories: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    });
    cachedIndex.addAll(docs);
  }
  return { index: cachedIndex, docs: cachedDocs };
}

export function searchPortfolio(
  query: string,
  filter: SearchFilter = "all",
): SearchResult[] {
  const q = query.trim();
  if (!q) return [];
  const { index, docs } = getSearchIndex();
  const raw = index.search(q);

  const results: SearchResult[] = [];
  for (const hit of raw) {
    const doc = docs.get(String(hit.id));
    if (!doc) continue;
    if (filter === "projects" && doc.type !== "project") continue;
    if (filter === "images" && doc.type !== "image") continue;
    const filterCat = filterCategoryMap[filter];
    if (filterCat) {
      const project = allProjects.find((p) => p.id === doc.projectId);
      if (!project) continue;
      const inCategory =
        project.primaryCategory === filterCat ||
        project.secondaryCategories.includes(filterCat);
      if (!inCategory) continue;
    }
    results.push({
      ...doc,
      score: hit.score,
      matchedTerms: Object.keys(hit.match),
    });
  }
  return results;
}

export const suggestedSearches = [
  "AI",
  "Healthcare",
  "Marketing",
  "Knowledge Graphs",
  "UI Design",
  "Games",
  "Climate",
  "Student Housing",
  "Python",
  "Research",
];

/** Wrap matched terms in <mark> boundaries for highlighting. */
export function highlightMatches(text: string, terms: string[]): string[] {
  if (terms.length === 0) return [text];
  const escaped = terms
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return [text];
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(regex);
}

export function isHighlightedPart(part: string, terms: string[]): boolean {
  return terms.some((t) => part.toLowerCase() === t.toLowerCase());
}
