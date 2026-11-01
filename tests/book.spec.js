import { test, expect } from "@playwright/test";
const experience = (p) => p.locator(".experience");
const progress = async (p) =>
  Number(await experience(p).getAttribute("data-book-progress"));
async function load(page) {
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(experience(page)).toHaveAttribute("data-scene-ready", "true", {
    timeout: 45000,
  });
  await expect(
    page.getByRole("slider", { name: "Book opening" }),
  ).toHaveAttribute("aria-valuenow", "0");
}
async function keyboard(page, value) {
  await page.getByRole("slider", { name: "Book opening" }).focus();
  await page.keyboard.press("Home");
  for (let i = 0; i < Math.round(value * 20); i++)
    await page.keyboard.press("ArrowRight");
}

test("initial book stays closed; clicking does not open; dragging tracks, holds and reverses", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await load(page);
  await page.waitForTimeout(1200);
  expect(await progress(page)).toBe(0); // Explicit no-autoplay acceptance check.
  await page.mouse.click(800, 430);
  expect(await progress(page)).toBe(0);
  await expect(
    page.getByRole("button", { name: /The Grand Mosque/ }),
  ).toBeDisabled();
  await page.screenshot({
    path: "artifacts/mechanical-closed.png",
    fullPage: true,
  });
  await page.screenshot({ path: "artifacts/closed-book.png", fullPage: true });
  await page.mouse.move(800, 430);
  await page.mouse.down();
  await expect(experience(page)).toHaveAttribute("data-dragging", "true");
  // 1440px canvas: one full revolution uses 48% of its width.
  await page.mouse.move(558.08, 430, { steps: 8 });
  expect(await progress(page)).toBeCloseTo(0.35, 3);
  await page.mouse.up();
  await expect(experience(page)).toHaveAttribute("data-dragging", "false");
  const held = await progress(page);
  await page.waitForTimeout(500);
  expect(await progress(page)).toBe(held);
  await page.screenshot({
    path: "artifacts/mechanical-35.png",
    fullPage: true,
  });
  // Keyboard is a continuous accessible alternative, never a click-to-open trigger.
  for (const value of [0.5, 0.6, 0.85, 1]) {
    await keyboard(page, value);
    expect(await progress(page)).toBeCloseTo(value, 3);
    await page.screenshot({
      path: `artifacts/mechanical-${Math.round(value * 100)}.png`,
      fullPage: true,
    });
    if (value === 1)
      await page.screenshot({ path: "artifacts/desktop.png", fullPage: true });
  }
  await expect(
    page.getByRole("button", { name: /The Grand Mosque/ }),
  ).toBeEnabled();
  await page.getByRole("button", { name: /The Grand Mosque/ }).click();
  await expect(
    page.getByRole("heading", { name: "Sheikh Zayed Grand Mosque" }),
  ).toBeVisible();
  await page.screenshot({
    path: "artifacts/selected-landmark.png",
    fullPage: true,
  });
  // Return to the 3D book, capture its inside cover and close in one gesture.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(430, 475);
  await page.mouse.down();
  await expect(experience(page)).toHaveAttribute("data-dragging", "true");
  await page.mouse.move(775.6, 475, { steps: 10 });
  expect(await progress(page)).toBeCloseTo(0.5, 3);
  await page.mouse.move(500, 475, { steps: 8 });
  expect(await progress(page)).toBeGreaterThan(0.8); // Reverse within the same held gesture.
  await page.mouse.move(1125, 475, { steps: 12 });
  await page.mouse.up();
  expect(await progress(page)).toBe(0);
  await page.waitForTimeout(300);
  expect(await progress(page)).toBe(0);
  expect(errors).toEqual([]);
});

