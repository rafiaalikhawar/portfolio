import { describe, expect, it } from "vitest";
import { searchPortfolio, buildSearchDocs } from "@/lib/search";
import { allProjects } from "@/content/project-index";

describe("search indexing", () => {
  it("indexes every project and every gallery image", () => {
    const docs = buildSearchDocs();
    const projectDocs = docs.filter((d) => d.type === "project");
    const imageDocs = docs.filter((d) => d.type === "image");
    expect(projectDocs.length).toBe(allProjects.length);
    expect(imageDocs.length).toBe(
      allProjects.reduce((n, p) => n + p.gallery.length, 0),
    );
  });

  it("finds projects by title, tag, and case-study text", () => {
    expect(searchPortfolio("hostelwalla").map((r) => r.projectId)).toContain(
      "hostelwalla",
    );
    expect(searchPortfolio("knowledge graphs").map((r) => r.projectId)).toContain(
      "weather-kg",
    );
    expect(searchPortfolio("gig workers").map((r) => r.projectId)).toContain(
      "fabs-rental",
    );
  });

  it("tolerates minor misspellings and partial queries", () => {
    expect(searchPortfolio("marketting").length).toBeGreaterThan(0);
    expect(searchPortfolio("hostel").map((r) => r.projectId)).toContain("hostelwalla");
  });

  it("filters work on structured metadata", () => {
    const projectsOnly = searchPortfolio("placeholder", "projects");
    expect(projectsOnly.every((r) => r.type === "project")).toBe(true);

    const imagesOnly = searchPortfolio("pipeline", "images");
    expect(imagesOnly.every((r) => r.type === "image")).toBe(true);

    const gamesOnly = searchPortfolio("system", "games");
    expect(gamesOnly.length).toBeGreaterThan(0);
    for (const r of gamesOnly) {
      const project = allProjects.find((p) => p.id === r.projectId)!;
      expect(
        project.primaryCategory === "games" ||
          project.secondaryCategories.includes("games"),
      ).toBe(true);
    }
  });

  it("returns empty for empty queries", () => {
    expect(searchPortfolio("")).toEqual([]);
    expect(searchPortfolio("   ")).toEqual([]);
  });

  it("ranks title matches above buried text matches", () => {
    const results = searchPortfolio("weather");
    expect(results[0].projectId).toBe("weather-kg");
  });
});
