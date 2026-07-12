import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder frames are local, hand-generated SVGs (no external or
    // user-supplied SVG is ever rendered), so allowing them is safe here.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
