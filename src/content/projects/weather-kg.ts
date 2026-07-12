import type { PortfolioProject } from "@/types/content";

/**
 * Weather Intelligence Knowledge Graph.
 * Results listed below are the verified evidence supplied by Rafia — do not
 * add numbers that are not real.
 */
export const weatherKg: PortfolioProject = {
  id: "weather-kg",
  slug: "weather-kg",
  title: "Weather Intelligence Knowledge Graph",
  shortTitle: "Weather Intelligence KG",
  icon: "🌦️",
  summary:
    "A weather-data pipeline that collects, caches, normalises, validates, and detects significant weather events across multiple locations.",
  cardLine: "Weather-data pipeline & event detection",
  introduction:
    "Weather data is messy: different sources, different units, gaps, and quiet errors. This pipeline turns raw multi-location weather feeds into validated, normalised records — and then finds the events that actually matter in them.",

  primaryCategory: "ai-engineering",
  secondaryCategories: ["research"],
  tags: [
    "Data",
    "Knowledge Graphs",
    "Python",
    "Weather",
    "Data Pipelines",
    "Event Detection",
    "CLI",
  ],

  status: "completed", // EDITABLE — set to "in-progress" if work resumes
  workType: "personal-project",
  featured: true,
  collaborationType: "solo",

  role: "Design and implementation of the full pipeline: collection, caching, normalisation, validation, and event detection.",

  graph: {
    relatedProjects: ["climate-health", "civic-innovation"],
    cardOrder: 1,
  },

  caseStudy: {
    problem:
      "Raw weather feeds across many locations arrive inconsistent, duplicated, and occasionally wrong. Before any intelligence can be built on top, the data has to be collected reliably, cached, normalised into one shape, and validated.",
    importance:
      "Clean, validated weather history is the foundation for everything downstream — trend analysis, risk research, and connecting weather to real-world outcomes.",
    process: [
      {
        title: "Collect",
        description:
          "Automated collection of daily weather records across 22 locations in 5 countries.",
      },
      {
        title: "Cache",
        description:
          "Caching layer so repeated runs don't re-fetch what is already known.",
      },
      {
        title: "Normalise",
        description:
          "One consistent record shape across sources, units, and locations.",
      },
      {
        title: "Validate",
        description:
          "Validation rules that catch missing, duplicated, or out-of-range values before they poison the dataset.",
      },
      {
        title: "Detect events",
        description:
          "Detection of significant weather events from the validated history, produced as structured outputs.",
      },
    ],
    decisions: [
      "Build the pipeline as a CLI workflow so every stage is runnable, inspectable, and scriptable.",
      "Validate before analysing — bad records are cheaper to reject than to explain later.",
      "Automated tests around the pipeline stages, because data code fails quietly.",
    ],
    tools: ["Python", "CLI workflow", "Automated tests"],
    results: [
      {
        statement: "More than 40,000 daily weather records processed.",
      },
      {
        statement: "22 locations covered across 5 countries.",
      },
      {
        statement: "Automated tests around pipeline stages.",
      },
      {
        statement: "CLI workflow for collection through event detection.",
      },
      {
        statement: "Event-detection outputs produced from validated history.",
      },
    ],
    learnings: [
      "Normalisation is where data projects are won or lost — every source lies in its own dialect.",
      "A pipeline you can run stage-by-stage from the CLI is a pipeline you can actually debug.",
    ],
    nextSteps: [
      "Extend the validated history into a queryable knowledge graph.",
      "Connect event detection to the climate & health research work.",
    ],
  },

  gallery: [
    {
      src: "/projects/weather-kg/hero.svg",
      alt: "Weather Intelligence Knowledge Graph hero placeholder",
      caption: "Weather Intelligence KG — pipeline overview (placeholder frame)",
      kind: "architecture",
      placeholder: true,
      width: 1600,
      height: 1000,
    },
    {
      src: "/projects/weather-kg/architecture.svg",
      alt: "Pipeline architecture diagram placeholder",
      caption: "Collect → cache → normalise → validate → detect (architecture sketch)",
      kind: "architecture",
      placeholder: true,
      width: 1600,
      height: 900,
    },
    {
      src: "/projects/weather-kg/result.svg",
      alt: "Event detection output placeholder frame",
      caption: "Event-detection outputs over 40,000+ daily records (evidence frame)",
      kind: "results",
      placeholder: true,
      width: 1600,
      height: 900,
    },
  ],
};
