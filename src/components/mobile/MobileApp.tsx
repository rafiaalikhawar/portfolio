"use client";

/**
 * The intentional mobile experience: a simplified category map instead of
 * the desktop graph, organised project lists, full-screen case-study
 * sheets, prominent search, and the same cute identity.
 */
import { useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categories, categoryMap } from "@/content/categories";
import {
  countProjectsForCategory,
  featuredProjects,
  getProject,
  projectsForCategory,
} from "@/content/project-index";
import { homepage } from "@/content/profile";
import { socialLinks } from "@/config/socialLinks";
import { site } from "@/config/site";
import { buildTabs } from "@/lib/tabs";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useWindowStore } from "@/stores/windowStore";
import { useThemeStore } from "@/stores/themeStore";
import { ProjectCard } from "@/components/project-cards/ProjectCard";
import { CaseStudyContent } from "@/components/case-study/CaseStudyContent";
import { SearchView } from "@/components/search/SearchView";
import { ImagesView } from "@/components/image-gallery/ImagesView";
import { PreviewViewer } from "@/components/image-gallery/PreviewViewer";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { TourPicker, TourOverlay } from "@/components/tour/GuidedTour";
import {
  AboutNote,
  ContactNote,
  ResumeNote,
  ExperimentsNote,
} from "@/components/notes/Notes";
import { softTransition } from "@/lib/motion";

