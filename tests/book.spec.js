import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const experience = (p) => p.locator(".experience");
const progress = async (p) =>
  Number(await experience(p).getAttribute("data-book-progress"));
async function load(page, query = "?inspect") {
  await page.goto("/" + query);
  await expect(experience(page)).toHaveAttribute("data-scene-ready", "true", {
    timeout: 45000,
  });
  await expect(experience(page)).toHaveAttribute(
    "data-book-progress",
    "0.0000",
  );
}
async function report(page, value) {
  await expect
    .poll(
      async () =>
        JSON.parse((await page.locator("[data-audit]").textContent()) || "{}")
          .progress,
      { timeout: 15000 },
    )
    .toBe(value);
  return JSON.parse(await page.locator("[data-audit]").textContent());
}
async function pose(page, value) {
  await page
    .getByRole("slider", { name: "Inspector book opening", exact: true })
    .evaluate((el, value) => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set.call(el, String(value));
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
  await expect(experience(page)).toHaveAttribute(
    "data-book-progress",
    value.toFixed(4),
  );
  return report(page, value);
}
const noInspector = {
  style: ".mechanism-inspector{visibility:hidden!important}",
};

test("stages A–E preserve page constraints and the complete scene fits at all requested poses", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await load(page, "?inspect&stage=a");
  const results = {};
  await mkdir("artifacts/reference-rebuild", { recursive: true });
  for (const stage of ["a", "b", "c", "d", "e"]) {
    await page.getByLabel("Build stage").selectOption(stage);
    results[stage] = {};
    for (const value of stage === "e"
      ? [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1]
      : [0, 0.5, 1]) {
      const snapshot = await pose(page, value);
      expect(snapshot.assemblies).toBeGreaterThan(0);
      expect(snapshot.coverViolations).toBe(0);
      expect(snapshot.pageViolations).toBe(0);
      results[stage][value] = snapshot;
      if (stage === "e" && [0, 0.25, 0.5, 0.75, 1].includes(value))
        await page.screenshot({
          path: `artifacts/reference-rebuild/${value * 100}.png`,
          fullPage: true,
          ...noInspector,
        });
    }
  }
  await page.getByLabel("Hinge points", { exact: true }).check();
  await page.getByLabel("Fold axes", { exact: true }).check();
  await page.getByLabel("Attachment points", { exact: true }).check();
  await page.screenshot({
    path: "artifacts/reference-rebuild/inspector.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Reset to closed" }).click();
  expect(await progress(page)).toBe(0);
  await writeFile(
    "artifacts/reference-rebuild/validation.json",
    JSON.stringify(results, null, 2),
  );
  expect(errors).toEqual([]);
});

test("native cover dragging holds, reverses, leaves the cover, and closes repeatedly", async ({
  page,
}) => {
  await load(page);
  const first = await report(page, 0);
  await page.waitForTimeout(700);
  expect(await progress(page)).toBe(0);
  const travel = (await page.locator("canvas").boundingBox()).width * 0.48;
  const start = first.grips.outside;
  await page.mouse.click(...start);
  expect(await progress(page)).toBe(0);
  await page.mouse.move(...start);
  await page.mouse.down();
  await expect(experience(page)).toHaveAttribute("data-dragging", "true");
  await page.mouse.move(start[0] - travel * 0.5, start[1], { steps: 10 });
  expect(await progress(page)).toBeCloseTo(0.5, 3);
  await page.mouse.move(start[0] - travel * 0.25, start[1], { steps: 7 });
  expect(await progress(page)).toBeCloseTo(0.25, 3);
  await page.mouse.up();
  await page.waitForTimeout(350);
  expect(await progress(page)).toBeCloseTo(0.25, 3);
  await pose(page, 0);
  for (let cycle = 0; cycle < 2; cycle++) {
    const closed = await report(page, 0);
    await page.mouse.move(...closed.grips.outside);
    await page.mouse.down();
    await page.mouse.move(
      closed.grips.outside[0] - travel,
      closed.grips.outside[1],
      { steps: 12 },
    );
    await page.mouse.up();
    expect(await progress(page)).toBe(1);
    const open = await report(page, 1);
    await page.mouse.move(...open.grips.inside);
    await page.mouse.down();
    await expect(experience(page)).toHaveAttribute("data-dragging", "true");
    await page.mouse.move(open.grips.inside[0] + travel, open.grips.inside[1], {
      steps: 12,
    });
    await page.mouse.up();
    expect(await progress(page)).toBe(0);
  }
});

