import { describe, expect, it } from "vitest";
import { validateProject } from "@/lib/schema";
import { hostelwalla } from "@/content/projects/hostelwalla";

describe("project schema validation", () => {
  it("accepts a real project", () => {
    expect(() => validateProject(hostelwalla)).not.toThrow();
  });

  it("rejects a project with an unknown category", () => {
    expect(() =>
      validateProject({ ...hostelwalla, primaryCategory: "cooking" }),
    ).toThrow(/primaryCategory/);
  });

  it("rejects a primary category repeated as secondary", () => {
    expect(() =>
      validateProject({
        ...hostelwalla,
        secondaryCategories: [hostelwalla.primaryCategory],
      }),
    ).toThrow(/must not repeat/);
  });

  it("rejects an invalid status", () => {
    expect(() => validateProject({ ...hostelwalla, status: "shipped" })).toThrow(
      /status/,
    );
  });

  it("rejects gallery items without alt text", () => {
    expect(() =>
      validateProject({
        ...hostelwalla,
        gallery: [
          { src: "/x.svg", alt: "", caption: "c", kind: "ui", width: 1, height: 1 },
        ],
      }),
    ).toThrow(/alt/);
  });

  it("rejects malformed slugs", () => {
    expect(() => validateProject({ ...hostelwalla, slug: "Hostel Walla" })).toThrow(
      /slug/,
    );
  });

  it("names the offending project in the error", () => {
    expect(() => validateProject({ ...hostelwalla, summary: "" })).toThrow(
      /hostelwalla/,
    );
  });
});
