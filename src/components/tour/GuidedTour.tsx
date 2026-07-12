"use client";

/**
 * Guided tour: a picker of visitor intents, then a step-by-step walk
 * through relevant projects. Each step focuses the project's primary
 * category on the graph and explains why the project matters for that
 * path. Fully skippable and exitable.
 */
import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tours, tourMap } from "@/content/tours";
import { getProject } from "@/content/project-index";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useWindowStore } from "@/stores/windowStore";
import { Nimbus } from "@/components/ui/Nimbus";
import { quickTransition, softTransition } from "@/lib/motion";

export function TourPicker() {
  const open = useWorkspaceStore((s) => s.tourPickerOpen);
  const setOpen = useWorkspaceStore((s) => s.setTourPickerOpen);
  const startTour = useWorkspaceStore((s) => s.startTour);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center px-4"
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
            aria-label="Choose a guided tour"
            className="panel w-full max-w-md px-6 py-6"
            onClick={(e) => e.stopPropagation()}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.96, y: 10 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.98, y: 6 },
                })}
            transition={softTransition}
          >
            <div className="mb-3 flex items-center gap-3">
              <Nimbus size={48} />
              <div>
                <h2 className="font-serif text-lg font-semibold text-ink">
                  Take the guided tour
                </h2>
                <p className="text-xs text-muted">What brings you here?</p>
              </div>
              <button
                type="button"
                aria-label="Close tour picker"
                onClick={() => setOpen(false)}
                className="ml-auto cursor-pointer rounded-md px-2 py-1 text-muted hover:text-ink"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {tours.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => startTour(t.id)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-left text-[13px] font-semibold text-ink transition-colors hover:bg-sky"
                >
                  <span aria-hidden>{t.icon}</span>
                  {t.label}
                  <span aria-hidden className="ml-auto text-muted">
                    →
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TourOverlay() {
  const tour = useWorkspaceStore((s) => s.tour);
  const { advanceTour, previousTourStep, exitTour, selectCategory, hoverProject } =
    useWorkspaceStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  const reduceMotion = useReducedMotion();

  const activeTour = tour ? tourMap[tour.tourId] : undefined;
  // Steps whose project actually exists — tours never break on content edits.
  const steps = useMemo(
    () => (activeTour ? activeTour.steps.filter((s) => getProject(s.projectId)) : []),
    [activeTour],
  );
  const step = tour && steps[tour.stepIndex];
  const project = step ? getProject(step.projectId) : undefined;

  // Focus the step's world and temporarily highlight its connections.
  useEffect(() => {
    if (!project) return;
    selectCategory(project.primaryCategory);
    hoverProject(project.id);
    return () => hoverProject(null);
  }, [project, selectCategory, hoverProject]);

  useEffect(() => {
    if (!tour) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") exitTour();
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [tour, exitTour]);

  if (!tour || !activeTour || !step || !project) return null;

  const isLast = tour.stepIndex === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        key={`${tour.tourId}-${tour.stepIndex}`}
        role="region"
        aria-label={`Guided tour step ${tour.stepIndex + 1} of ${steps.length}`}
        className="panel pointer-events-auto absolute bottom-20 left-1/2 z-40 w-[440px] max-w-[calc(100%-2rem)] -translate-x-1/2 px-5 py-4"
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 10 },
            })}
        transition={softTransition}
      >
        <div className="flex items-start gap-3">
          <Nimbus
            size={44}
            variant={
              activeTour.id === "games"
                ? "controller"
                : activeTour.id === "marketing"
                  ? "megaphone"
                  : activeTour.id === "research"
                    ? "glasses"
                    : "plain"
            }
          />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9.5px] uppercase tracking-widest text-muted">
              {activeTour.label} · {tour.stepIndex + 1} / {steps.length}
            </p>
            <p className="mt-0.5 font-serif text-[15px] font-semibold text-ink">
              <span aria-hidden>{project.icon} </span>
              {project.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{step.why}</p>
          </div>
          <button
            type="button"
            aria-label="Exit tour"
            onClick={exitTour}
            className="cursor-pointer rounded-md px-1.5 text-muted hover:text-ink"
          >
            ×
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={previousTourStep}
            disabled={tour.stepIndex === 0}
            className="cursor-pointer rounded-full border border-line bg-surface-2 px-3 py-1 text-[11px] font-semibold text-muted hover:text-ink disabled:cursor-default disabled:opacity-35"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => openWindow(project.id)}
            className="cursor-pointer rounded-full border border-line bg-cream px-3 py-1 text-[11px] font-bold text-ink hover:scale-[1.03]"
          >
            Open case study
          </button>
          <button
            type="button"
            onClick={() => advanceTour(steps.length)}
            className="ml-auto cursor-pointer rounded-full border border-line-strong bg-sky px-3.5 py-1 text-[11px] font-bold text-ink hover:scale-[1.03]"
          >
            {isLast ? "Finish ✓" : "Next →"}
          </button>
          <button
            type="button"
            onClick={exitTour}
            className="cursor-pointer rounded-full px-2 py-1 text-[11px] text-muted underline hover:text-ink"
          >
            Skip
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