test("native touch follows the cover in both directions and mobile framing stays within the viewport", async ({
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
  const audit = await report(page, 0);
  const cdp = await context.newCDPSession(page);
  const travel = Math.max(
      200,
      (await page.locator("canvas").boundingBox()).width * 0.48,
    ),
    [x, y] = audit.grips.outside;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  await expect(experience(page)).toHaveAttribute("data-dragging", "true");
  for (let i = 1; i <= 8; i++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - (travel * 0.5 * i) / 8, y }],
    });
  await expect.poll(() => progress(page)).toBeCloseTo(0.5, 2);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x - travel * 0.25, y }],
  });
  await expect.poll(() => progress(page)).toBeCloseTo(0.25, 2);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await page.waitForTimeout(250);
  expect(await progress(page)).toBeCloseTo(0.25, 2);
  await pose(page, 1);
  await page.screenshot({
    path: "artifacts/reference-rebuild/mobile-open.png",
    fullPage: true,
    ...noInspector,
  });
  const opened = await report(page, 1);
  const [ix, iy] = opened.grips.inside;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: ix, y: iy }],
  });
  await expect(experience(page)).toHaveAttribute("data-dragging", "true");
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: ix + travel, y: iy }],
  });
  await expect.poll(() => progress(page)).toBe(0);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.screenshot({
    path: "artifacts/reference-rebuild/mobile-closed.png",
    fullPage: true,
    ...noInspector,
  });
  await context.close();
});

test("student route hides the inspector, gates selections and exposes both chapters", async ({
  page,
}) => {
  await load(page, "");
  await expect(
    page.getByRole("complementary", {
      name: "Development mechanism inspector",
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /The Grand Mosque/ }),
  ).toBeDisabled();
  await page.getByRole("slider", { name: "Book opening", exact: true }).focus();
  await page.keyboard.press("End");
  await page.getByRole("button", { name: /The Grand Mosque/ }).click();
  await expect(
    page.getByRole("heading", { name: "Sheikh Zayed Grand Mosque" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Etihad Towers/ }).click();
  await expect(page.locator(".landmark-story")).toContainText(
    "Five sculptural towers",
  );
  await page.getByRole("button", { name: /Coast & gardens/ }).click();
  await expect(
    page.getByRole("heading", { name: "Abu Dhabi’s coastal gardens" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /The collection/ }).click();
  await expect(
    page.getByRole("button", { name: /02 Dubai EXPLORE/ }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: /03 Sharjah COMING LATER/ }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("slider", { name: "Book opening", exact: true }).focus();
  await page.keyboard.press("Home");
  expect(await progress(page)).toBe(0);
});

test("no-WebGL paper edition retains accessible landmark stories", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith("webgl") ? null : get.call(this, type, ...args);
    };
  });
  await page.goto("/");
  await expect(
    page.getByText("THE PAPER EDITION", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /The Grand Mosque/ }).click();
  await expect(
    page.getByRole("heading", { name: "Sheikh Zayed Grand Mosque" }),
  ).toBeVisible();
});

test("native mesh selection and lighter rendering retain the complete reference scene", async ({
  page,
}) => {
  await load(page, "");
  await page.getByRole("slider", { name: "Book opening", exact: true }).focus();
  await page.keyboard.press("End");
  await page.screenshot({
    path: "artifacts/reference-rebuild/picking-pose.png",
  });
  await page.mouse.click(790, 610);
  await expect(
    page.getByRole("heading", { name: "Sheikh Zayed Grand Mosque" }),
  ).toBeVisible();
  await page.screenshot({
    path: "artifacts/selected-landmark.png",
    fullPage: true,
  });
  await page.mouse.click(750, 300);
  await expect(
    page.getByRole("heading", { name: "Etihad Towers", exact: true }).last(),
  ).toBeVisible();
  await page.mouse.click(1030, 704);
  await expect(
    page.getByRole("heading", { name: "Abu Dhabi’s coastal gardens" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Experience settings" }).click();
  await page.getByRole("checkbox", { name: /Lighter rendering/ }).check();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.locator("canvas")).toBeVisible();
  expect(await progress(page)).toBe(1);
  await expect(
    page.getByText("THE PAPER EDITION", { exact: true }),
  ).toHaveCount(0);
});
