"use client";

/**
 * The Soft Lab is a fully client-side knowledge workspace (windows, graph
 * focus, persisted preferences), so the whole app mounts on the client.
 * Page metadata still renders server-side from layout.tsx.
 */
import dynamic from "next/dynamic";

const Workspace = dynamic(
  () => import("@/components/workspace/Workspace").then((m) => m.Workspace),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-surface">
        <p className="font-serif text-sm text-muted">Connecting the dots…</p>
      </div>
    ),
  },
);

export default function Home() {
  return <Workspace />;
}
