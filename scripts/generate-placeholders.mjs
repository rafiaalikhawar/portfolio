/**
 * Generates the labelled SVG placeholder frames used until real project
 * visuals are added. Deliberate by design: project name, category, pastel
 * colour, an abstract sketch — never fake interfaces or stock photos.
 *
 * Run with:  node scripts/generate-placeholders.mjs
 * Replace any frame by dropping a real image at the same path (see
 * docs/IMAGE-GUIDE.md); the interface code never changes.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const palette = {
  sky: "#dceeff",
  pink: "#f6dde7",
  lilac: "#e9e2f5",
  cream: "#fff5db",
  sage: "#e8f0df",
  peach: "#ffe7d6",
  mint: "#ddf1ea",
  ink: "#27314d",
  muted: "#667085",
};

/** Each entry: [path, width, height, title, subtitle, colour, sketch] */
const frames = [
  [
    "hostelwalla/hero.svg",
    1600,
    1000,
    "HostelWalla",
    "Product & UI/UX · student housing platform",
    palette.sky,
    "browser",
  ],
  [
    "hostelwalla/thumbnail.svg",
    1200,
    750,
    "HostelWalla",
    "Thumbnail",
    palette.sky,
    "browser",
  ],
  [
    "hostelwalla/screen-01.svg",
    1600,
    1000,
    "HostelWalla — listing comparison",
    "Screen placeholder",
    palette.sky,
    "browser",
  ],
  [
    "hostelwalla/screen-02.svg",
    1080,
    1350,
    "HostelWalla — mobile search",
    "Mobile screen placeholder",
    palette.sky,
    "phone",
  ],
  [
    "hostelwalla/process.svg",
    1600,
    900,
    "HostelWalla — process",
    "Search habits → comparison-first design",
    palette.sky,
    "flow",
  ],
  [
    "weather-kg/hero.svg",
    1600,
    1000,
    "Weather Intelligence KG",
    "AI & Engineering · data pipeline",
    palette.lilac,
    "graph",
  ],
  [
    "weather-kg/architecture.svg",
    1600,
    900,
    "Weather KG — architecture",
    "collect → cache → normalise → validate → detect",
    palette.lilac,
    "flow",
  ],
  [
    "weather-kg/result.svg",
    1600,
    900,
    "Weather KG — event detection",
    "40,000+ daily records · 22 locations · 5 countries",
    palette.lilac,
    "chart",
  ],
  [
    "fabs-rental/hero.svg",
    1600,
    1000,
    "FABS Rental Marketing",
    "Marketing · positioning board",
    palette.pink,
    "board",
  ],
  [
    "fabs-rental/reel-01.svg",
    1080,
    1920,
    "FABS Rental — reel concept",
    "Portrait format placeholder",
    palette.pink,
    "phone",
  ],
  [
    "fabs-rental/content-map.svg",
    1600,
    900,
    "FABS Rental — content map",
    "Trust · flexibility · earning potential",
    palette.pink,
    "flow",
  ],
  [
    "climate-health/hero.svg",
    1600,
    1000,
    "Climate & Health Research",
    "Research · multimodal evidence map",
    palette.mint,
    "graph",
  ],
  [
    "climate-health/method-map.svg",
    1600,
    900,
    "Climate & Health — method map",
    "48 organised papers",
    palette.mint,
    "flow",
  ],
  [
    "climate-health/evidence.svg",
    1600,
    900,
    "Climate & Health — evidence tracking",
    "Evidence & gap tracking",
    palette.mint,
    "board",
  ],
  [
    "civic-innovation/hero.svg",
    1600,
    1000,
    "AI for Civic Innovation",
    "Hackathon · live product (details being added)",
    palette.cream,
    "browser",
  ],
  [
    "civic-innovation/fallback.svg",
    1600,
    900,
    "Civic Innovation — fallback path",
    "Graceful degradation when model calls fail",
    palette.cream,
    "flow",
  ],
  [
    "futera/hero.svg",
    1920,
    1080,
    "FUTERA",
    "Games & Play · football league system",
    palette.peach,
    "game",
  ],
  [
    "futera/screen-01.svg",
    1920,
    1080,
    "FUTERA — league systems",
    "Screen placeholder",
    palette.peach,
    "game",
  ],
  [
    "pookie-enterprises/hero.svg",
    1600,
    1000,
    "Pookie Enterprises",
    "Founded venture · case study in progress",
    palette.pink,
    "board",
  ],
  [
    "chrono-rift/hero.svg",
    1920,
    1080,
    "Chrono Rift",
    "Games & Play · captures being added",
    palette.peach,
    "game",
  ],
  [
    "sonic-game/hero.svg",
    1920,
    1080,
    "Sonic Game",
    "Games & Play · captures being added",
    palette.peach,
    "game",
  ],
  [
    "mario-game/hero.svg",
    1920,
    1080,
    "Mario Game",
    "Games & Play · captures being added",
    palette.peach,
    "game",
  ],
  [
    "uni-game-experiments/hero.svg",
    1920,
    1080,
    "University Game Experiments",
    "Games & Play · being catalogued",
    palette.peach,
    "game",
  ],
];

