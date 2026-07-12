import { describe, expect, it } from "vitest";
import { buildTabs } from "@/lib/tabs";
import { getProject, allProjects } from "@/content/project-index";
import type { PortfolioProject } from "@/types/content";

describe("case-study tab generation", () => {
  it("every project gets at least an Overview tab", () => {
    for (const p of allProjects) {
      const tabs = buildTabs(p);
      expect(tabs.length).toBeGreaterThanOrEqual(1);
      expect(tabs[0].id).toBe("overview");
    }
  });

  it("tab templates are category-aware", () => {
    const research = buildTabs(getProject("climate-health")!).map((t) => t.label);
    expect(research).toContain("Methodology");
    expect(research).toContain("Findings");

    const game = buildTabs(getProject("futera")!).map((t) => t.label);
    expect(game).toContain("Gameplay");

    const marketing = buildTabs(getProject("fabs-rental")!).map((t) => t.label);
    expect(marketing).toContain("Strategy");
    expect(marketing).toContain("Images");
  });

  it("hides tabs whose sections are empty", () => {
    const weather = getProject("weather-kg")!;
    const stripped: PortfolioProject = {
      ...weather,
      caseStudy: { ...weather.caseStudy, results: undefined },
      gallery: weather.gallery,
    };
    const labels = buildTabs(stripped).map((t) => t.label);
    expect(labels).not.toContain("Results");
  });

  it("handles a nearly-empty case study gracefully", () => {
    const pookie = getProject("pookie-enterprises")!;
    const tabs = buildTabs(pookie);
    expect(tabs.map((t) => t.id)).toContain("overview");
    // No empty shells: every generated tab has content behind it.
    expect(tabs.length).toBeLessThanOrEqual(4);
  });
});
