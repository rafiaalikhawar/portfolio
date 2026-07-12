import type { PortfolioProject } from "@/types/content";

/** FABS Rental — marketing engagement for a Houston weekly car-rental business. */
export const fabsRental: PortfolioProject = {
  id: "fabs-rental",
  slug: "fabs-rental",
  title: "FABS Rental Marketing",
  shortTitle: "FABS Rental",
  icon: "🚗",
  summary:
    "Content strategy, positioning, reporting, scripts, and visual experimentation for a Houston-based weekly car-rental business serving gig workers and temporary renters.",
  cardLine: "Content strategy for a weekly car-rental brand",
  introduction:
    "FABS Rental rents cars by the week to gig workers and people in temporary situations. The marketing challenge: earn trust in a market full of cheap-sounding offers, without ever sounding cheap yourself.",

  primaryCategory: "marketing",
  secondaryCategories: ["business"],
  tags: [
    "Content Strategy",
    "Reporting",
    "AI Visual Experiments",
    "Brand Positioning",
    "Reels",
    "Scripts",
  ],

  status: "in-progress",
  workType: "client-work",
  featured: true,

  role: "Content strategy, positioning, reporting, scriptwriting, and visual experimentation.",
  audience: "Gig workers and temporary renters in Houston.",

  graph: {
    relatedProjects: ["hostelwalla"],
    cardOrder: 1,
  },

  caseStudy: {
    problem:
      "Weekly car rental for gig workers is a trust business. The audience has been burned by hidden fees and pushy ads, so generic sales-y content actively works against the brand.",
    strategy: [
      {
        heading: "Position around trust and flexibility",
        body: "The messaging leads with what the audience actually weighs: trust, flexibility, and earning potential. A rented car is a work tool — the content treats it that way.",
      },
      {
        heading: "Avoid the cheap-rental trap",
        body: "Deliberately avoiding cheap or overly sales-focused messaging. The brand voice stays plain, confident, and specific instead of shouting discounts.",
      },
      {
        heading: "Make AI visuals look real",
        body: "Ongoing experiments in making AI-generated visuals look more realistic and on-brand, so generated content supports trust instead of undermining it.",
      },
    ],
    process: [
      {
        title: "Positioning",
        description:
          "Defined what the brand should sound like — and, just as firmly, what it should never sound like.",
      },
      {
        title: "Content & scripts",
        description:
          "Content strategy, scripts, and reels built around trust, flexibility, and earning potential.",
      },
      {
        title: "Visual experimentation",
        description:
          "Iterating on AI-generated visuals until they pass as realistic, consistent brand imagery.",
      },
      {
        title: "Reporting",
        description:
          "Regular reporting so decisions about content are made from evidence, not vibes.",
      },
    ],
    decisions: [
      "Trust-first messaging over discount-first messaging.",
      "Reels and scripts written for gig workers' actual decision moments.",
      "Treat AI visuals as an experiment with a quality bar, not a shortcut.",
    ],
    tools: [
      "Content strategy",
      "Scriptwriting",
      "Reels",
      "AI visual tools",
      "Reporting",
    ],
    learnings: [
      "A good product still needs a good story — and the story has to match how the audience already talks.",
      "AI-generated visuals earn their place only when they stop looking AI-generated.",
    ],
  },

  gallery: [
    {
      src: "/projects/fabs-rental/hero.svg",
      alt: "FABS Rental marketing hero placeholder",
      caption: "FABS Rental — brand positioning board (placeholder frame)",
      kind: "branding",
      placeholder: true,
      width: 1600,
      height: 1000,
    },
    {
      src: "/projects/fabs-rental/reel-01.svg",
      alt: "FABS Rental reel placeholder frame",
      caption: "Reel concept frame, portrait format (placeholder)",
      kind: "marketing",
      placeholder: true,
      width: 1080,
      height: 1920,
    },
    {
      src: "/projects/fabs-rental/content-map.svg",
      alt: "FABS Rental content strategy map placeholder",
      caption:
        "Content strategy map — trust, flexibility, earning potential (process sketch)",
      kind: "process",
      placeholder: true,
      width: 1600,
      height: 900,
    },
  ],
};
