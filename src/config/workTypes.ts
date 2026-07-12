/**
 * Work-type badge + accent tokens.
 *
 * The accent colour describes the *context* a project was made in (founded
 * venture, internship, university…), not the project's own brand. Colours
 * live as CSS custom properties in globals.css so cards never hardcode hex
 * values.
 */
import type { WorkType } from "@/types/content";

export type WorkTypeStyle = {
  label: string;
  /** CSS var carrying the accent colour, e.g. "var(--work-founded)". */
  accent: string;
};

export const workTypeStyles: Record<WorkType, WorkTypeStyle> = {
  "founded-venture": {
    label: "Founded Venture",
    accent: "var(--work-founded)",
  },
  "internship-project": {
    label: "Internship Project",
    accent: "var(--work-internship)",
  },
  "university-project": {
    label: "University Project",
    accent: "var(--work-university)",
  },
  "client-work": {
    label: "Client Work",
    accent: "var(--work-client)",
  },
  "personal-project": {
    label: "Personal Project",
    accent: "var(--work-personal)",
  },
  "research-project": {
    label: "Research Project",
    accent: "var(--work-research)",
  },
  "hackathon-project": {
    label: "Hackathon Project",
    accent: "var(--work-hackathon)",
  },
  "collaborative-project": {
    label: "Collaborative Project",
    accent: "var(--work-collab)",
  },
  "social-impact-initiative": {
    label: "Social-Impact Initiative",
    accent: "var(--work-social)",
  },
};

export const statusLabels: Record<string, string> = {
  idea: "Idea",
  planning: "Planning",
  "in-progress": "In progress",
  completed: "Completed",
  paused: "Paused",
  archived: "Archived",
};
