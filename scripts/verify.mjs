/**
 * End-to-end verification of The Soft Lab's major interactions, run
 * against a dev or production server on :3000. Also drops screenshots in
 * the scratch directory passed as SHOT_DIR (defaults to ./verify-shots).
 *
 * Run with:  node scripts/verify.mjs
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SHOTS = process.env.SHOT_DIR ?? "./verify-shots";
mkdirSync(SHOTS, { recursive: true });

const results = [];
let browser;

function ok(name) {
  results.push(["PASS", name]);
  console.log("  ✓", name);
}
function fail(name, err) {
  results.push(["FAIL", name]);
  console.error("  ✗", name, "—", err?.message ?? err);
}

async function check(name, fn) {
  try {
    await fn();
    ok(name);
  } catch (err) {
    fail(name, err);
  }
}

try {
  browser = await chromium.launch({
    // Use the environment's pinned Chromium instead of downloading one.
    executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8000);
  await page.goto(BASE);
  await page.waitForLoadState("networkidle");

  await check("1. Default graph shows Rafia + 7 categories only", async () => {
    await page.getByText("Rafia ♡").first().waitFor();
    for (const label of [
      "AI & Engineering",
      "Research",
      "Product & UI/UX",
      "Marketing",
      "Business",
      "Games & Play",
      "Social Impact",
    ]) {
      await page
        .getByRole("button", {
          name: new RegExp(`${label.replace("/", "\\/")} — \\d+ project`),
        })
        .waitFor();
    }
  });

  await check("2. No project cards on the default graph", async () => {
    const count = await page
      .getByRole("button", { name: /Open HostelWalla case study/ })
      .count();
    if (count !== 0) throw new Error(`found ${count} project cards`);
  });

  await page.screenshot({ path: `${SHOTS}/01-brain-daylight.png` });

  await check("3. Clicking Product reveals product project cards", async () => {
    await page.getByRole("button", { name: /Product & UI\/UX — \d+ project/ }).click();
    await page.getByRole("button", { name: /Open HostelWalla case study/ }).waitFor();
    await page.getByRole("button", { name: "← Back to brain" }).waitFor();
  });

  await page.screenshot({ path: `${SHOTS}/02-category-focus.png` });

  await check(
    "5–6. Hovering HostelWalla shows temporary connection lines",
    async () => {
      const card = page.getByRole("button", { name: /Open HostelWalla case study/ });
      await card.hover();
      await page.waitForTimeout(400);
      const lines = await page
        .locator('svg path[stroke="var(--work-personal)"]')
        .count();
      if (lines < 2) throw new Error(`expected 2 secondary lines, got ${lines}`);
      await page.getByText("Currently building").first().waitFor();
      await page.mouse.move(10, 10);
      await page.waitForTimeout(500);
      const after = await page
        .locator('svg path[stroke="var(--work-personal)"]')
        .count();
      if (after !== 0) throw new Error(`lines remained after hover: ${after}`);
    },
  );

  await check("7. Clicking HostelWalla opens the Mac window", async () => {
    await page.getByRole("button", { name: /Open HostelWalla case study/ }).click();
    await page.getByRole("dialog", { name: /HostelWalla case study window/ }).waitFor();
    await page.getByText("rafia.local/brain/hostelwalla").waitFor();
  });

  await page.screenshot({ path: `${SHOTS}/03-mac-window.png` });

  await check("8. Case-study tabs work", async () => {
    const win = page.getByRole("dialog", { name: /HostelWalla case study window/ });
    await win.getByRole("tab", { name: "User Journey" }).click();
    await win.getByText("Understand the search").waitFor();
    await win.getByRole("tab", { name: "Screens" }).click();
    await win.getByText("Listing comparison screen").first().waitFor();
  });

  await check("9–10. Window minimises and restores from dock", async () => {
    await page.getByRole("button", { name: "Minimise window to dock" }).click();
    await page.waitForTimeout(900);
    if (
      await page.getByRole("dialog", { name: /HostelWalla case study window/ }).count()
    )
      throw new Error("window still visible after minimise");
    await page.getByRole("button", { name: "Restore HostelWalla" }).click();
    await page.getByRole("dialog", { name: /HostelWalla case study window/ }).waitFor();
  });

  await check("11. Window maximises", async () => {
    await page.getByRole("button", { name: "Maximise window" }).click();
    await page.waitForTimeout(500);
    const box = await page
      .getByRole("dialog", { name: /HostelWalla case study window/ })
      .boundingBox();
    if (!box || box.width < 900) throw new Error(`not maximised: ${box?.width}`);
    await page.getByRole("button", { name: "Restore window size" }).click();
    await page.waitForTimeout(700);
  });

  await check("Window can be resized", async () => {
    const win = page.getByRole("dialog", { name: /HostelWalla case study window/ });
    const before = await win.boundingBox();
    const handle = win.locator(".cursor-nwse-resize");
    const hb = await handle.boundingBox();
    await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
    await page.mouse.down();
    await page.mouse.move(hb.x + 130, hb.y + 90, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    const after = await win.boundingBox();
    if (after.width - before.width < 80) throw new Error("window did not grow");
  });

  await check("Window can be dragged", async () => {
    const win = page.getByRole("dialog", { name: /HostelWalla case study window/ });
    const before = await win.boundingBox();
    const header = win.locator("header");
    const hb = await header.boundingBox();
    await page.mouse.move(hb.x + hb.width / 2, hb.y + 10);
    await page.mouse.down();
    await page.mouse.move(hb.x + hb.width / 2 + 100, hb.y + 70, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    const after = await win.boundingBox();
    if (Math.abs(after.x - before.x) < 80) throw new Error("window did not move");
  });

  // Close the window before moving on.
  await page.getByRole("button", { name: "Close window" }).click();
  await page.waitForTimeout(400);

  await check("12. Search for marketing works with highlighting", async () => {
    await page.getByRole("button", { name: "Search", exact: true }).first().click();
    await page.getByRole("searchbox").fill("marketing");
    await page.waitForTimeout(300);
    await page.getByText(/result(s)? for “marketing”/).waitFor();
    const marks = await page.locator("mark").count();
    if (marks === 0) throw new Error("no highlighted matches");
    // keyboard: Enter opens top result window
    await page.getByRole("searchbox").press("Enter");
    await page.getByRole("dialog", { name: /case study window/ }).waitFor();
    await page.getByRole("button", { name: "Close window" }).click();
  });

  await page.screenshot({ path: `${SHOTS}/04-search.png` });

  await check("13. Images view + type filter + preview viewer", async () => {
    await page.getByRole("button", { name: "Images", exact: true }).first().click();
    await page.getByRole("heading", { name: "Images" }).waitFor();
    await page.getByRole("button", { name: "Gameplay", exact: true }).click();
    await page.waitForTimeout(300);
    const figures = await page.locator("figure").count();
    if (figures < 3) throw new Error(`expected gameplay images, got ${figures}`);
    await page.locator("figure button").first().click();
    await page.getByRole("dialog", { name: /Image viewer/ }).waitFor();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    if (await page.getByRole("dialog", { name: /Image viewer/ }).count())
      throw new Error("viewer did not close on Escape");
  });

  await page.screenshot({ path: `${SHOTS}/05-images.png` });

  await check("14. Games category reveals game cards", async () => {
    await page.getByRole("button", { name: "Graph", exact: true }).click();
    await page.getByRole("button", { name: /Games & Play — \d+ project/ }).click();
    await page
      .getByRole("button", { name: /Open FUTERA Football League System case study/ })
      .waitFor();
    await page.getByRole("button", { name: /Open Chrono Rift case study/ }).waitFor();
  });

  await check("15. Theme switch to Starlight persists", async () => {
    await page.getByRole("button", { name: /Switch to Starlight theme/ }).click();
    await page.waitForTimeout(200);
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    if (theme !== "starlight") throw new Error(`theme is ${theme}`);
    await page.reload();
    await page.waitForLoadState("networkidle");
    const after = await page.evaluate(() => document.documentElement.dataset.theme);
    if (after !== "starlight") throw new Error(`theme did not persist: ${after}`);
  });

  await page.screenshot({ path: `${SHOTS}/06-starlight.png` });

  await check("16. Command palette opens with Ctrl+K and runs commands", async () => {
    await page.keyboard.press("Control+k");
    await page.getByRole("dialog", { name: "Command palette" }).waitFor();
    await page.getByRole("textbox", { name: /Search commands/ }).fill("weather");
    await page.getByRole("option", { name: /Weather Intelligence/ }).click();
    await page
      .getByRole("dialog", { name: /Weather Intelligence.*case study window/ })
      .waitFor();
    await page.getByRole("button", { name: "Close window" }).click();
  });

  await check("Guided tour runs and can be exited", async () => {
    await page.keyboard.press("Control+k");
    await page.getByRole("textbox", { name: /Search commands/ }).fill("tour");
    await page.getByRole("option", { name: /Start guided tour/ }).click();
    await page.getByRole("button", { name: "I’m hiring for AI or software" }).click();
    await page.getByRole("region", { name: /Guided tour step 1/ }).waitFor();
    await page.getByRole("button", { name: "Next →" }).click();
    await page.getByRole("region", { name: /Guided tour step 2/ }).waitFor();
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Exit tour" }).last().click();
  });

  await page.screenshot({ path: `${SHOTS}/07-after-tour.png` });

  await check("19. Resume/GitHub/LinkedIn/email behave correctly", async () => {
    await page.getByRole("button", { name: "Professional links" }).click();
    await page
      .getByRole("link", { name: /GitHub/ })
      .first()
      .waitFor();
    await page
      .getByRole("link", { name: /Resume/ })
      .first()
      .waitFor();
    // LinkedIn + email are placeholders: must NOT be links
    if (await page.locator(".panel a", { hasText: "LinkedIn" }).count())
      throw new Error("placeholder LinkedIn rendered as a live link");
    await page.keyboard.press("Escape");
    const res = await page.request.get(`${BASE}/Rafia-Ali-Resume.pdf`);
    if (!res.ok()) throw new Error(`resume pdf HTTP ${res.status()}`);
  });

  await check("17. Mobile layout renders intentionally", async () => {
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    mobile.setDefaultTimeout(8000);
    await mobile.goto(BASE);
    await mobile.getByText("Rafia’s worlds").waitFor();
    await mobile.getByRole("button", { name: /Games & Play/ }).click();
    await mobile.getByRole("button", { name: /Open FUTERA/ }).waitFor();
    await mobile.getByRole("button", { name: /Open FUTERA/ }).click();
    await mobile.getByRole("dialog", { name: /FUTERA.*case study/ }).waitFor();
    await mobile.screenshot({ path: `${SHOTS}/08-mobile-sheet.png` });
    await mobile.getByRole("button", { name: "Done" }).click();
    await mobile.screenshot({ path: `${SHOTS}/09-mobile-category.png` });
    await mobile.close();
  });

  await check("18. Keyboard navigation reaches categories and cards", async () => {
    await page.getByRole("button", { name: "Graph", exact: true }).click();
    // Tab until a category node gets focus
    let found = false;
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const label = await page.evaluate(() =>
        document.activeElement?.getAttribute("aria-label"),
      );
      if (label?.includes("Research")) {
        found = true;
        break;
      }
    }
    if (!found) throw new Error("could not reach a category with Tab");
    await page.keyboard.press("Enter");
    await page
      .getByRole("button", { name: /Open Climate & Health Research case study/ })
      .waitFor();
  });
  await check("20. Reduced-motion mode works", async () => {
    const rm = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    rm.setDefaultTimeout(8000);
    await rm.goto(BASE);
    await rm.getByRole("button", { name: /Games & Play — \d+ project/ }).click();
    await rm.getByRole("button", { name: /Open FUTERA/ }).waitFor();
    await rm.getByRole("button", { name: /Open FUTERA/ }).click();
    await rm.getByRole("dialog", { name: /FUTERA.*case study window/ }).waitFor();
    await rm.close();
  });
} finally {
  await browser?.close();
}

const failed = results.filter(([s]) => s === "FAIL").length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