test("captured pointer keeps opening after it leaves the cover; cancellation holds the angle", async ({
  page,
}) => {
  await load(page);
  await page.mouse.move(800, 430);
  await page.mouse.down();
  await page.mouse.move(108, 700, { steps: 16 });
  expect(await progress(page)).toBe(1);
  await page.mouse.up();
  await expect(experience(page)).toHaveAttribute("data-dragging", "false");
  await keyboard(page, 0);
  await page.mouse.move(800, 430);
  await page.mouse.down();
  await page.mouse.move(627.2, 430, { steps: 6 });
  await page.locator("canvas").dispatchEvent("pointercancel", { pointerId: 1 });
  expect(await progress(page)).toBeCloseTo(0.25, 3);
  await expect(experience(page)).toHaveAttribute("data-dragging", "false");
});

test("touch pointer capture, reverse drag, reduced motion and mobile layout", async ({
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
  const client = await context.newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 238, y: 470 }],
  });
  await expect(experience(page)).toHaveAttribute("data-dragging", "true");
  const travel = Math.max(
    200,
    (await page.locator("canvas").boundingBox()).width * 0.48,
  );
  for (let i = 1; i <= 8; i++)
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 238 - (i * travel * 0.5) / 8, y: 470 }],
    });
  await expect.poll(() => progress(page)).toBeCloseTo(0.5, 2);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 238 - travel * 0.35, y: 470 }],
  });
  await expect.poll(() => progress(page)).toBeCloseTo(0.35, 2);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 238 - travel * 0.5, y: 470 }],
  });
  await expect.poll(() => progress(page)).toBeCloseTo(0.5, 2);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  const held = await progress(page);
  await page.waitForTimeout(250);
  expect(await progress(page)).toBe(held);
  await page.screenshot({
    path: "artifacts/mechanical-mobile-half.png",
    fullPage: true,
  });
  await keyboard(page, 1);
  await page.screenshot({
    path: "artifacts/mechanical-mobile-open.png",
    fullPage: true,
  });
  await page.screenshot({ path: "artifacts/mobile.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.getByRole("button", { name: "Experience settings" }).click();
  await expect(
    page.getByRole("checkbox", { name: /Reduced motion/ }),
  ).toBeChecked();
  await page.getByRole("checkbox", { name: /Lighter rendering/ }).check();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await keyboard(page, 0);
  await page.screenshot({
    path: "artifacts/mechanical-mobile-closed.png",
    fullPage: true,
  });
  await context.close();
});

test("chapters change only when safely closed, then unfold with the same controller", async ({
  page,
}) => {
  await load(page);
  await keyboard(page, 0.5);
  await expect(
    page.getByRole("button", { name: "Next chapter", exact: true }),
  ).toBeDisabled();
  await keyboard(page, 0);
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  expect(await progress(page)).toBe(0);
  await expect(page.locator(".chapter-identity h2")).toContainText("Dubai");
  await keyboard(page, 1);
  await page.getByRole("button", { name: /Dubai skyline study/ }).click();
  await expect(
    page.getByRole("heading", { name: "A study of Dubai" }),
  ).toBeVisible();
  await keyboard(page, 0);
  await page.getByRole("button", { name: "Previous chapter" }).click();
  await expect(page.locator(".chapter-identity h2")).toContainText("Abu Dhabi");
});

test("no-WebGL fallback preserves stories and navigation", async ({ page }) => {
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
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await expect(page.locator(".chapter-identity h2")).toContainText("Dubai");
});

test("3D landmark picking takes priority over the cover behind it", async ({
  page,
}) => {
  await load(page);
  await keyboard(page, 1);
  // Wait for the final rendered pose before targeting actual mesh pixels.
  await page.screenshot({ path: "artifacts/mechanical-picking-pose.png" });
  await page.mouse.click(615, 360);
  await expect(
    page.getByRole("heading", { name: "Sheikh Zayed Grand Mosque" }),
  ).toBeVisible();
  await expect(experience(page)).toHaveAttribute("data-dragging", "false");
  await page.mouse.click(910, 350);
  await expect(page.locator(".landmark-story")).toContainText(
    "Five sculptural towers",
  );
  await page.mouse.click(770, 535);
  await expect(
    page.getByRole("heading", { name: "Mangrove National Park" }),
  ).toBeVisible();
  expect(await progress(page)).toBe(1);
});
