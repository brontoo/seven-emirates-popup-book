import { spawn } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { chromium, expect } from "@playwright/test";
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4174",
    "--strictPort",
  ],
  { stdio: "pipe" },
);
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch("http://127.0.0.1:4174")).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  assert.ok(ready, "production preview did not start");
  const files = await readdir("dist/assets");
  for (const file of files.filter((f) => f.endsWith(".js"))) {
    const content = await readFile("dist/assets/" + file, "utf8");
    assert.ok(
      !content.includes("Inspector book opening"),
      "development inspector leaked into production JS",
    );
  }
  browser = await chromium.launch({
    executablePath:
      process.env.CHROMIUM_PATH ||
      (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    headless: true,
    args: [
      "--no-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4174/?inspect&stage=a");
  await expect(page.locator(".experience")).toHaveAttribute(
    "data-scene-ready",
    "true",
    { timeout: 45000 },
  );
  await expect(
    page.getByRole("complementary", {
      name: "Development mechanism inspector",
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Reset to closed" }),
  ).toHaveCount(0);
  await page.getByRole("slider", { name: "Book opening", exact: true }).focus();
  await page.keyboard.press("End");
  await page.screenshot({
    path: "artifacts/reference-rebuild/production.png",
    fullPage: true,
  });
  await page.mouse.click(790, 610);
  await expect(
    page.getByRole("heading", { name: "Sheikh Zayed Grand Mosque" }),
  ).toBeVisible();
  assert.deepEqual(errors, []);
  console.log(
    "Production: complete Abu Dhabi scene renders; inspector and stage override are excluded.",
  );
} finally {
  if (browser) await browser.close();
  server.kill();
}
