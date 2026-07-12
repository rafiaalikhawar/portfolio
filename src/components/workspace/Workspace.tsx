"use client";

/**
 * The desktop workspace: top nav, Obsidian-style sidebar, the centre
 * canvas (brain / search / images / notes), the right contextual panel,
 * floating project windows, the dock, and global overlays.
 */
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { runDevAssetCheck } from "@/lib/devAssetCheck";
import { useGlobalHotkeys } from "@/hooks/useGlobalHotkeys";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { TopNav } from "@/components/navigation/TopNav";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { RightPanel } from "@/components/sidebar/RightPanel";
import { BrainGraph } from "@/components/brain-graph/BrainGraph";
import { WelcomeHero } from "@/components/brain-graph/WelcomeHero";
import { CategoryFocusPanel } from "@/components/category-focus/CategoryFocusPanel";
import { WindowLayer } from "@/components/mac-window/WindowLayer";
import { Dock } from "@/components/dock/Dock";
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
import { MobileApp } from "@/components/mobile/MobileApp";

function CenterView() {
  const view = useWorkspaceStore((s) => s.view);
  const selectedCategory = useWorkspaceStore((s) => s.selectedCategory);
  const welcomeDismissed = useWorkspaceStore((s) => s.welcomeDismissed);

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
      return (
        <div className="flex h-full w-full gap-4 p-4">
          <div className="relative min-w-0 flex-1">
            <BrainGraph />
            <AnimatePresence>
              {!welcomeDismissed && !selectedCategory && <WelcomeHero />}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {selectedCategory && <CategoryFocusPanel />}
          </AnimatePresence>
        </div>
      );
  }
}

export function Workspace() {
  useGlobalHotkeys();
  const isMobile = useIsMobile();
  const sidebarOpen = useWorkspaceStore((s) => s.sidebarOpen);

  useEffect(() => {
    runDevAssetCheck();
  }, []);

  if (isMobile) {
    return <MobileApp />;
  }

  return (
    <div className="flex h-full flex-col bg-surface">
      <TopNav />
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && <Sidebar />}
        <main className="texture-dots relative min-w-0 flex-1" aria-label="Workspace">
          <div className="starfield" aria-hidden />
          <CenterView />
          <WindowLayer />
          <TourOverlay />
          <Dock />
        </main>
        <RightPanel />
      </div>
      <CommandPalette />
      <TourPicker />
      <PreviewViewer />
    </div>
  );
}
