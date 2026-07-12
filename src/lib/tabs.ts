/**
 * Category-aware case-study tab generation.
 *
 * Each main category has its own tab template (a research project reads
 * differently from a game). Tabs are generated from the project's actual
 * content: a tab with nothing to show is hidden automatically, so projects
 * never render empty shells.
 */
import type { CategoryId, PortfolioProject } from "@/types/content";

/** The renderable content sections a tab can be composed of. */
export type SectionKey =
  | "intro"
  | "problem"
  | "importance"
  | "constraints"
  | "process"
  | "decisions"
  | "tools"
  | "architecture"
  | "methodology"
  | "strategy"
  | "gameplayBlocks"
  | "results"
  | "failures"
  | "learnings"
  | "nextSteps"
  | "gallery"
  | "screens"
  | "links";

export type TabDef = {
  id: string;
  label: string;
  sections: SectionKey[];
};

type TabTemplate = TabDef[];

const overview: TabDef = {
  id: "overview",
  label: "Overview",
  sections: ["intro", "problem", "importance", "constraints", "links"],
};

const tabTemplates: Record<CategoryId, TabTemplate> = {
  "ai-engineering": [
    overview,
    { id: "architecture", label: "Architecture", sections: ["architecture"] },
    {
      id: "development",
      label: "Development",
      sections: ["process", "decisions", "tools"],
    },
    { id: "results", label: "Results", sections: ["results"] },
    {
      id: "learnings",
      label: "Learnings",
      sections: ["failures", "learnings", "nextSteps"],
    },
    { id: "gallery", label: "Gallery", sections: ["gallery"] },
  ],
  research: [
    overview,
    { id: "methodology", label: "Methodology", sections: ["methodology"] },
    { id: "process", label: "Process", sections: ["process", "tools"] },
    { id: "findings", label: "Findings", sections: ["results"] },
    {
      id: "next-steps",
      label: "Next Steps",
      sections: ["nextSteps", "learnings"],
    },
    { id: "evidence", label: "Evidence", sections: ["gallery"] },
  ],
  marketing: [
    overview,
    { id: "strategy", label: "Strategy", sections: ["strategy"] },
    {
      id: "content",
      label: "Content",
      sections: ["process", "decisions", "tools"],
    },
    { id: "results", label: "Results", sections: ["results"] },
    { id: "images", label: "Images", sections: ["gallery"] },
    {
      id: "learnings",
      label: "Learnings",
      sections: ["failures", "learnings", "nextSteps"],
    },
  ],
  product: [
    overview,
    { id: "screens", label: "Screens", sections: ["screens"] },
    { id: "journey", label: "User Journey", sections: ["process"] },
    {
      id: "design",
      label: "Design Process",
      sections: ["decisions", "tools"],
    },
    { id: "build", label: "Build", sections: ["architecture"] },
    {
      id: "outcome",
      label: "Outcome",
      sections: ["results", "learnings", "nextSteps"],
    },
  ],
  business: [
    overview,
    { id: "workflow", label: "Workflow", sections: ["process"] },
    {
      id: "system",
      label: "System",
      sections: ["architecture", "tools"],
    },
    { id: "analysis", label: "Analysis", sections: ["strategy", "decisions"] },
    {
      id: "outcome",
      label: "Outcome",
      sections: ["results", "learnings", "nextSteps"],
    },
    { id: "gallery", label: "Gallery", sections: ["gallery"] },
  ],
  games: [
    overview,
    { id: "gameplay", label: "Gameplay", sections: ["gameplayBlocks"] },
    { id: "gallery", label: "Gallery", sections: ["gallery"] },
    {
      id: "development",
      label: "Development",
      sections: ["process", "decisions", "tools"],
    },
    {
      id: "challenges",
      label: "Challenges",
      sections: ["failures", "constraints"],
    },
    {
      id: "learnings",
      label: "Learnings",
      sections: ["learnings", "nextSteps"],
    },
  ],
  "social-impact": [
    overview,
    { id: "approach", label: "Approach", sections: ["methodology", "strategy"] },
    {
      id: "development",
      label: "Development",
      sections: ["process", "decisions", "tools"],
    },
    { id: "results", label: "Results", sections: ["results"] },
    {
      id: "learnings",
      label: "Learnings",
      sections: ["failures", "learnings", "nextSteps"],
    },
    { id: "gallery", label: "Gallery", sections: ["gallery"] },
  ],
};

function nonEmpty(value: unknown): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "object") {
    return Object.values(value as object).some(nonEmpty);
  }
  return true;
}

export function sectionHasContent(
  project: PortfolioProject,
  section: SectionKey,
): boolean {
  const cs = project.caseStudy;
  switch (section) {
    case "intro":
      // Summary is required, so overview always has content.
      return nonEmpty(project.summary) || nonEmpty(project.introduction);
    case "problem":
      return nonEmpty(cs.problem);
    case "importance":
      return nonEmpty(cs.importance);
    case "constraints":
      return nonEmpty(cs.constraints);
    case "process":
      return nonEmpty(cs.process);
    case "decisions":
      return nonEmpty(cs.decisions);
    case "tools":
      return nonEmpty(cs.tools);
    case "architecture":
      return nonEmpty(cs.architecture);
    case "methodology":
      return nonEmpty(cs.methodology);
    case "strategy":
      return nonEmpty(cs.strategy);
    case "gameplayBlocks":
      return nonEmpty(cs.gameplay);
    case "results":
      return nonEmpty(cs.results);
    case "failures":
      return nonEmpty(cs.failures);
    case "learnings":
      return nonEmpty(cs.learnings);
    case "nextSteps":
      return nonEmpty(cs.nextSteps);
    case "gallery":
      return project.gallery.length > 0;
    case "screens":
      return project.gallery.some((g) => g.kind === "ui" || g.kind === "mobile");
    case "links":
      return nonEmpty(project.links);
  }
}

/** Tabs for a project — only those with real content survive. */
export function buildTabs(project: PortfolioProject): TabDef[] {
  const template = tabTemplates[project.primaryCategory];
  return template.filter((tab) =>
    tab.sections.some((s) => sectionHasContent(project, s)),
  );
}