function sketch(kind, w, h) {
  const cx = w / 2;
  const cy = h / 2 - h * 0.06;
  const s = Math.min(w, h);
  const stroke = `stroke="${palette.ink}" stroke-opacity="0.35" stroke-width="${s * 0.006}" fill="none"`;
  switch (kind) {
    case "browser":
      return `
        <rect x="${cx - s * 0.28}" y="${cy - s * 0.2}" width="${s * 0.56}" height="${s * 0.36}" rx="${s * 0.02}" ${stroke}/>
        <line x1="${cx - s * 0.28}" y1="${cy - s * 0.13}" x2="${cx + s * 0.28}" y2="${cy - s * 0.13}" ${stroke}/>
        <circle cx="${cx - s * 0.24}" cy="${cy - s * 0.165}" r="${s * 0.011}" fill="${palette.ink}" fill-opacity="0.3"/>
        <circle cx="${cx - s * 0.21}" cy="${cy - s * 0.165}" r="${s * 0.011}" fill="${palette.ink}" fill-opacity="0.3"/>
        <circle cx="${cx - s * 0.18}" cy="${cy - s * 0.165}" r="${s * 0.011}" fill="${palette.ink}" fill-opacity="0.3"/>
        <rect x="${cx - s * 0.24}" y="${cy - s * 0.08}" width="${s * 0.2}" height="${s * 0.05}" rx="${s * 0.01}" ${stroke}/>
        <rect x="${cx - s * 0.24}" y="${cy}" width="${s * 0.2}" height="${s * 0.05}" rx="${s * 0.01}" ${stroke}/>
        <rect x="${cx + 0.02 * s}" y="${cy - s * 0.08}" width="${s * 0.2}" height="${s * 0.13}" rx="${s * 0.01}" ${stroke}/>`;
    case "phone":
      return `
        <rect x="${cx - s * 0.13}" y="${cy - s * 0.24}" width="${s * 0.26}" height="${s * 0.48}" rx="${s * 0.035}" ${stroke}/>
        <line x1="${cx - s * 0.05}" y1="${cy + s * 0.2}" x2="${cx + s * 0.05}" y2="${cy + s * 0.2}" ${stroke}/>
        <rect x="${cx - s * 0.09}" y="${cy - s * 0.16}" width="${s * 0.18}" height="${s * 0.09}" rx="${s * 0.012}" ${stroke}/>
        <rect x="${cx - s * 0.09}" y="${cy - s * 0.04}" width="${s * 0.18}" height="${s * 0.05}" rx="${s * 0.012}" ${stroke}/>`;
    case "flow": {
      const y = cy;
      const bw = s * 0.13;
      const gap = s * 0.18;
      const start = cx - gap * 2 - bw / 2;
      let out = "";
      for (let i = 0; i < 5; i++) {
        const x = start + i * gap;
        out += `<rect x="${x - bw / 2}" y="${y - s * 0.045}" width="${bw}" height="${s * 0.09}" rx="${s * 0.02}" ${stroke}/>`;
        if (i < 4)
          out += `<path d="M ${x + bw / 2} ${y} q ${gap * 0.3} ${-s * 0.03} ${gap - bw} 0" ${stroke} marker-end="none"/>`;
      }
      return out;
    }
    case "graph": {
      const nodes = [
        [cx, cy],
        [cx - s * 0.22, cy - s * 0.13],
        [cx + s * 0.2, cy - s * 0.15],
        [cx - s * 0.15, cy + s * 0.16],
        [cx + s * 0.24, cy + s * 0.12],
      ];
      let out = "";
      for (let i = 1; i < nodes.length; i++) {
        out += `<line x1="${nodes[0][0]}" y1="${nodes[0][1]}" x2="${nodes[i][0]}" y2="${nodes[i][1]}" ${stroke}/>`;
      }
      nodes.forEach(([x, y], i) => {
        out += `<circle cx="${x}" cy="${y}" r="${s * (i === 0 ? 0.035 : 0.022)}" fill="#ffffff" ${stroke.replace('fill="none"', "")}/>`;
      });
      return out;
    }
    case "chart": {
      const bx = cx - s * 0.25;
      const by = cy + s * 0.16;
      let out = `<line x1="${bx}" y1="${by}" x2="${bx + s * 0.5}" y2="${by}" ${stroke}/>`;
      const heights = [0.1, 0.2, 0.14, 0.28, 0.18, 0.32];
      heights.forEach((hh, i) => {
        out += `<rect x="${bx + s * 0.05 + i * s * 0.075}" y="${by - s * hh}" width="${s * 0.045}" height="${s * hh}" rx="${s * 0.008}" fill="${palette.ink}" fill-opacity="0.18"/>`;
      });
      return out;
    }
    case "board": {
      let out = "";
      const positions = [
        [cx - s * 0.24, cy - s * 0.14, -3],
        [cx - s * 0.02, cy - s * 0.18, 2],
        [cx + s * 0.18, cy - s * 0.1, -2],
        [cx - s * 0.16, cy + s * 0.06, 2],
        [cx + s * 0.05, cy + s * 0.04, -1],
      ];
      positions.forEach(([x, y, r]) => {
        out += `<rect x="${x}" y="${y}" width="${s * 0.15}" height="${s * 0.1}" rx="${s * 0.012}" transform="rotate(${r} ${x} ${y})" fill="#ffffff" ${stroke.replace('fill="none"', "")}/>`;
      });
      return out;
    }
    case "game":
      return `
        <rect x="${cx - s * 0.3}" y="${cy - s * 0.17}" width="${s * 0.6}" height="${s * 0.34}" rx="${s * 0.02}" ${stroke}/>
        <circle cx="${cx + s * 0.18}" cy="${cy}" r="${s * 0.045}" ${stroke}/>
        <path d="M ${cx - s * 0.2} ${cy} h ${s * 0.08} M ${cx - s * 0.16} ${cy - s * 0.04} v ${s * 0.08}" ${stroke} stroke-linecap="round"/>
        <path d="M ${cx - s * 0.28} ${cy + s * 0.12} q ${s * 0.1} ${-s * 0.05} ${s * 0.2} 0" ${stroke}/>`;
    default:
      return "";
  }
}

