"use client";

/**
 * Google Images-inspired gallery of the visual evidence behind the work —
 * masonry columns, project + image-type filters, and a Preview-style
 * viewer on click. Everything derives from project gallery data.
 */
import { useMemo, useState } from "react";
import Image from "next/image";
import { allProjects } from "@/content/project-index";
import { GALLERY_KINDS, type GalleryKind } from "@/types/content";
import { useViewerStore, type ViewerImage } from "@/stores/viewerStore";
import { EmptyState } from "@/components/ui/EmptyState";

const kindLabels: Record<GalleryKind, string> = {
  ui: "UI",
  mobile: "Mobile",
  branding: "Branding",
  marketing: "Marketing",
  research: "Research",
  architecture: "Architecture",
  process: "Process",
  results: "Results",
  gameplay: "Gameplay",
};

export function ImagesView() {
  const openViewer = useViewerStore((s) => s.open);
  const [kindFilter, setKindFilter] = useState<GalleryKind | "all">("all");
  const [projectFilter, setProjectFilter] = useState<string | "all">("all");

  const allImages: ViewerImage[] = useMemo(
    () =>
      allProjects.flatMap((p) =>
        p.gallery.map((g) => ({
          ...g,
          projectId: p.id,
          projectTitle: p.title,
        })),
      ),
    [],
  );

  const filtered = allImages.filter(
    (img) =>
      (kindFilter === "all" || img.kind === kindFilter) &&
      (projectFilter === "all" || img.projectId === projectFilter),
  );

  const projectsWithImages = allProjects.filter((p) => p.gallery.length > 0);

  return (
    <div className="mx-auto h-full w-full max-w-5xl overflow-y-auto px-6 py-8">
      <h1 className="mb-1 text-center font-serif text-2xl font-semibold text-ink">
        Images
      </h1>
      <p className="mb-5 text-center text-xs text-muted">
        The visual evidence behind the work. Placeholder frames are labelled — real
        captures replace them without touching the interface.
      </p>

      {/* Image-type filters */}
      <div
        className="mb-3 flex flex-wrap justify-center gap-1.5"
        role="group"
        aria-label="Filter by image type"
      >
        {(["all", ...GALLERY_KINDS] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kindFilter === k}
            onClick={() => setKindFilter(k)}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              kindFilter === k
                ? "border-line-strong bg-pink text-ink"
                : "border-line bg-surface-2 text-muted hover:text-ink"
            }`}
          >
            {k === "all" ? "All" : kindLabels[k]}
          </button>
        ))}
      </div>

      {/* Project filter */}
      <div className="mb-6 flex justify-center">
        <label className="flex items-center gap-2 text-xs text-muted">
          Project
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-line bg-surface-2 px-2 py-1 text-xs text-ink"
          >
            <option value="all">All projects</option>
            {projectsWithImages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.shortTitle ?? p.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No images in this drawer yet."
          hint="Try a different filter — or the evidence is probably hiding in another tab."
        />
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
          {filtered.map((img) => {
            const indexInFiltered = filtered.indexOf(img);
            return (
              <figure
                key={`${img.projectId}-${img.src}`}
                className="break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => openViewer(filtered, indexInFiltered)}
                  className="block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-surface-2 shadow-sm transition-transform hover:scale-[1.015]"
                  aria-label={`View image: ${img.caption}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    className="h-auto w-full"
                    sizes="(max-width: 820px) 45vw, 300px"
                  />
                </button>
                <figcaption className="mt-1 px-1">
                  <span className="block truncate text-[11px] font-semibold text-ink">
                    {img.projectTitle}
                  </span>
                  <span className="block truncate text-[10.5px] text-muted">
                    {kindLabels[img.kind]} · {img.caption}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </div>
  );
}
