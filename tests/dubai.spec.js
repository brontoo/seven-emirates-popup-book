import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const experience = (page) => page.locator(".experience");
async function load(page, query = "?inspect") {
  await page.goto("/" + query);
  await expect(experience(page)).toHaveAttribute("data-scene-ready", "true", {
    timeout: 45000,
  });
}
async function slider(page, name, value) {
  await page
    .getByRole("slider", { name, exact: true })
    .evaluate((element, value) => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set.call(element, String(value));
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
}
async function audit(page, { chapter, progress = 1, turnProgress } = {}) {
  await expect
    .poll(
      async () => {
        const data = JSON.parse(
          (await page.locator("[data-audit]").textContent()) || "{}",
        );
        return (
          data.chapter === chapter &&
          data.progress === progress &&
          (turnProgress === undefined ||
            Math.abs(data.turnProgress - turnProgress) < 1e-5)
        );
      },
      { timeout: 20000 },
    )
    .toBe(true);
  return JSON.parse(await page.locator("[data-audit]").textContent());
}
const clean = { style: ".mechanism-inspector{visibility:hidden!important}" };

test("Dubai is chapter two, and every opening pose fits inside the same book", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await load(page);
  await mkdir("artifacts/dubai", { recursive: true });
  await page.getByLabel("Inspector active chapter").selectOption("1");
  const results = {};
  for (const value of [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1]) {
    await slider(page, "Inspector book opening", value);
    const result = await audit(page, { chapter: 1, progress: value });
    expect(result.pageViolations).toBe(0);
    expect(result.coverViolations).toBe(0);
    expect(result.assemblies).toBeGreaterThan(10);
    results[value] = result;
    if ([0, 0.25, 0.5, 0.75, 1].includes(value))
      await page.screenshot({
        path: `artifacts/dubai/open-${value * 100}.png`,
        fullPage: true,
        ...clean,
      });
  }
  await expect(page.locator(".chapter-identity h2")).toContainText("Dubai");
  await expect(page.locator(".chapter-number")).toHaveText("02");
  for (const label of [
    "Museum of the Future",
    "Burj Khalifa",
    "Emirates Towers",
    "Dubai Metro",
  ]) {
    await page.getByRole("button", { name: new RegExp(label) }).click();
    await expect(page.locator(".landmark-story h3")).toHaveText(label);
  }
  await writeFile(
    "artifacts/dubai/folding-validation.json",
    JSON.stringify(results, null, 2),
  );
  expect(errors).toEqual([]);
});

test("Next and Previous animate the same inner leaf and partial turns preserve page clearance", async ({
  page,
}) => {
  test.setTimeout(180000);
  await load(page);
  await slider(page, "Inspector book opening", 1);
  await audit(page, { chapter: 0 });
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await expect(experience(page)).toHaveAttribute(
    "data-page-turn-state",
    "turning",
  );
  await expect(
    page.getByRole("slider", { name: "Book opening", exact: true }),
  ).toHaveAttribute("aria-disabled", "true");
  await expect(
    page.getByRole("button", { name: "Previous chapter", exact: true }),
  ).toBeDisabled();
  await expect(experience(page)).toHaveAttribute(
    "data-page-turn-state",
    "idle",
    { timeout: 25000 },
  );
  await expect(experience(page)).toHaveAttribute("data-chapter-id", "dubai");
  await page
    .getByRole("button", { name: "Previous chapter", exact: true })
    .click();
  await expect(experience(page)).toHaveAttribute(
    "data-page-turn-state",
    "turning",
  );
  await expect(experience(page)).toHaveAttribute(
    "data-page-turn-state",
    "idle",
    { timeout: 25000 },
  );
  await expect(experience(page)).toHaveAttribute(
    "data-chapter-id",
    "abu-dhabi",
  );
  const results = {};
  for (const from of [0, 1]) {
    await page
      .getByLabel("Inspector active chapter")
      .selectOption(String(from));
    results[from] = {};
    for (const t of [0.1, 0.25, 0.49, 0.5, 0.51, 0.75, 0.9, 1]) {
      await slider(page, "Inspector page turn", t);
      const target = t < 0.5 ? from : 1 - from;
      const data = await audit(page, { chapter: target, turnProgress: t });
      expect(data.pageViolations).toBe(0);
      expect(data.coverViolations).toBe(0);
      if (t === 0.5) expect(data.unfold).toBe(0);
      results[from][t] = data;
      if ([0.25, 0.5, 0.75, 1].includes(t))
        await page.screenshot({
          path: `artifacts/dubai/turn-${from}-${t * 100}.png`,
          fullPage: true,
          ...clean,
        });
    }
  }
  await writeFile(
    "artifacts/dubai/page-turn-validation.json",
    JSON.stringify(results, null, 2),
  );
});

test("Dubai supports reduced-motion navigation and native touch close and reopen", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await load(page);
  await slider(page, "Inspector book opening", 1);
  await audit(page, { chapter: 0 });
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await expect(experience(page)).toHaveAttribute("data-chapter-id", "dubai", {
    timeout: 20000,
  });
  await expect(experience(page)).toHaveAttribute(
    "data-page-turn-state",
    "idle",
    { timeout: 20000 },
  );
  const opened = await audit(page, { chapter: 1 });
  const cdp = await context.newCDPSession(page);
  const travel = Math.max(
    200,
    (await page.locator("canvas").boundingBox()).width * 0.48,
  );
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: opened.grips.inside[0], y: opened.grips.inside[1] }],
  });
  await expect(experience(page)).toHaveAttribute("data-dragging", "true");
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      { x: opened.grips.inside[0] + travel, y: opened.grips.inside[1] },
    ],
  });
  await expect(experience(page)).toHaveAttribute(
    "data-book-progress",
    "0.0000",
  );
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  const closed = await audit(page, { chapter: 1, progress: 0 });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: closed.grips.outside[0], y: closed.grips.outside[1] }],
  });
  await expect(experience(page)).toHaveAttribute("data-dragging", "true");
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      { x: closed.grips.outside[0] - travel, y: closed.grips.outside[1] },
    ],
  });
  await expect(experience(page)).toHaveAttribute(
    "data-book-progress",
    "1.0000",
  );
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(experience(page)).toHaveAttribute("data-chapter-id", "dubai");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.screenshot({
    path: "artifacts/dubai/mobile.png",
    fullPage: true,
    ...clean,
  });
  await context.close();
});
