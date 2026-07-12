"use client";

/**
 * Renders one case-study tab from structured project content.
 * Section renderers are generic — no project is ever hardcoded here.
 */
import Image from "next/image";
import type { PortfolioProject, ContentBlock, GalleryItem } from "@/types/content";
import type { SectionKey, TabDef } from "@/lib/tabs";
import { sectionHasContent } from "@/lib/tabs";
import { categoryMap } from "@/content/categories";
import { relatedProjects } from "@/content/project-index";
import { workTypeStyles, statusLabels } from "@/config/workTypes";
import { useViewerStore, type ViewerImage } from "@/stores/viewerStore";
import { useWindowStore } from "@/stores/windowStore";
import {
  Badge,
  StatusBadge,
  WorkTypeBadge,
  FeaturedBadge,
} from "@/components/ui/Badge";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-6 font-serif text-[15px] font-semibold text-ink first:mt-0">
      {children}
    </h3>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[13px] leading-relaxed text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden className="mt-[2px] text-ink/50">
            ✦
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Blocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <div key={i}>
          {b.heading && (
            <p className="mb-1 text-[13px] font-bold text-ink">{b.heading}</p>
          )}
          <p className="text-[13px] leading-relaxed text-muted">{b.body}</p>
        </div>
      ))}
    </div>
  );
}

