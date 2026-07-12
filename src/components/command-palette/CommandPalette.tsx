"use client";

/**
 * ⌘K command palette. Searches commands and projects together; focus is
 * trapped while open, Esc closes, arrows + Enter navigate.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useWindowStore } from "@/stores/windowStore";
import { useThemeStore } from "@/stores/themeStore";
import { allProjects } from "@/content/project-index";
import { getSocialLink } from "@/config/socialLinks";
import { quickTransition } from "@/lib/motion";

type Command = {
  id: string;
  label: string;
  icon: string;
  keywords: string;
  disabled?: boolean;
  disabledHint?: string;
  run: () => void;
};

export function CommandPalette() {
  const open = useWorkspaceStore((s) => s.paletteOpen);
  const setOpen = useWorkspaceStore((s) => s.setPaletteOpen);
  return (
    <AnimatePresence>{open && <PaletteDialog setOpen={setOpen} />}</AnimatePresence>
  );
}

/** Remounts on every open, so query/cursor state always starts fresh. */
function PaletteDialog({ setOpen }: { setOpen: (open: boolean) => void }) {
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const commands = useMemo<Command[]>(() => {
    const ws = useWorkspaceStore.getState();
    const linkedin = getSocialLink("linkedin");
    const github = getSocialLink("github");
    const email = getSocialLink("email");
    const resume = getSocialLink("resume");
    const go = (fn: () => void) => () => {
      fn();
      setOpen(false);
    };
    return [
      {
        id: "brain",
        label: "Open Brain View",
        icon: "🧠",
        keywords: "graph map home",
        run: go(() => ws.backToBrain()),
      },
      {
        id: "search",
        label: "Open Search",
        icon: "🔍",
        keywords: "find query",
        run: go(() => ws.setView("search")),
      },
      {
        id: "images",
        label: "Open Images",
        icon: "🖼️",
        keywords: "gallery pictures",
        run: go(() => ws.setView("images")),
      },
      {
        id: "resume",
        label: "View Resume",
        icon: "📄",
        keywords: "cv pdf",
        run: go(() => {
          ws.setView("resume");
          if (resume.url) window.open(resume.url, "_blank");
        }),
      },
      {
        id: "github",
        label: "Open GitHub",
        icon: "🐙",
        keywords: "code repositories",
        run: go(() => github.url && window.open(github.url, "_blank")),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        icon: "💼",
        keywords: "professional profile",
        disabled: !linkedin.url,
        disabledHint: linkedin.placeholderHint,
        run: go(() => linkedin.url && window.open(linkedin.url, "_blank")),
      },
      {
        id: "email",
        label: "Email Rafia",
        icon: "✉️",
        keywords: "contact mail",
        disabled: !email.url,
        disabledHint: email.placeholderHint,
        run: go(() => email.url && window.open(email.url)),
      },
      {
        id: "theme",
        label: "Switch theme (Daylight / Starlight)",
        icon: "🌗",
        keywords: "dark light mode",
        run: go(() => useThemeStore.getState().toggle()),
      },
      {
        id: "ai",
        label: "Show AI projects",
        icon: "✨",
        keywords: "engineering software",
        run: go(() => ws.selectCategory("ai-engineering")),
      },
      {
        id: "research",
        label: "Show research",
        icon: "📖",
        keywords: "papers evidence",
        run: go(() => ws.selectCategory("research")),
      },
      {
        id: "marketing",
        label: "Show marketing work",
        icon: "🌸",
        keywords: "content strategy",
        run: go(() => ws.selectCategory("marketing")),
      },
      {
        id: "product",
        label: "Show product work",
        icon: "🔷",
        keywords: "design ui ux",
        run: go(() => ws.selectCategory("product")),
      },
      {
        id: "games",
        label: "Show games",
        icon: "🎮",
        keywords: "play futera",
        run: go(() => ws.selectCategory("games")),
      },
      {
        id: "building",
        label: "Show currently building",
        icon: "🔨",
        keywords: "active in progress wip",
        run: go(() => {
          ws.setView("search");
          // Browsing filter — surfaces active projects in search view.
          import("@/stores/searchStore").then(({ useSearchStore }) => {
            useSearchStore.getState().setFilter("projects");
            useSearchStore.getState().setQuery("currently building");
          });
        }),
      },
      {
        id: "reset",
        label: "Reset brain",
        icon: "🫧",
        keywords: "clear close windows home",
        run: go(() => {
          useWindowStore.getState().closeAll();
          ws.resetBrain();
        }),
      },
      {
        id: "tour",
        label: "Start guided tour",
        icon: "🎈",
        keywords: "walkthrough guide",
        run: go(() => ws.setTourPickerOpen(true)),
      },
    ];
  }, [setOpen]);

  const q = query.trim().toLowerCase();
  const matchedCommands = commands.filter(
    (c) => !q || c.label.toLowerCase().includes(q) || c.keywords.includes(q),
  );
  const matchedProjects = q
    ? allProjects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    : [];

  const items: { kind: "command" | "project"; id: string }[] = [
    ...matchedCommands.map((c) => ({ kind: "command" as const, id: c.id })),
    ...matchedProjects.map((p) => ({ kind: "project" as const, id: p.id })),
  ];

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  const activeCursor = Math.min(cursor, Math.max(items.length - 1, 0));

  function runItem(item: { kind: "command" | "project"; id: string }) {
    if (item.kind === "command") {
      const cmd = commands.find((c) => c.id === item.id);
      if (cmd && !cmd.disabled) cmd.run();
    } else {
      useWindowStore.getState().openWindow(item.id);
      setOpen(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh]"
      style={{ background: "rgba(20, 25, 44, 0.4)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={quickTransition}
      onClick={() => setOpen(false)}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="panel w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: -12, scale: 0.98 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: -8, scale: 0.99 },
            })}
        transition={quickTransition}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span aria-hidden>✦</span>
          <input
            ref={inputRef}
            type="text"
            aria-label="Search commands and projects"
            placeholder="Type a command or project…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, items.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter" && items[activeCursor]) {
                e.preventDefault();
                runItem(items[activeCursor]);
              }
            }}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
          />
          <kbd className="rounded border border-line bg-surface-3 px-1.5 font-mono text-[9.5px] text-muted">
            esc
          </kbd>
        </div>

        <div
          className="max-h-[46vh] overflow-y-auto p-1.5"
          role="listbox"
          aria-label="Palette results"
        >
          {items.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted">
              This thought wandered off. Try another word?
            </p>
          )}
          {matchedCommands.length > 0 && (
            <p className="px-2.5 pb-1 pt-1.5 font-mono text-[9px] uppercase tracking-widest text-muted">
              Commands
            </p>
          )}
          {matchedCommands.map((cmd) => {
            const idx = items.findIndex(
              (it) => it.kind === "command" && it.id === cmd.id,
            );
            return (
              <button
                key={cmd.id}
                type="button"
                role="option"
                aria-selected={idx === activeCursor}
                disabled={cmd.disabled}
                onClick={() => runItem({ kind: "command", id: cmd.id })}
                onMouseEnter={() => setCursor(idx)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] ${
                  idx === activeCursor ? "bg-sky text-ink" : "text-ink"
                } ${cmd.disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`}
              >
                <span aria-hidden>{cmd.icon}</span>
                <span>{cmd.label}</span>
                {cmd.disabled && (
                  <span className="ml-auto text-[10px] italic text-muted">
                    {cmd.disabledHint}
                  </span>
                )}
              </button>
            );
          })}
          {matchedProjects.length > 0 && (
            <p className="px-2.5 pb-1 pt-2 font-mono text-[9px] uppercase tracking-widest text-muted">
              Projects
            </p>
          )}
          {matchedProjects.map((p) => {
            const idx = items.findIndex(
              (it) => it.kind === "project" && it.id === p.id,
            );
            return (
              <button
                key={p.id}
                type="button"
                role="option"
                aria-selected={idx === activeCursor}
                onClick={() => runItem({ kind: "project", id: p.id })}
                onMouseEnter={() => setCursor(idx)}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] ${
                  idx === activeCursor ? "bg-sky text-ink" : "text-ink"
                }`}
              >
                <span aria-hidden>{p.icon}</span>
                <span className="truncate">{p.title}</span>
                <span className="ml-auto shrink-0 font-mono text-[9.5px] text-muted">
                  open ↗
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
