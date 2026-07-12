"use client";

/**
 * Google-inspired portfolio search in Soft Lab clothing: one big field,
 * filters, result counts, highlighted matches, keyboard navigation, and
 * results that open real project windows.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  searchPortfolio,
  SEARCH_FILTERS,
  suggestedSearches,
  highlightMatches,
  isHighlightedPart,
  type SearchResult,
} from "@/lib/search";
import { allProjects, getProject } from "@/content/project-index";
import { categoryMap } from "@/content/categories";
import { useSearchStore } from "@/stores/searchStore";
import { useWindowStore } from "@/stores/windowStore";
import { useViewerStore, type ViewerImage } from "@/stores/viewerStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { WorkTypeBadge, StatusBadge } from "@/components/ui/Badge";
import { fadeUp, quickTransition } from "@/lib/motion";

function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  const parts = highlightMatches(text, terms);
  return (
    <>
      {parts.map((part, i) =>
        isHighlightedPart(part, terms) ? <mark key={i}>{part}</mark> : part,
      )}
    </>
  );
}

export function SearchView() {
  const reduceMotion = useReducedMotion();
  const {
    query,
    filter,
    recentSearches,
    setQuery,
    setFilter,
    commitSearch,
    clearRecent,
  } = useSearchStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  const openViewer = useViewerStore((s) => s.open);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursor, setCursor] = useState(-1);

  const results = useMemo(() => searchPortfolio(query, filter), [query, filter]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const activeCursor =
    results.length === 0 ? -1 : Math.min(Math.max(cursor, 0), results.length - 1);

  function openResult(result: SearchResult) {
    commitSearch(query);
    if (result.type === "project") {
      openWindow(result.projectId);
    } else {
      const project = getProject(result.projectId);
      if (!project) return;
      const images: ViewerImage[] = project.gallery.map((g) => ({
        ...g,
        projectId: project.id,
        projectTitle: project.title,
      }));
      openViewer(images, result.imageIndex ?? 0);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor(Math.min(activeCursor + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor(Math.max(activeCursor - 1, 0));
    } else if (e.key === "Enter" && activeCursor >= 0 && results[activeCursor]) {
      e.preventDefault();
      openResult(results[activeCursor]);
    }
  }

  const hasQuery = query.trim().length > 0;

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-y-auto px-6 py-8">
      <h1 className="mb-1 text-center font-serif text-2xl font-semibold text-ink">
        Search my work
      </h1>
      <p className="mb-5 text-center text-xs text-muted">
        Projects, images, research, designs — all indexed from real case-study content.
      </p>

      {/* Big search field */}
      <div className="panel flex items-center gap-3 rounded-full px-5 py-3">
        <span aria-hidden>🔍</span>
        <input
          ref={inputRef}
          type="search"
          role="searchbox"
          aria-label="Search the portfolio"
          placeholder="Try “knowledge graphs”, “student housing”, “marketing”…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
        />
        {hasQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="cursor-pointer text-muted hover:text-ink"
          >
            ×
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        role="tablist"
        aria-label="Search filters"
        className="mt-4 flex flex-wrap justify-center gap-1.5"
      >
        {SEARCH_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              filter === f.id
                ? "border-line-strong bg-sky text-ink"
                : "border-line bg-surface-2 text-muted hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Body */}
      {!hasQuery ? (
        <div className="mt-8 space-y-6">
          {recentSearches.length > 0 && (
            <section aria-label="Recent searches">
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
                  Recent searches
                </h2>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="cursor-pointer text-[11px] text-muted underline hover:text-ink"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setQuery(r)}
                    className="cursor-pointer rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-ink hover:bg-cream"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>
          )}
          <section aria-label="Suggested searches">
            <h2 className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-muted">
              Suggested
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {suggestedSearches.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="cursor-pointer rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-ink hover:bg-lilac"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
          <section aria-label="Browse all projects">
            <h2 className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-muted">
              Or browse everything
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {allProjects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => openWindow(p.id)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-3"
                >
                  <span aria-hidden>{p.icon}</span>
                  <span className="truncate">{p.shortTitle ?? p.title}</span>
                  <span className="ml-auto text-xs text-muted">↗</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          title="Nothing in this corner of the brain."
          hint="The evidence is probably hiding in another tab — try a broader word, or one of the suggestions."
          nimbus="glasses"
        >
          <div className="flex flex-wrap justify-center gap-1.5">
            {suggestedSearches.slice(0, 5).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="cursor-pointer rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-ink hover:bg-lilac"
              >
                {s}
              </button>
            ))}
          </div>
        </EmptyState>
      ) : (
        <div className="mt-6">
          <p className="mb-3 font-mono text-[11px] text-muted" role="status">
            {results.length} result{results.length === 1 ? "" : "s"} for “{query.trim()}
            ”
          </p>
          <ul className="space-y-2.5" aria-label="Search results">
            {results.map((r, i) => {
              const project = getProject(r.projectId);
              const selected = i === activeCursor;
              return (
                <motion.li
                  key={r.id}
                  {...(reduceMotion ? {} : fadeUp)}
                  transition={quickTransition}
                >
                  <button
                    type="button"
                    onClick={() => openResult(r)}
                    onMouseEnter={() => setCursor(i)}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      selected
                        ? "border-line-strong bg-surface-2 shadow-md"
                        : "border-line bg-surface-2/70 hover:bg-surface-2"
                    }`}
                  >
                    {r.type === "image" && r.imageSrc ? (
                      <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-md border border-line">
                        <Image
                          src={r.imageSrc}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <span aria-hidden className="mt-0.5 text-lg">
                        {project?.icon ?? "📄"}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">
                        <Highlighted text={r.title} terms={r.matchedTerms} />
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">
                        <Highlighted text={r.summary} terms={r.matchedTerms} />
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
                          {r.type === "image" ? "Image" : "Project"}
                          {project
                            ? ` · ${categoryMap[project.primaryCategory].label}`
                            : ""}
                        </span>
                        {r.type === "project" && project && (
                          <>
                            <WorkTypeBadge project={project} />
                            <StatusBadge project={project} />
                          </>
                        )}
                      </span>
                    </span>
                    <span aria-hidden className="text-muted">
                      ↗
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
