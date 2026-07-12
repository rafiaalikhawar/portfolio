import type { PortfolioProject } from "@/types/content";

/**
 * FUTERA — university football league management project.
 * Exact technology and individual contribution are not yet confirmed;
 * placeholders are used deliberately. Do not invent them.
 */
export const futera: PortfolioProject = {
  id: "futera",
  slug: "futera",
  title: "FUTERA Football League System",
  shortTitle: "FUTERA",
  icon: "⚽",
  summary: "A football league management project built during university.",
  cardLine: "Football league management system",
  introduction:
    "FUTERA is a football league management project built as a university team project — fixtures, teams, and the systems that keep a league running. Full technical write-up is in progress.",

  primaryCategory: "games",
  secondaryCategories: [],
  tags: ["Software", "Team Project", "University", "Football", "Game Systems"],

  status: "completed",
  workType: "university-project",
  featured: true,
  collaborationType: "team",

  role: "Details being added — exact contribution to be confirmed.",

  graph: {
    relatedProjects: ["uni-game-experiments"],
    cardOrder: 1,
  },

  caseStudy: {
    problem:
      "Running a football league is a systems problem: teams, fixtures, results, and standings all have to stay consistent as the season unfolds.",
    gameplay: [
      {
        heading: "League systems",
        body: "The project models the moving parts of a football league — the structure that turns individual matches into a season. Detailed mechanics write-up being added.",
      },
    ],
    tools: ["Details being added — exact technology to be confirmed."],
    learnings: [
      "Team software projects live or die on shared understanding of the data model.",
      "Case study in progress — technical challenges and team contribution to be added.",
    ],
  },

  gallery: [
    {
      src: "/projects/futera/hero.svg",
      alt: "FUTERA football league system hero placeholder",
      caption: "FUTERA — football league management (placeholder frame)",
      kind: "gameplay",
      placeholder: true,
      width: 1920,
      height: 1080,
    },
    {
      src: "/projects/futera/screen-01.svg",
      alt: "FUTERA league screen placeholder",
      caption: "League systems screen (placeholder frame)",
      kind: "gameplay",
      placeholder: true,
      width: 1920,
      height: 1080,
    },
  ],
};
