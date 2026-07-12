import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito_Sans, JetBrains_Mono } from "next/font/google";
import { site } from "@/config/site";
import { THEME_STORAGE_KEY } from "@/stores/themeStore";
import "./globals.css";

const heading = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: `${site.name} · ${site.owner}`,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#1b2138" },
  ],
};

/**
 * Applies the saved theme (or system preference) before first paint so
 * neither Daylight nor Starlight ever flashes into the other.
 */
const themeInitScript = `
try {
  var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  var theme = (stored === "daylight" || stored === "starlight")
    ? stored
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "starlight" : "daylight");
  document.documentElement.dataset.theme = theme;
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${heading.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
