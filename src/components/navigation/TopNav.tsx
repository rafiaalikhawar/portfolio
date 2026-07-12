"use client";

/** Top navigation: identity, views, theme toggle, ⌘K, and links menu. */
import { useEffect, useRef, useState } from "react";
import { useWorkspaceStore, type WorkspaceView } from "@/stores/workspaceStore";
import { useThemeStore, resolveTheme } from "@/stores/themeStore";
import { socialLinks } from "@/config/socialLinks";
import { site } from "@/config/site";

const navItems: { view: WorkspaceView; label: string }[] = [
  { view: "brain", label: "Graph" },
  { view: "search", label: "Search" },
  { view: "images", label: "Images" },
  { view: "about", label: "About" },
  { view: "resume", label: "Resume" },
  { view: "contact", label: "Contact" },
];

export function TopNav() {
  const view = useWorkspaceStore((s) => s.view);
  const setView = useWorkspaceStore((s) => s.setView);
  const backToBrain = useWorkspaceStore((s) => s.backToBrain);
  const setPaletteOpen = useWorkspaceStore((s) => s.setPaletteOpen);
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar);
  const preference = useThemeStore((s) => s.preference);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const [linksOpen, setLinksOpen] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!linksOpen) return;
    function onClick(e: MouseEvent) {
      if (!linksRef.current?.contains(e.target as Node)) setLinksOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setLinksOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, [linksOpen]);

  // The workspace renders client-side only, so this is hydration-safe.
  const theme = resolveTheme(preference);

  return (
    <header className="glass z-30 flex shrink-0 items-center gap-2 border-b px-3 py-2">
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="cursor-pointer rounded-lg border border-line bg-surface-2 px-2 py-1 text-sm text-muted hover:text-ink"
      >
        ☰
      </button>

      <button
        type="button"
        onClick={backToBrain}
        className="mr-2 flex cursor-pointer items-baseline gap-2 rounded-lg px-1.5 py-0.5"
        aria-label="The Soft Lab — back to brain view"
      >
        <span className="font-serif text-[17px] font-semibold text-ink">
          {site.name}
        </span>
        <span className="hidden font-mono text-[10px] text-muted lg:block">
          {site.subtitle}
        </span>
      </button>

      <nav aria-label="Main views" className="hidden items-center gap-0.5 md:flex">
        {navItems.map((item) => (
          <button
            key={item.view}
            type="button"
            aria-current={view === item.view ? "page" : undefined}
            onClick={() => setView(item.view)}
            className={`cursor-pointer rounded-full px-3 py-1 text-[12.5px] font-semibold transition-colors ${
              view === item.view
                ? "bg-sky text-ink"
                : "text-muted hover:bg-surface-3 hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette"
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[11.5px] text-muted hover:text-ink"
        >
          <span aria-hidden>✦</span>
          <span className="hidden sm:block">Command</span>
          <kbd className="rounded border border-line bg-surface-3 px-1 font-mono text-[9.5px]">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "daylight" ? "Starlight" : "Daylight"} theme`}
          className="cursor-pointer rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-sm hover:bg-surface-3"
          suppressHydrationWarning
        >
          {theme === "daylight" ? "☾" : "☀"}
        </button>

        {/* Compact professional links menu */}
        <div className="relative" ref={linksRef}>
          <button
            type="button"
            aria-label="Professional links"
            aria-expanded={linksOpen}
            onClick={() => setLinksOpen((o) => !o)}
            className="cursor-pointer rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-sm text-muted hover:text-ink"
          >
            ⋯
          </button>
          {linksOpen && (
            <div className="panel absolute right-0 top-full z-50 mt-1.5 w-48 p-1.5">
              {socialLinks
                .filter((l) => l.id !== "domain")
                .map((link) =>
                  link.url ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.url.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-ink hover:bg-surface-3"
                      onClick={() => setLinksOpen(false)}
                    >
                      <span aria-hidden>{link.icon}</span> {link.label}
                    </a>
                  ) : (
                    <span
                      key={link.id}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] text-muted/70"
                      title={link.placeholderHint}
                    >
                      <span aria-hidden>{link.icon}</span> {link.label}
                      <span className="ml-auto text-[9.5px] italic">soon</span>
                    </span>
                  ),
                )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
