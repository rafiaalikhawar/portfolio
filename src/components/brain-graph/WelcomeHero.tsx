"use client";

/**
 * The homepage hero, floating over the default brain view. Dismisses when
 * the visitor starts exploring.
 */
import { motion, useReducedMotion } from "framer-motion";
import { homepage } from "@/content/profile";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { softTransition } from "@/lib/motion";

export function WelcomeHero() {
  const reduceMotion = useReducedMotion();
  const { dismissWelcome, setView, setTourPickerOpen } = useWorkspaceStore();

  return (
    <motion.div
      className="panel pointer-events-auto absolute left-5 top-5 z-20 w-[330px] max-w-[calc(100%-2.5rem)] px-6 py-6"
      {...(reduceMotion
        ? {}
        : {
            initial: { opacity: 0, y: 14 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 8 },
          })}
      transition={softTransition}
    >
      <span
        aria-hidden
        className="absolute -top-2 right-8 h-5 w-20 rotate-[3deg] rounded-sm opacity-70"
        style={{ background: "var(--sky)", boxShadow: "var(--shadow-soft)" }}
      />
      <h1 className="font-serif text-[26px] font-semibold leading-tight text-ink">
        {homepage.heading}
      </h1>
      <p className="mt-2.5 text-sm font-semibold leading-relaxed text-ink">
        {homepage.statement}
      </p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
        {homepage.supporting}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={dismissWelcome}
          className="cursor-pointer rounded-full border border-line-strong bg-pink px-3.5 py-1.5 text-xs font-bold text-ink shadow-sm transition-transform hover:scale-[1.03]"
        >
          {homepage.actions.explore}
        </button>
        <button
          type="button"
          onClick={() => setTourPickerOpen(true)}
          className="cursor-pointer rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-lilac"
        >
          {homepage.actions.tour}
        </button>
        <button
          type="button"
          onClick={() => setView("search")}
          className="cursor-pointer rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-sky"
        >
          {homepage.actions.search}
        </button>
      </div>

      <p className="mb-1.5 mt-5 font-mono text-[9.5px] uppercase tracking-widest text-muted">
        Currently thinking about
      </p>
      <div className="flex flex-wrap gap-1.5">
        {homepage.currentlyThinkingAbout.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line bg-surface-3 px-2 py-0.5 text-[10.5px] text-muted"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
