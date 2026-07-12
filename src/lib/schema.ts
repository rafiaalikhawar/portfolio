/**
 * Runtime validation for portfolio content.
 *
 * Every project in `src/content/projects/` passes through
 * `validateProject()` when the project index is built, so a typo in content
 * fails loudly in development instead of quietly breaking a view.
 */
import { z } from "zod";
import {
  CATEGORY_IDS,
  GALLERY_KINDS,
  PROJECT_STATUSES,
  WORK_TYPES,
  type PortfolioProject,
} from "@/types/content";

const categoryId = z.enum(CATEGORY_IDS);

const galleryItemSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  caption: z.string().min(1),
  kind: z.enum(GALLERY_KINDS),
  placeholder: z.boolean().optional(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const contentBlockSchema = z.object({
  heading: z.string().optional(),
  body: z.string().min(1),
  image: z.string().optional(),
});

const processStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const resultItemSchema = z.object({
  statement: z.string().min(1),
  detail: z.string().optional(),
});

export const projectSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be lowercase kebab-case"),
    title: z.string().min(1),
    shortTitle: z.string().optional(),
    icon: z.string().min(1),
    summary: z.string().min(1),
    cardLine: z.string().min(1).max(90),
    introduction: z.string().optional(),

    primaryCategory: categoryId,
    secondaryCategories: z.array(categoryId),
    tags: z.array(z.string()),

    status: z.enum(PROJECT_STATUSES),
    activelyBuilding: z.boolean().optional(),

    workType: z.enum(WORK_TYPES),
    featured: z.boolean(),
    foundedByRafia: z.boolean().optional(),
    collaborationType: z.enum(["solo", "team", "co-founded"]).optional(),

    role: z.string().optional(),
    timeline: z.string().optional(),
    audience: z.string().optional(),
    collaborators: z.array(z.string()).optional(),

    graph: z.object({
      relatedProjects: z.array(z.string()).optional(),
      cardOrder: z.number().optional(),
    }),

    caseStudy: z.object({
      problem: z.string().optional(),
      importance: z.string().optional(),
      constraints: z.array(z.string()).optional(),
      process: z.array(processStepSchema).optional(),
      decisions: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
      architecture: z.array(contentBlockSchema).optional(),
      methodology: z.array(contentBlockSchema).optional(),
      strategy: z.array(contentBlockSchema).optional(),
      gameplay: z.array(contentBlockSchema).optional(),
      results: z.array(resultItemSchema).optional(),
      failures: z.array(z.string()).optional(),
      learnings: z.array(z.string()).optional(),
      nextSteps: z.array(z.string()).optional(),
    }),

    gallery: z.array(galleryItemSchema),

    links: z
      .object({
        live: z.string().url().optional(),
        github: z.string().url().optional(),
        demo: z.string().url().optional(),
        report: z.string().url().optional(),
      })
      .optional(),
  })
  .refine((p) => !p.secondaryCategories.includes(p.primaryCategory), {
    message: "primaryCategory must not repeat inside secondaryCategories",
  });

export function validateProject(candidate: unknown): PortfolioProject {
  const parsed = projectSchema.safeParse(candidate);
  if (!parsed.success) {
    const title =
      typeof candidate === "object" && candidate !== null && "id" in candidate
        ? String((candidate as { id: unknown }).id)
        : "unknown project";
    throw new Error(
      `Invalid project content for "${title}":\n${parsed.error.issues
        .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`,
    );
  }
  return parsed.data as PortfolioProject;
}
