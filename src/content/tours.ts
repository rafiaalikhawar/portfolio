/**
 * Guided tours — curated paths through the brain for visitors who would
 * rather be shown around. Steps reference project ids from the project
 * index; a step whose project is missing is skipped automatically, so
 * tours never break when content changes.
 */

export type TourStep = {
  projectId: string;
  why: string;
};

export type Tour = {
  id: string;
  label: string;
  icon: string;
  intro: string;
  steps: TourStep[];
};

export const tours: Tour[] = [
  {
    id: "ai",
    label: "I’m hiring for AI or software",
    icon: "✨",
    intro:
      "The engineering work — pipelines, reliability, and products that survive contact with real data.",
    steps: [
      {
        projectId: "weather-kg",
        why: "The clearest engineering evidence: a full pipeline — collect, cache, normalise, validate, detect — over 40,000+ daily records across 22 locations, with automated tests and a CLI workflow.",
      },
      {
        projectId: "civic-innovation",
        why: "Shipping under pressure: a live civic-tech product with working fallback logic for when model calls failed.",
      },
      {
        projectId: "climate-health",
        why: "Where the AI work is heading: multimodal data for explainable district-level risk understanding.",
      },
      {
        projectId: "hostelwalla",
        why: "Engineering in product form — a live platform she designs, builds, and ships herself.",
      },
    ],
  },
  {
    id: "research",
    label: "I’m exploring her research",
    icon: "📖",
    intro:
      "Methodical, evidence-tracked research on climate, health, and risk in Pakistan.",
    steps: [
      {
        projectId: "climate-health",
        why: "The core research: 48 organised papers, deduplicated sources, method mapping, and live evidence & gap tracking.",
      },
      {
        projectId: "weather-kg",
        why: "The data foundation the research can stand on — validated weather history and event detection.",
      },
      {
        projectId: "civic-innovation",
        why: "Research instincts applied under pressure: reliability thinking in a live civic product.",
      },
    ],
  },
  {
    id: "marketing",
    label: "I’m looking for marketing work",
    icon: "🌸",
    intro:
      "Strategy, positioning, reporting, and visual experiments that treat marketing as a system.",
    steps: [
      {
        projectId: "fabs-rental",
        why: "Full-stack marketing: positioning around trust and flexibility, scripts, reels, reporting, and AI-visual experiments for a real business.",
      },
      {
        projectId: "hostelwalla",
        why: "Marketing from the founder's seat — brand direction and launch planning for her own product.",
      },
    ],
  },
  {
    id: "product",
    label: "I’m interested in product and design",
    icon: "🔷",
    intro:
      "Products designed around real users — and the decisions behind the screens.",
    steps: [
      {
        projectId: "hostelwalla",
        why: "The flagship: a student-first housing platform, live on the web, designed around honest comparison.",
      },
      {
        projectId: "fabs-rental",
        why: "Why a good product still needs a good story — positioning and content as part of the product.",
      },
    ],
  },
  {
    id: "games",
    label: "Show me the games",
    icon: "🎮",
    intro:
      "Game systems and university builds — making things that are fun on purpose.",
    steps: [
      {
        projectId: "futera",
        why: "A football league management system built with a team at university.",
      },
      {
        projectId: "chrono-rift",
        why: "Chrono Rift — one of the game builds (write-up in progress).",
      },
      {
        projectId: "sonic-game",
        why: "A Sonic-style build from the game experiments collection.",
      },
    ],
  },
  {
    id: "curious",
    label: "I’m just curious",
    icon: "☁️",
    intro: "A wander through the whole brain — one stop in each world.",
    steps: [
      {
        projectId: "hostelwalla",
        why: "Start with what she's building right now: a student housing platform.",
      },
      {
        projectId: "weather-kg",
        why: "Then the engineering side — a weather-data pipeline with 40,000+ records.",
      },
      {
        projectId: "climate-health",
        why: "The research heart: climate, health, and explainable risk in Pakistan.",
      },
      {
        projectId: "fabs-rental",
        why: "The marketing brain — trust-first strategy for a real rental business.",
      },
      {
        projectId: "futera",
        why: "And the playful side: a football league system built at university.",
      },
    ],
  },
];

export const tourMap = Object.fromEntries(tours.map((t) => [t.id, t]));
