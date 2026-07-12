/**
 * Development-only guard: warns in the console when a project references a
 * gallery asset that doesn't exist under /public, so missing files are
 * caught while editing content instead of in production.
 */
import { allProjects } from "@/content/project-index";

let checked = false;

export function runDevAssetCheck() {
  if (process.env.NODE_ENV !== "development" || checked) return;
  checked = true;
  for (const project of allProjects) {
    for (const item of project.gallery) {
      fetch(item.src, { method: "HEAD" })
        .then((res) => {
          if (!res.ok) {
            console.warn(
              `[soft-lab] Missing gallery asset for "${project.id}": ${item.src} (HTTP ${res.status}). ` +
                `Add the file under /public or run: node scripts/generate-placeholders.mjs`,
            );
          }
        })
        .catch(() => {
          console.warn(
            `[soft-lab] Could not verify gallery asset for "${project.id}": ${item.src}`,
          );
        });
    }
  }
}
