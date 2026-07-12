import type { PortfolioProject } from "@/types/content";

/**
 * The smaller game projects. Details are intentionally thin until real
 * write-ups and captures are added — placeholders say so plainly.
 */

export const chronoRift: PortfolioProject = {
  id: "chrono-rift",
  slug: "chrono-rift",
  title: "Chrono Rift",
  icon: "⏳",
  summary:
    "A game project — full description, mechanics, and captures are being added.",
  cardLine: "Game project · details being added",

  primaryCategory: "games",
  secondaryCategories: [],
  tags: ["Game Systems", "University"],

  status: "completed",
  workType: "university-project",
  featured: false,

  graph: { relatedProjects: ["sonic-game", "mario-game"], cardOrder: 2 },

  caseStudy: {
    learnings: ["Case study in progress — gameplay and development notes to come."],
  },

  gallery: [
    {
      src: "/projects/chrono-rift/hero.svg",
      alt: "Chrono Rift placeholder frame",
      caption: "Chrono Rift (gameplay captures being added)",
      kind: "gameplay",
      placeholder: true,
      width: 1920,
      height: 1080,
    },
  ],
};

export const sonicGame: PortfolioProject = {
  id: "sonic-game",
  slug: "sonic-game",
  title: "Sonic Game",
  icon: "🦔",
  summary: "A Sonic-style game build — full description and captures are being added.",
  cardLine: "Game build · details being added",

  primaryCategory: "games",
  secondaryCategories: [],
  tags: ["Game Systems", "University"],

  status: "completed",
  workType: "university-project",
  featured: false,

  graph: { relatedProjects: ["mario-game", "chrono-rift"], cardOrder: 3 },

  caseStudy: {
    learnings: ["Case study in progress — gameplay and development notes to come."],
  },

  gallery: [
    {
      src: "/projects/sonic-game/hero.svg",
      alt: "Sonic game placeholder frame",
      caption: "Sonic Game (gameplay captures being added)",
      kind: "gameplay",
      placeholder: true,
      width: 1920,
      height: 1080,
    },
  ],
};

export const marioGame: PortfolioProject = {
  id: "mario-game",
  slug: "mario-game",
  title: "Mario Game",
  icon: "🍄",
  summary: "A Mario-style game build — full description and captures are being added.",
  cardLine: "Game build · details being added",

  primaryCategory: "games",
  secondaryCategories: [],
  tags: ["Game Systems", "University"],

  status: "completed",
  workType: "university-project",
  featured: false,

  graph: { relatedProjects: ["sonic-game", "chrono-rift"], cardOrder: 4 },

  caseStudy: {
    learnings: ["Case study in progress — gameplay and development notes to come."],
  },

  gallery: [
    {
      src: "/projects/mario-game/hero.svg",
      alt: "Mario game placeholder frame",
      caption: "Mario Game (gameplay captures being added)",
      kind: "gameplay",
      placeholder: true,
      width: 1920,
      height: 1080,
    },
  ],
};

export const uniGameExperiments: PortfolioProject = {
  id: "uni-game-experiments",
  slug: "uni-game-experiments",
  title: "University Game Experiments",
  shortTitle: "Game Experiments",
  icon: "🕹️",
  summary:
    "A collection of smaller game experiments from university — being catalogued.",
  cardLine: "Small game experiments · being catalogued",

  primaryCategory: "games",
  secondaryCategories: [],
  tags: ["Game Systems", "University", "Experiments"],

  status: "archived",
  workType: "university-project",
  featured: false,

  graph: { relatedProjects: ["futera"], cardOrder: 5 },

  caseStudy: {
    learnings: ["Being catalogued — individual experiments will be listed here."],
  },

  gallery: [
    {
      src: "/projects/uni-game-experiments/hero.svg",
      alt: "University game experiments placeholder frame",
      caption: "University game experiments (being catalogued)",
      kind: "gameplay",
      placeholder: true,
      width: 1920,
      height: 1080,
    },
  ],
};
