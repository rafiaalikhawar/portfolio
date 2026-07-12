"use client";

/**
 * Nimbus — the optional cloud mascot. Subtle by design: a small soft cloud
 * with a calm face, plus tiny accessories per context. Never load-bearing.
 */
export type NimbusVariant = "plain" | "glasses" | "megaphone" | "controller";

export function Nimbus({
  variant = "plain",
  size = 56,
  className,
}: {
  variant?: NimbusVariant;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 100 72"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <ellipse
        cx="50"
        cy="46"
        rx="34"
        ry="20"
        fill="var(--surface-2)"
        stroke="var(--line-strong)"
        strokeWidth="2"
      />
      <circle
        cx="30"
        cy="38"
        r="14"
        fill="var(--surface-2)"
        stroke="var(--line-strong)"
        strokeWidth="2"
      />
      <circle
        cx="52"
        cy="30"
        r="17"
        fill="var(--surface-2)"
        stroke="var(--line-strong)"
        strokeWidth="2"
      />
      <circle
        cx="72"
        cy="40"
        r="12"
        fill="var(--surface-2)"
        stroke="var(--line-strong)"
        strokeWidth="2"
      />
      {/* seams hidden */}
      <ellipse cx="50" cy="46" rx="32" ry="18" fill="var(--surface-2)" />
      <circle cx="30" cy="38" r="12.5" fill="var(--surface-2)" />
      <circle cx="52" cy="30" r="15.5" fill="var(--surface-2)" />
      <circle cx="72" cy="40" r="10.5" fill="var(--surface-2)" />
      {/* face */}
      {variant === "glasses" ? (
        <g stroke="var(--ink)" strokeWidth="2" fill="none">
          <circle cx="43" cy="44" r="5.5" />
          <circle cx="59" cy="44" r="5.5" />
          <path d="M48.5 44h5" />
        </g>
      ) : (
        <g fill="var(--ink)">
          <circle cx="44" cy="44" r="2.4" />
          <circle cx="58" cy="44" r="2.4" />
        </g>
      )}
      <path
        d="M47 52q4 3.5 8 0"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* blush */}
      <circle cx="37" cy="49" r="2.6" fill="var(--pink)" />
      <circle cx="65" cy="49" r="2.6" fill="var(--pink)" />
      {variant === "megaphone" && (
        <g transform="translate(74 18) rotate(18)">
          <path d="M0 6 L12 0 L12 14 L0 9 Z" fill="var(--work-founded)" />
          <rect
            x="-4"
            y="5.5"
            width="5"
            height="4"
            rx="1"
            fill="var(--work-personal)"
          />
        </g>
      )}
      {variant === "controller" && (
        <g transform="translate(70 14)">
          <rect x="0" y="0" width="18" height="10" rx="5" fill="var(--work-collab)" />
          <circle cx="13.5" cy="4" r="1.5" fill="var(--surface-2)" />
          <path
            d="M4 3v4M2 5h4"
            stroke="var(--surface-2)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}
