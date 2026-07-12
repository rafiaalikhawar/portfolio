import type { PortfolioProject } from "@/types/content";
import { externalLinks } from "@/config/socialLinks";

/**
 * HostelWalla — featured founded venture, currently building.
 * Gallery images are labelled placeholders; see docs/IMAGE-GUIDE.md to
 * replace them with real screens.
 */
export const hostelwalla: PortfolioProject = {
  id: "hostelwalla",
  slug: "hostelwalla",
  title: "HostelWalla",
  icon: "🏠",
  summary:
    "A student-first platform for discovering and comparing hostels using clearer information about facilities, prices, locations, and student needs.",
  cardLine: "Student housing platform",
  introduction:
    "Finding a hostel as a student usually means word-of-mouth, blurry photos, and prices that change once you show up. HostelWalla is being built to make that search feel honest: clear facilities, clear prices, clear locations, compared side by side.",

  primaryCategory: "product",
  secondaryCategories: ["marketing", "business"],
  tags: [
    "Student Housing",
    "Product Design",
    "UI Design",
    "Web Platform",
    "Brand Direction",
  ],

  status: "in-progress",
  activelyBuilding: true,

  workType: "founded-venture",
  featured: true,
  foundedByRafia: true,
  collaborationType: "solo",

  role: "Product thinking, UI direction, web building, brand direction, and launch planning.",
  audience: "Students searching for reliable, comparable hostel options.",

  graph: {
    relatedProjects: ["fabs-rental", "pookie-enterprises"],
    cardOrder: 1,
  },

  caseStudy: {
    problem:
      "Students choosing a hostel rarely get clear, comparable information. Listings hide prices, exaggerate facilities, and skip the details students actually care about — distance, food, internet, and who they will live with.",
    importance:
      "Housing is one of the biggest stress points of student life. A search built around student needs, not landlord marketing, changes how the first weeks of university feel.",
    process: [
      {
        title: "Understand the search",
        description:
          "Mapped how students actually find hostels today — group chats, seniors, and on-the-ground visits — and where each step loses information.",
      },
      {
        title: "Design the comparison",
        description:
          "Prioritised the details students compare in real life (price, facilities, location, environment) and designed listing pages around them.",
      },
      {
        title: "Build and iterate the web platform",
        description:
          "Built the live site iteratively, adjusting layout and information hierarchy as the listing content took shape.",
      },
      {
        title: "Plan the launch",
        description:
          "Working on brand direction and launch planning so the product and its story arrive together.",
      },
    ],
    decisions: [
      "Lead with facilities, prices, and locations instead of promotional photography.",
      "Design listing pages around comparison, because students shortlist before they visit.",
      "Treat the brand voice as part of the product — trustworthy, plain, student-first.",
    ],
    tools: ["Web platform (live)", "UI design", "Brand direction"],
    learnings: [
      "A comparison product is only as good as the honesty of its information architecture.",
      "This one became much bigger than expected — a listings page quietly turns into a data model, a brand, and a launch plan.",
    ],
    nextSteps: [
      "Continue building listing depth and comparison features.",
      "Finalise brand direction and launch plan.",
    ],
  },

  gallery: [
    {
      src: "/projects/hostelwalla/hero.svg",
      alt: "HostelWalla hero placeholder frame",
      caption:
        "HostelWalla — student housing platform (hero frame, final visuals being added)",
      kind: "ui",
      placeholder: true,
      width: 1600,
      height: 1000,
    },
    {
      src: "/projects/hostelwalla/screen-01.svg",
      alt: "HostelWalla listing screen placeholder frame",
      caption: "Listing comparison screen (placeholder frame)",
      kind: "ui",
      placeholder: true,
      width: 1600,
      height: 1000,
    },
    {
      src: "/projects/hostelwalla/screen-02.svg",
      alt: "HostelWalla mobile screen placeholder frame",
      caption: "Mobile search flow (placeholder frame)",
      kind: "mobile",
      placeholder: true,
      width: 1080,
      height: 1350,
    },
    {
      src: "/projects/hostelwalla/process.svg",
      alt: "HostelWalla product process diagram placeholder",
      caption:
        "From student search habits to comparison-first listing design (process sketch)",
      kind: "process",
      placeholder: true,
      width: 1600,
      height: 900,
    },
  ],

  links: {
    live: externalLinks.hostelwalla,
  },
};
