"use client";

/**
 * The macOS-inspired dock: quick destinations plus minimised windows.
 * Placeholder links (LinkedIn, email) render disabled with a hint — no
 * decorative fake controls.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useWindowStore } from "@/stores/windowStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { getProject } from "@/content/project-index";
import { getSocialLink } from "@/config/socialLinks";
import { useSearchStore } from "@/stores/searchStore";
import { quickTransition } from "@/lib/motion";

function DockButton({
  label,
  icon,
  onClick,
  href,
  disabled,
  disabledHint,
  indicator,
}: {
  label: string;
  icon: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  disabledHint?: string;
  indicator?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const inner = (
    <motion.span
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-lg shadow-sm"
      whileHover={reduceMotion || disabled ? undefined : { scale: 1.18, y: -6 }}
      transition={quickTransition}
      style={disabled ? { opacity: 0.4 } : undefined}
    >
      {icon}
    </motion.span>
  );

  const wrapper = "group relative flex flex-col items-center";
  const tooltip = (
    <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-md border border-line bg-surface-2 px-2 py-0.5 text-[10.5px] font-semibold text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
      {disabled && disabledHint ? disabledHint : label}
    </span>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        aria-label={label}
        className={wrapper}
      >
        {tooltip}
        {inner}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={disabled && disabledHint ? `${label} — ${disabledHint}` : label}
      aria-disabled={disabled}
      disabled={disabled}
      className={`${wrapper} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      {tooltip}
      {inner}
      {indicator && (
        <span
          aria-hidden
          className="absolute -bottom-1.5 h-1 w-1 rounded-full"
          style={{ background: "var(--work-personal)" }}
        />
      )}
    </button>
  );
}

export function Dock() {
  const windows = useWindowStore((s) => s.windows);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const { setView, selectCategory } = useWorkspaceStore();
  const minimized = windows.filter((w) => w.minimized);

  const github = getSocialLink("github");
  const linkedin = getSocialLink("linkedin");

  return (
    <nav
      aria-label="Dock"
      className="pointer-events-auto absolute bottom-3 left-1/2 z-40 -translate-x-1/2"
    >
      <div className="glass flex items-end gap-1.5 rounded-2xl px-3 py-2 shadow-lg">
        <DockButton label="Brain" icon="🧠" onClick={() => setView("brain")} />
        <DockButton label="Search" icon="🔍" onClick={() => setView("search")} />
        <DockButton
          label="Projects"
          icon="🗂️"
          onClick={() => {
            useSearchStore.getState().setFilter("projects");
            setView("search");
          }}
        />
        <DockButton label="Games" icon="🎮" onClick={() => selectCategory("games")} />
        <span aria-hidden className="mx-1 h-8 w-px self-center bg-line-strong" />
        <DockButton label="Resume" icon="📄" onClick={() => setView("resume")} />
        <DockButton label="GitHub" icon="🐙" href={github.url ?? undefined} />
        <DockButton
          label="LinkedIn"
          icon="💼"
          href={linkedin.url ?? undefined}
          disabled={!linkedin.url}
          disabledHint={linkedin.placeholderHint}
        />
        <DockButton label="Contact" icon="✉️" onClick={() => setView("contact")} />

        {minimized.length > 0 && (
          <>
            <span aria-hidden className="mx-1 h-8 w-px self-center bg-line-strong" />
            {minimized.map((w) => {
              const project = getProject(w.projectId);
              if (!project) return null;
              return (
                <DockButton
                  key={w.projectId}
                  label={`Restore ${project.title}`}
                  icon={project.icon}
                  onClick={() => restoreWindow(w.projectId)}
                  indicator
                />
              );
            })}
          </>
        )}
      </div>
    </nav>
  );
}