function svg([, w, h, title, subtitle, colour, kind]) {
  const s = Math.min(w, h);
  const fontTitle = s * 0.052;
  const fontSub = s * 0.026;
  const fontTag = s * 0.02;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${colour}"/>
  <rect width="${w}" height="${h}" fill="url(#dots)"/>
  <defs>
    <pattern id="dots" width="${s * 0.03}" height="${s * 0.03}" patternUnits="userSpaceOnUse">
      <circle cx="${s * 0.008}" cy="${s * 0.008}" r="${s * 0.0016}" fill="${palette.ink}" fill-opacity="0.12"/>
    </pattern>
  </defs>
  <rect x="${s * 0.03}" y="${s * 0.03}" width="${w - s * 0.06}" height="${h - s * 0.06}" rx="${s * 0.03}"
        fill="#ffffff" fill-opacity="0.55" stroke="${palette.ink}" stroke-opacity="0.25"
        stroke-width="${s * 0.004}" stroke-dasharray="${s * 0.016} ${s * 0.012}"/>
  ${sketch(kind, w, h)}
  <text x="50%" y="${h - s * 0.19}" text-anchor="middle" font-family="Georgia, serif"
        font-size="${fontTitle}" font-weight="600" fill="${palette.ink}">${title}</text>
  <text x="50%" y="${h - s * 0.135}" text-anchor="middle" font-family="system-ui, sans-serif"
        font-size="${fontSub}" fill="${palette.ink}" fill-opacity="0.75">${subtitle}</text>
  <text x="50%" y="${h - s * 0.075}" text-anchor="middle" font-family="ui-monospace, monospace"
        font-size="${fontTag}" letter-spacing="${s * 0.002}" fill="${palette.muted}">PLACEHOLDER FRAME · REAL VISUALS BEING ADDED</text>
</svg>
`;
}

for (const frame of frames) {
  const filePath = join(root, "public", "projects", frame[0]);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, svg(frame));
  console.log("wrote", frame[0]);
}
console.log(`\n${frames.length} placeholder frames generated.`);
