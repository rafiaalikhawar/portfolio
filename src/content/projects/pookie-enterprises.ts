import type { PortfolioProject } from "@/types/content";

/**
 * Pookie Enterprises — featured founded venture.
 *
 * ⚠️ PLACEHOLDER PROJECT: final details have not been supplied yet.
 * The primary/secondary categories below are a provisional slot so the
 * project can appear in the workspace — CHANGE `primaryCategory` when the
 * real details arrive. Description, role, results, and links are
 * intentionally left as "details being added" and must not be invented.
 */
export const pookieEnterprises: PortfolioProject = {
  id: "pookie-enterprises",
  slug: "pookie-enterprises",
  title: "Pookie Enterprises",
  icon: "🌷",
  summary: "Project details being added.",
  cardLine: "Case study in progress",
  introduction:
    "Pookie Enterprises is one of Rafia's founded ventures. Its full case study is in progress — details, categories, and links are being added.",

  // PROVISIONAL — configurable until final project details are supplied.
  primaryCategory: "business",
  secondaryCategories: [],
  tags: [],

  status: "in-progress",
  workType: "founded-venture",
  featured: true,
  foundedByRafia: true,

  graph: {
    relatedProjects: ["hostelwalla"],
    cardOrder: 2,
  },

  caseStudy: {
    learnings: ["Case study in progress — details being added."],
  },

  gallery: [
    {
      src: "/projects/pookie-enterprises/hero.svg",
      alt: "Pookie Enterprises placeholder frame",
      caption: "Pookie Enterprises — case study in progress",
      kind: "branding",
      placeholder: true,
      width: 1600,
      height: 1000,
    },
  ],
};
