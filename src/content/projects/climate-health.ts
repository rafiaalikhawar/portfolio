import type { PortfolioProject } from "@/types/content";

/**
 * Climate & Health Research.
 * Evidence listed in results is the verified progress supplied by Rafia.
 */
export const climateHealth: PortfolioProject = {
  id: "climate-health",
  slug: "climate-health",
  title: "Climate & Health Research",
  icon: "🌡️",
  summary:
    "Researching how multimodal climate, health, disaster, and media data can support explainable district-level risk understanding in Pakistan.",
  cardLine: "District-level climate–health risk research",
  introduction:
    "Pakistan's districts face overlapping climate and health risks, but the data that could explain those risks lives in silos — climate records, health reporting, disaster logs, and news media. This research asks how those sources can be combined into risk understanding that is explainable, not just predictive.",

  primaryCategory: "research",
  secondaryCategories: ["ai-engineering", "social-impact"],
  tags: [
    "Healthcare",
    "Climate",
    "Public Health",
    "NLP",
    "Knowledge Graphs",
    "Pakistan",
    "Literature Review",
  ],

  status: "in-progress",
  activelyBuilding: true,

  workType: "research-project",
  featured: true,
  collaborationType: "solo",

  role: "Research design, literature organisation, method mapping, and evidence tracking.",

  graph: {
    relatedProjects: ["weather-kg", "civic-innovation"],
    cardOrder: 1,
  },

  caseStudy: {
    problem:
      "District-level climate–health risk in Pakistan is poorly understood because the relevant evidence is scattered across climate, health, disaster, and media data — each with different formats, granularity, and reliability.",
    importance:
      "Explainable district-level risk understanding would let public-health decisions be argued from evidence rather than intuition, in a country acutely exposed to climate-driven health shocks.",
    methodology: [
      {
        heading: "Research question",
        body: "How can multimodal climate, health, disaster, and media data support explainable district-level risk understanding in Pakistan?",
      },
      {
        heading: "Literature organisation",
        body: "Systematic organisation of the research literature: collecting, deduplicating sources, and mapping which methods each paper uses.",
      },
      {
        heading: "Evidence & gap tracking",
        body: "Tracking what the literature establishes, what it merely gestures at, and where the genuine gaps are — maintained alongside a priority list of papers for full-text review.",
      },
    ],
    process: [
      {
        title: "Collect & deduplicate",
        description:
          "Gathered the relevant literature and deduplicated overlapping sources into a clean working set.",
      },
      {
        title: "Map methods",
        description:
          "Mapped research methods across the collected papers to see which approaches dominate and which are missing.",
      },
      {
        title: "Prioritise",
        description: "Built a priority full-text reading list from the organised set.",
      },
      {
        title: "Track evidence and gaps",
        description:
          "Ongoing evidence and gap tracking that will shape the eventual study design.",
      },
    ],
    tools: ["Literature review tooling", "NLP", "Knowledge graphs"],
    results: [
      { statement: "48 unique papers organised." },
      { statement: "Source deduplication completed on the working set." },
      { statement: "Research-method mapping across the collected literature." },
      { statement: "Priority full-text reading list established." },
      { statement: "Evidence and gap tracking in place." },
    ],
    nextSteps: [
      "Full-text review of the priority list.",
      "Define the multimodal data-fusion approach the evidence supports.",
    ],
  },

  gallery: [
    {
      src: "/projects/climate-health/hero.svg",
      alt: "Climate and health research hero placeholder",
      caption:
        "Climate & Health Research — multimodal evidence map (placeholder frame)",
      kind: "research",
      placeholder: true,
      width: 1600,
      height: 1000,
    },
    {
      src: "/projects/climate-health/method-map.svg",
      alt: "Research method mapping placeholder diagram",
      caption: "Method mapping across 48 organised papers (process sketch)",
      kind: "process",
      placeholder: true,
      width: 1600,
      height: 900,
    },
    {
      src: "/projects/climate-health/evidence.svg",
      alt: "Evidence and gap tracking placeholder frame",
      caption: "Evidence and gap tracking (research frame)",
      kind: "research",
      placeholder: true,
      width: 1600,
      height: 900,
    },
  ],
};
