import type { PortfolioProject } from "@/types/content";

/**
 * AI for Civic Innovation Hackathon.
 * The product name and several details are intentionally unnamed — they will
 * be added when confirmed. Do not invent them.
 */
export const civicInnovation: PortfolioProject = {
  id: "civic-innovation",
  slug: "civic-innovation",
  title: "AI for Civic Innovation Hackathon",
  shortTitle: "Civic Innovation",
  icon: "🏛️",
  summary:
    "A live civic-technology product built under hackathon pressure, including a practical fallback when model calls failed.",
  cardLine: "Civic-tech product built under hackathon pressure",
  introduction:
    "Hackathon demos usually die the moment the model API hiccups. This one didn't — the build included a functional fallback path, so the product kept working live even when model calls failed. Product name and full write-up are being added.",

  primaryCategory: "ai-engineering",
  secondaryCategories: ["social-impact"],
  tags: ["Civic Technology", "LLM", "Hackathon", "Reliability", "Deployment"],

  status: "completed",
  workType: "hackathon-project",
  featured: true,
  collaborationType: "team",

  graph: {
    relatedProjects: ["weather-kg", "climate-health"],
    cardOrder: 2,
  },

  caseStudy: {
    problem:
      "Civic-technology ideas often stall at the demo stage: they depend on model calls that fail exactly when people are watching. The challenge was to ship something live, useful, and resilient within hackathon time.",
    decisions: [
      "Deploy a real, live product rather than a slide-deck prototype.",
      "Build functional fallback logic so the product degrades gracefully when LLM calls fail.",
    ],
    results: [
      { statement: "Live deployed product." },
      { statement: "Functional fallback logic when model calls failed." },
      {
        statement: "Top-5 national recognition.",
        detail: "As reported by the portfolio owner.",
      },
    ],
    learnings: [
      "Reliability is a feature — the fallback path was what made the demo credible.",
      "Details being added: product name, team contributions, and links.",
    ],
  },

  gallery: [
    {
      src: "/projects/civic-innovation/hero.svg",
      alt: "Civic innovation hackathon hero placeholder",
      caption: "AI for Civic Innovation — live product frame (details being added)",
      kind: "ui",
      placeholder: true,
      width: 1600,
      height: 1000,
    },
    {
      src: "/projects/civic-innovation/fallback.svg",
      alt: "Fallback logic diagram placeholder",
      caption: "Fallback path when model calls fail (architecture sketch)",
      kind: "architecture",
      placeholder: true,
      width: 1600,
      height: 900,
    },
  ],
};