function MobileHome() {
  const selectCategory = useWorkspaceStore((s) => s.selectCategory);
  const setView = useWorkspaceStore((s) => s.setView);
  const setTourPickerOpen = useWorkspaceStore((s) => s.setTourPickerOpen);

  return (
    <div className="px-4 pb-24 pt-5">
      <div className="panel px-5 py-5">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          {homepage.heading}
        </h1>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">
          {homepage.statement}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          {homepage.supporting}
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTourPickerOpen(true)}
            className="cursor-pointer rounded-full border border-line-strong bg-pink px-3.5 py-1.5 text-xs font-bold text-ink"
          >
            {homepage.actions.tour}
          </button>
          <button
            type="button"
            onClick={() => setView("search")}
            className="cursor-pointer rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-xs font-bold text-ink"
          >
            {homepage.actions.search}
          </button>
        </div>
      </div>

      {/* Simplified category map */}
      <h2 className="mb-2 mt-6 px-1 font-mono text-[10px] uppercase tracking-widest text-muted">
        Rafia’s worlds
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => selectCategory(cat.id)}
            className="flex cursor-pointer flex-col items-start gap-1 rounded-2xl border border-line px-4 py-3.5 text-left shadow-sm"
            style={{ background: `var(${cat.colorVar})` }}
          >
            <span aria-hidden className="text-xl">
              {cat.icon}
            </span>
            <span className="text-[13px] font-bold leading-tight text-ink">
              {cat.label}
            </span>
            <span className="font-mono text-[9.5px] text-ink/60">
              {countProjectsForCategory(cat.id)} projects
            </span>
          </button>
        ))}
      </div>

      <h2 className="mb-2 mt-6 px-1 font-mono text-[10px] uppercase tracking-widest text-muted">
        Selected work
      </h2>
      <div className="flex flex-col gap-2.5">
        {featuredProjects().map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      <h2 className="mb-2 mt-6 px-1 font-mono text-[10px] uppercase tracking-widest text-muted">
        Currently thinking about
      </h2>
      <div className="flex flex-wrap gap-1.5 px-1">
        {homepage.currentlyThinkingAbout.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10.5px] text-muted"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function MobileCategory() {
  const selectedCategory = useWorkspaceStore((s) => s.selectedCategory)!;
  const backToBrain = useWorkspaceStore((s) => s.backToBrain);
  const category = categoryMap[selectedCategory];
  const projects = projectsForCategory(selectedCategory);

  return (
    <div className="px-4 pb-24 pt-4">
      <button
        type="button"
        onClick={backToBrain}
        className="mb-3 cursor-pointer rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted"
      >
        ← Back to brain
      </button>
      <div
        className="mb-4 rounded-2xl border border-line px-5 py-4"
        style={{ background: `var(${category.colorVar})` }}
      >
        <p className="font-serif text-lg font-semibold text-ink">
          <span aria-hidden>{category.icon} </span>
          {category.label}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink/80">
          {category.description}
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}

/** Full-screen case-study sheet — replaces desktop windows on mobile. */
function MobileProjectSheet() {
  const windows = useWindowStore((s) => s.windows);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const setActiveTab = useWindowStore((s) => s.setActiveTab);
  const reduceMotion = useReducedMotion();

  const top = useMemo(
    () =>
      windows
        .filter((w) => !w.minimized)
        .reduce<(typeof windows)[number] | null>(
          (best, w) => (!best || w.z > best.z ? w : best),
          null,
        ),
    [windows],
  );
  const project = top ? getProject(top.projectId) : undefined;
  const tabs = project ? buildTabs(project) : [];
  const activeTab = tabs.find((t) => t.id === top?.activeTab) ?? tabs[0];

  return (
    <AnimatePresence>
      {top && project && activeTab && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
          className="fixed inset-0 z-[100] flex flex-col bg-surface"
          {...(reduceMotion
            ? {}
            : {
                initial: { y: "100%" },
                animate: { y: 0 },
                exit: { y: "100%" },
              })}
          transition={softTransition}
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-line bg-surface-3 px-3 py-2.5">
            <button
              type="button"
              aria-label="Close case study"
              onClick={() => closeWindow(top.projectId)}
              className="h-3.5 w-3.5 cursor-pointer rounded-full"
              style={{ background: "#f38f8a", border: "1px solid rgba(0,0,0,0.12)" }}
            />
            <p className="min-w-0 flex-1 truncate text-center font-mono text-[10.5px] text-muted">
              {site.localDomain}/brain/{project.slug}
            </p>
            <button
              type="button"
              onClick={() => closeWindow(top.projectId)}
              className="cursor-pointer rounded-md px-2 py-0.5 text-xs font-semibold text-muted"
            >
              Done
            </button>
          </header>
          <nav
            aria-label="Case study sections"
            role="tablist"
            className="flex shrink-0 gap-1 overflow-x-auto border-b border-line bg-surface-3 px-2 py-1.5"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={tab.id === activeTab.id}
                onClick={() => setActiveTab(top.projectId, tab.id)}
                className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-[12px] font-semibold ${
                  tab.id === activeTab.id
                    ? "bg-surface-2 text-ink shadow-sm"
                    : "text-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <p className="px-6 pt-4 font-serif text-lg font-semibold text-ink">
              <span aria-hidden>{project.icon} </span>
              {project.title}
            </p>
            <CaseStudyContent project={project} tab={activeTab} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MobileApp() {
  const view = useWorkspaceStore((s) => s.view);
  const selectedCategory = useWorkspaceStore((s) => s.selectedCategory);
  const setView = useWorkspaceStore((s) => s.setView);
  const backToBrain = useWorkspaceStore((s) => s.backToBrain);
  const menuOpen = useWorkspaceStore((s) => s.mobileMenuOpen);
  const setMenuOpen = useWorkspaceStore((s) => s.setMobileMenuOpen);
  const toggleTheme = useThemeStore((s) => s.toggle);

  const body = (() => {
    switch (view) {
      case "search":
        return <SearchView />;
      case "images":
        return <ImagesView />;
      case "about":
        return <AboutNote />;
      case "contact":
        return <ContactNote />;
      case "resume":
        return <ResumeNote />;
      case "experiments":
        return <ExperimentsNote />;
      case "brain":
      default:
        return selectedCategory ? <MobileCategory /> : <MobileHome />;
    }
  })();

  const tab = (label: string, icon: string, active: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-semibold ${
        active ? "bg-sky text-ink" : "text-muted"
      }`}
    >
      <span aria-hidden className="text-base leading-none">
        {icon}
      </span>
      {label}
    </button>
  );

  return (
    <div className="texture-dots relative flex h-full flex-col bg-surface">
      <div className="starfield" aria-hidden />
      <header className="glass z-30 flex shrink-0 items-center gap-2 border-b px-3 py-2.5">
        <button
          type="button"
          onClick={backToBrain}
          className="cursor-pointer font-serif text-[16px] font-semibold text-ink"
        >
          {site.name}
        </button>
        <span className="ml-auto" />
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Switch theme"
          className="cursor-pointer rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-sm"
        >
          ☾
        </button>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="cursor-pointer rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-sm text-muted"
        >
          ☰
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobile menu"
            className="glass absolute right-3 top-12 z-40 w-52 rounded-2xl p-2 shadow-lg"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={softTransition}
          >
            {(
              [
                ["About", "about"],
                ["Resume", "resume"],
                ["Contact", "contact"],
                ["Tiny Experiments", "experiments"],
              ] as const
            ).map(([label, v]) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setView(v);
                  setMenuOpen(false);
                }}
                className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-ink hover:bg-surface-3"
              >
                {label}
              </button>
            ))}
            <div className="my-1 border-t border-line" />
            {socialLinks
              .filter((l) => l.id !== "domain")
              .map((link) =>
                link.url ? (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-[13px] font-semibold text-ink hover:bg-surface-3"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span aria-hidden>{link.icon} </span>
                    {link.label}
                  </a>
                ) : (
                  <span
                    key={link.id}
                    className="block px-3 py-2 text-[13px] text-muted/70"
                    title={link.placeholderHint}
                  >
                    <span aria-hidden>{link.icon} </span>
                    {link.label} <span className="italic">· soon</span>
                  </span>
                ),
              )}
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="min-h-0 flex-1 overflow-y-auto" aria-label="Workspace">
        {body}
      </main>

      <nav
        aria-label="Primary"
        className="glass z-30 flex shrink-0 gap-1 border-t px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        {tab("Brain", "🧠", view === "brain", backToBrain)}
        {tab("Search", "🔍", view === "search", () => setView("search"))}
        {tab("Images", "🖼️", view === "images", () => setView("images"))}
        {tab("About", "♡", view === "about", () => setView("about"))}
      </nav>

      <MobileProjectSheet />
      <TourOverlay />
      <CommandPalette />
      <TourPicker />
      <PreviewViewer />
    </div>
  );
}
