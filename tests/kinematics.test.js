import test from "node:test";
import assert from "node:assert/strict";
import {
  solveVFold,
  tubeCorners,
  parallelTop,
  coverAngle,
  leafOffset,
  solveGlueBridge,
} from "../src/mechanisms/kinematics.js";
const distance = (a, b) => Math.hypot(...a.map((n, i) => n - b[i]));
test("V-fold has fixed edges at every intermediate angle and folds into the pages", () => {
  const reference = solveVFold(1);
  const edges = [
    ["origin", "left"],
    ["origin", "right"],
    ["origin", "ridge"],
    ["left", "ridge"],
    ["right", "ridge"],
  ];
  for (let step = 0; step <= 1000; step++) {
    const p = step / 1000,
      fold = solveVFold(p);
    for (const [a, b] of edges)
      assert.ok(
        Math.abs(
          distance(fold[a], fold[b]) - distance(reference[a], reference[b]),
        ) < 1e-9,
      );
    // Moving foot is exactly on the rotating left leaf, fixed foot on right.
    assert.ok(
      Math.abs(
        fold.left[0] * Math.sin(Math.PI * p) -
          fold.left[1] * Math.cos(Math.PI * p),
      ) < 1e-9,
    );
    assert.equal(fold.right[1], 0);
  }
  assert.ok(Math.abs(solveVFold(0).ridge[1]) < 1e-12);
  assert.ok(solveVFold(0.001).ridge[1] > 0);
  assert.ok(
    solveVFold(0.5).ridge[1] > 0 &&
      solveVFold(0.5).ridge[1] < solveVFold(1).ridge[1],
  );
});
test("tube sides preserve length and parallel-fold hinges preserve their radius", () => {
  for (let step = 0; step <= 100; step++) {
    const p = step / 100,
      c = tubeCorners(0.42, 0.3, p);
    assert.ok(Math.abs(distance(c[0], c[1]) - 0.42) < 1e-12);
    assert.ok(Math.abs(distance(c[1], c[2]) - 0.3) < 1e-12);
    assert.ok(Math.abs(Math.hypot(...parallelTop(2.6, p)) - 2.6) < 1e-12);
  }
  assert.deepEqual(
    tubeCorners(0.42, 0.3, 0).map((c) => c[1]),
    [0, 0, 0, 0],
  );
  assert.equal(coverAngle(0), -Math.PI);
  assert.equal(coverAngle(1), 0);
});
test("mechanisms retrace the identical path when opening is reversed", () => {
  const path = [0.0, 0.05, 0.35, 0.5, 0.6, 0.85, 1];
  const forward = path.map((p) => solveVFold(p));
  const reverse = [...path]
    .reverse()
    .map((p) => solveVFold(p))
    .reverse();
  assert.deepEqual(forward, reverse);
});

test("finite-thickness glue bridges preserve strip width and meet the moving page", () => {
  for (let i = 0; i <= 1000; i++) {
    const p = i / 1000,
      bridge = solveGlueBridge(p);
    assert.ok(Math.abs(Math.hypot(...bridge.mid) - 0.12) < 1e-12);
    assert.ok(Math.abs(distance(bridge.mid, bridge.offset) - 0.12) < 1e-12);
    assert.deepEqual(bridge.offset, leafOffset(p));
    assert.ok(
      bridge.mid[1] >= -1e-12,
      "glue tabs must fold above the fixed page",
    );
  }
  assert.deepEqual(leafOffset(0), [-0, 0.16, 0]);
  assert.ok(Math.hypot(...leafOffset(1)) < 1e-12);
});
