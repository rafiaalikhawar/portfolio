"use client";

/**
 * Mac Preview-style image viewer. Renders as a modal child window above
 * the window layer (fixed z, focus-trapped, Esc to close) so it can never
 * break the desktop's z-ordering.
 */
import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useViewerStore } from "@/stores/viewerStore";
import { softTransition } from "@/lib/motion";

export function PreviewViewer() {
  const { images, index, zoom, close, next, previous, setZoom } = useViewerStore();
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const open = index !== null && images[index] !== undefined;
  const image = open ? images[index!] : null;

  useEffect(() => {
    if (!open) return;
    containerRef.current?.focus();
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          close();
          break;
        case "ArrowRight":
          next();
          break;
        case "ArrowLeft":
          previous();
          break;
        case "+":
        case "=":
          setZoom(useViewerStore.getState().zoom + 0.25);
          break;
        case "-":
          setZoom(useViewerStore.getState().zoom - 0.25);
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next, previous, setZoom]);

  return (
    <AnimatePresence>
      {open && image && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(20, 25, 44, 0.55)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={softTransition}
          onClick={close}
        >
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Image viewer: ${image.caption}`}
            tabIndex={-1}
            className="panel flex max-h-full w-full max-w-3xl flex-col overflow-hidden outline-none"
            onClick={(e) => e.stopPropagation()}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.94, y: 12 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.96, y: 8 },
                })}
            transition={softTransition}
          >
            {/* Preview-style title bar */}
            <header className="flex shrink-0 items-center gap-3 border-b border-line bg-surface-3 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Close viewer"
                  onClick={close}
                  className="h-3.5 w-3.5 cursor-pointer rounded-full"
                  style={{
                    background: "#f38f8a",
                    border: "1px solid rgba(0,0,0,0.12)",
                  }}
                />
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 rounded-full opacity-30"
                  style={{ background: "#f7ce69" }}
                />
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 rounded-full opacity-30"
                  style={{ background: "#8fd08a" }}
                />
              </div>
              <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-ink">
                {image.projectTitle} — {image.caption}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => setZoom(zoom - 0.25)}
                  className="cursor-pointer rounded-md border border-line bg-surface-2 px-2 py-0.5 text-xs text-ink hover:bg-surface-3"
                >
                  −
                </button>
                <span className="w-11 text-center font-mono text-[10.5px] text-muted">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => setZoom(zoom + 0.25)}
                  className="cursor-pointer rounded-md border border-line bg-surface-2 px-2 py-0.5 text-xs text-ink hover:bg-surface-3"
                >
                  +
                </button>
              </div>
            </header>

            {/* Image area */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto bg-surface p-4">
              <button
                type="button"
                aria-label="Previous image"
                onClick={previous}
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-2/90 text-ink shadow-md hover:bg-surface-2"
              >
                ←
              </button>
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transition: reduceMotion ? undefined : "transform 0.2s ease",
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="max-h-[60vh] w-auto rounded-md border border-line"
                  sizes="90vw"
                  priority
                />
              </div>
              <button
                type="button"
                aria-label="Next image"
                onClick={next}
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-2/90 text-ink shadow-md hover:bg-surface-2"
              >
                →
              </button>
            </div>

            {/* Caption bar */}
            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-line bg-surface-3 px-4 py-2">
              <p className="min-w-0 truncate text-[11.5px] text-muted">
                <span className="font-semibold text-ink">{image.projectTitle}</span>
                {" · "}
                {image.kind}
                {image.placeholder && " · placeholder frame"}
              </p>
              <p className="shrink-0 font-mono text-[10px] text-muted">
                {index! + 1} / {images.length} · esc to close
              </p>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