function GalleryGrid({
  project,
  items,
}: {
  project: PortfolioProject;
  items: GalleryItem[];
}) {
  const openViewer = useViewerStore((s) => s.open);
  const viewerImages: ViewerImage[] = items.map((g) => ({
    ...g,
    projectId: project.id,
    projectTitle: project.title,
  }));
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((g, i) => (
        <figure key={g.src}>
          <button
            type="button"
            onClick={() => openViewer(viewerImages, i)}
            className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line transition-transform hover:scale-[1.015]"
            aria-label={`View image: ${g.caption}`}
          >
            <Image
              src={g.src}
              alt={g.alt}
              width={g.width}
              height={g.height}
              className="h-auto w-full"
              sizes="(max-width: 820px) 90vw, 420px"
            />
          </button>
          <figcaption className="mt-1 text-[11px] leading-snug text-muted">
            {g.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function LinksRow({ project }: { project: PortfolioProject }) {
  const links = project.links;
  if (!links) return null;
  const entries: { label: string; url: string }[] = [];
  if (links.live) entries.push({ label: "Visit live site ↗", url: links.live });
  if (links.github) entries.push({ label: "GitHub ↗", url: links.github });
  if (links.demo) entries.push({ label: "Demo ↗", url: links.demo });
  if (links.report) entries.push({ label: "Report ↗", url: links.report });
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map((e) => (
        <a
          key={e.url}
          href={e.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-line bg-surface-3 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-sky"
        >
          {e.label}
        </a>
      ))}
    </div>
  );
}

function Section({
  project,
  section,
}: {
  project: PortfolioProject;
  section: SectionKey;
}) {
  const cs = project.caseStudy;
  if (!sectionHasContent(project, section)) return null;

  switch (section) {
    case "intro":
      return (
        <div>
          <p className="text-sm leading-relaxed text-ink">{project.summary}</p>
          {project.introduction && (
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              {project.introduction}
            </p>
          )}
          {project.role && (
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
              <span className="font-bold text-ink">Role · </span>
              {project.role}
            </p>
          )}
        </div>
      );
    case "problem":
      return (
        <div>
          <SectionTitle>The problem</SectionTitle>
          <p className="text-[13px] leading-relaxed text-muted">{cs.problem}</p>
        </div>
      );
    case "importance":
      return (
        <div>
          <SectionTitle>Why it matters</SectionTitle>
          <p className="text-[13px] leading-relaxed text-muted">{cs.importance}</p>
        </div>
      );
    case "constraints":
      return (
        <div>
          <SectionTitle>Constraints</SectionTitle>
          <BulletList items={cs.constraints!} />
        </div>
      );
    case "process":
      return (
        <div>
          <SectionTitle>Process</SectionTitle>
          <ol className="space-y-3">
            {cs.process!.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-3 font-mono text-[11px] text-muted"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-ink">{step.title}</p>
                  <p className="text-[13px] leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    case "decisions":
      return (
        <div>
          <SectionTitle>Key decisions</SectionTitle>
          <BulletList items={cs.decisions!} />
        </div>
      );
    case "tools":
      return (
        <div>
          <SectionTitle>Tools</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {cs.tools!.map((t) => (
              <span
                key={t}
                className="rounded-md border border-line bg-surface-3 px-2 py-0.5 font-mono text-[11px] text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      );
    case "architecture":
      return (
        <div>
          <SectionTitle>Architecture</SectionTitle>
          <Blocks blocks={cs.architecture!} />
        </div>
      );
    case "methodology":
      return (
        <div>
          <SectionTitle>Methodology</SectionTitle>
          <Blocks blocks={cs.methodology!} />
        </div>
      );
    case "strategy":
      return (
        <div>
          <SectionTitle>Strategy</SectionTitle>
          <Blocks blocks={cs.strategy!} />
        </div>
      );
    case "gameplayBlocks":
      return (
        <div>
          <SectionTitle>Gameplay & systems</SectionTitle>
          <Blocks blocks={cs.gameplay!} />
        </div>
      );
    case "results":
      return (
        <div>
          <SectionTitle>Results</SectionTitle>
          <ul className="space-y-2">
            {cs.results!.map((r) => (
              <li
                key={r.statement}
                className="rounded-lg border border-line bg-surface-3 px-3 py-2"
              >
                <p className="text-[13px] font-semibold text-ink">{r.statement}</p>
                {r.detail && (
                  <p className="mt-0.5 text-[11.5px] text-muted">{r.detail}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    case "failures":
      return (
        <div>
          <SectionTitle>What didn’t work</SectionTitle>
          <BulletList items={cs.failures!} />
        </div>
      );
    case "learnings":
      return (
        <div>
          <SectionTitle>Learnings</SectionTitle>
          <BulletList items={cs.learnings!} />
        </div>
      );
    case "nextSteps":
      return (
        <div>
          <SectionTitle>Next steps</SectionTitle>
          <BulletList items={cs.nextSteps!} />
        </div>
      );
    case "gallery":
      return (
        <div>
          <SectionTitle>Gallery</SectionTitle>
          <GalleryGrid project={project} items={project.gallery} />
        </div>
      );
    case "screens": {
      const screens = project.gallery.filter(
        (g) => g.kind === "ui" || g.kind === "mobile",
      );
      return (
        <div>
          <SectionTitle>Screens</SectionTitle>
          <GalleryGrid project={project} items={screens} />
        </div>
      );
    }
    case "links":
      return (
        <div className="mt-4">
          <LinksRow project={project} />
        </div>
      );
  }
}

export function CaseStudyContent({
  project,
  tab,
}: {
  project: PortfolioProject;
  tab: TabDef;
}) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const related = relatedProjects(project);
  const isOverview = tab.id === "overview";

  return (
    <div className="px-6 py-5">
      {isOverview && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          {project.featured && <FeaturedBadge />}
          <WorkTypeBadge project={project} />
          <StatusBadge project={project} />
          <Badge>{categoryMap[project.primaryCategory].label}</Badge>
        </div>
      )}

      <div className="space-y-1">
        {tab.sections.map((s) => (
          <Section key={s} project={project} section={s} />
        ))}
      </div>

      {isOverview && (
        <div className="mt-6 border-t border-line pt-4">
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-muted">
            Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.length > 0 ? (
              project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-surface-3 px-2 py-0.5 text-[11px] text-muted"
                >
                  {t}
                </span>
              ))
            ) : (
              <span className="text-[11.5px] italic text-muted">Tags being added</span>
            )}
          </div>
          {related.length > 0 && (
            <>
              <p className="mb-2 mt-4 font-mono text-[10.5px] uppercase tracking-wider text-muted">
                Related work
              </p>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => openWindow(r.id)}
                    className="cursor-pointer rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-semibold text-ink transition-colors hover:bg-lilac"
                  >
                    <span aria-hidden>{r.icon} </span>
                    {r.shortTitle ?? r.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <p className="mt-6 text-center font-mono text-[10px] text-muted/70">
        {statusLabels[project.status]} · {workTypeStyles[project.workType].label}
      </p>
    </div>
  );
}
