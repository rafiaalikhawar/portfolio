"use client";

import { Nimbus, type NimbusVariant } from "./Nimbus";

export function EmptyState({
  title,
  hint,
  nimbus = "plain",
  children,
}: {
  title: string;
  hint?: string;
  nimbus?: NimbusVariant;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <Nimbus variant={nimbus} size={72} />
      <p className="font-serif text-lg text-ink">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted">{hint}</p>}
      {children}
    </div>
  );
}
