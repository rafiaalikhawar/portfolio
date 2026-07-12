import { describe, expect, it } from "vitest";
import {
  allProjects,
  projectsForCategory,
  secondaryProjectsForCategory,
  featuredProjects,
  currentlyBuildingProjects,
  relatedProjects,
  getProject,
} from "@/content/project-index";
import { categories } from "@/content/categories";
import { workTypeStyles } from "@/config/workTypes";
import { socialLinks, getSocialLink } from "@/config/socialLinks";

describe("content integrity", () => {
  it("every project validates at import time (index would throw otherwise)", () => {
    expect(allProjects.length).toBeGreaterThan(0);
  });

  it("every project has exactly one primary category, never repeated as secondary", () => {
    for (const p of allProjects) {
      expect(categories.some((c) => c.id === p.primaryCategory)).toBe(true);
      expect(p.secondaryCategories).not.toContain(p.primaryCategory);
    }
  });

  it("every related-project reference resolves", () => {
    for (const p of allProjects) {
      for (const id of p.graph.relatedProjects ?? []) {
        expect(getProject(id), `${p.id} → ${id}`).toBeDefined();
      }
    }
  });

  it("every work type used has badge styles", () => {
    for (const p of allProjects) {
      expect(workTypeStyles[p.workType]).toBeDefined();
    }
  });
});

describe("category behaviour", () => {
  it("projectsForCategory returns only primary members, featured first", () => {
    const games = projectsForCategory("games");
    expect(games.every((p) => p.primaryCategory === "games")).toBe(true);
    const firstNonFeatured = games.findIndex((p) => !p.featured);
    const lastFeatured = games.map((p) => p.featured).lastIndexOf(true);
    if (firstNonFeatured !== -1) expect(lastFeatured).toBeLessThan(firstNonFeatured);
  });

  it("games is a first-class category with several projects", () => {
    expect(projectsForCategory("games").length).toBeGreaterThanOrEqual(5);
  });

  it("secondary highlighting: HostelWalla connects marketing + business", () => {
    const hw = getProject("hostelwalla")!;
    expect(hw.primaryCategory).toBe("product");
    expect(hw.secondaryCategories).toEqual(
      expect.arrayContaining(["marketing", "business"]),
    );
    expect(secondaryProjectsForCategory("marketing").map((p) => p.id)).toContain(
      "hostelwalla",
    );
  });
});

describe("featured & status filters", () => {
  it("HostelWalla and Pookie Enterprises are featured founded ventures", () => {
    for (const id of ["hostelwalla", "pookie-enterprises"]) {
      const p = getProject(id)!;
      expect(p.featured).toBe(true);
      expect(p.workType).toBe("founded-venture");
    }
    expect(featuredProjects().map((p) => p.id)).toEqual(
      expect.arrayContaining(["hostelwalla", "pookie-enterprises"]),
    );
  });

  it("Pookie Enterprises stays a placeholder (no invented details)", () => {
    const pookie = getProject("pookie-enterprises")!;
    expect(pookie.summary).toMatch(/details being added/i);
    expect(pookie.links).toBeUndefined();
    expect(pookie.caseStudy.results).toBeUndefined();
  });

  it("currently building includes HostelWalla", () => {
    expect(currentlyBuildingProjects().map((p) => p.id)).toContain("hostelwalla");
  });

  it("relatedProjects never returns the project itself and always resolves", () => {
    for (const p of allProjects) {
      const related = relatedProjects(p);
      expect(related.map((r) => r.id)).not.toContain(p.id);
    }
  });
});

describe("social link configuration", () => {
  it("resume and github are configured", () => {
    expect(getSocialLink("resume").url).toBe("/Rafia-Ali-Resume.pdf");
    expect(getSocialLink("github").url).toContain("github.com/rafiaalikhawar");
  });

  it("placeholders are explicit nulls with hints, never fake URLs", () => {
    for (const link of socialLinks) {
      if (link.url === null) {
        expect(link.placeholderHint).toBeTruthy();
      } else {
        expect(link.url).toMatch(/^(\/|https?:\/\/|mailto:)/);
      }
    }
  });
});
