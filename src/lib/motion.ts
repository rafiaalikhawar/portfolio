/**
 * The Soft Lab motion language: soft, quick, intentional, calm.
 * One place for durations and easings so every animation feels related.
 * Components should also respect `useReducedMotion()` from framer-motion.
 */
import type { Transition } from "framer-motion";

export const softEase = [0.32, 0.72, 0.24, 1] as const;

export const motionTokens = {
  fast: 0.16,
  base: 0.26,
  slow: 0.4,
} as const;

export const softTransition: Transition = {
  duration: motionTokens.base,
  ease: softEase,
};

export const quickTransition: Transition = {
  duration: motionTokens.fast,
  ease: softEase,
};

/** A gentle spring for windows — settles quickly, barely any bounce. */
export const windowSpring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const cardReveal = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};
