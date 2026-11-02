import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { pageTurnPose } from "../src/book/pageTurn.js";
test("both chapter directions fold the old scene before swapping and deploy the next", () => {
  for (const [from, to] of [
    [0, 1],
    [1, 0],
  ])
    for (let i = 0; i <= 1000; i++) {
      const progress = i / 1000,
        pose = pageTurnPose({ active: true, from, to, progress });
      assert.equal(pose.chapter, progress < 0.5 ? from : to);
      assert.ok(pose.unfold >= 0 && pose.unfold <= 1);
      assert.ok(pose.leafAngle >= 0 && pose.leafAngle <= Math.PI);
      assert.ok(
        pose.leftAngle >= -Math.PI / 2 - 1e-12 && pose.leftAngle <= 1e-12,
      );
      assert.ok(pose.rightAngle >= 0 && pose.rightAngle <= Math.PI / 2 + 1e-12);
      if (progress === 0.5) assert.equal(pose.unfold, 0);
    }
});
test("the moving old front or new back stays attached to the actual turning sheet", () => {
  for (const [from, to] of [
    [0, 1],
    [1, 0],
  ])
    for (let i = 0; i <= 100; i++) {
      const p = pageTurnPose({ active: true, from, to, progress: i / 100 });
      for (const distance of [0.1, 2.18, 4.3]) {
        const leaf = new THREE.Vector3(distance, 0, 0).applyAxisAngle(
          new THREE.Vector3(0, 0, 1),
          p.leafAngle,
        );
        const chapter =
          p.movingSide === "right"
            ? new THREE.Vector3(distance, 0, 0).applyAxisAngle(
                new THREE.Vector3(0, 0, 1),
                p.rightAngle,
              )
            : new THREE.Vector3(-distance, 0, 0).applyAxisAngle(
                new THREE.Vector3(0, 0, 1),
                p.leftAngle,
              );
        assert.ok(leaf.distanceTo(chapter) < 1e-10);
        assert.ok(leaf.y >= -1e-12);
      }
    }
});
test("idle chapters remain completely deployed without starting an animation", () => {
  assert.deepEqual(pageTurnPose({ active: false, progress: 0 }, 0), {
    chapter: 0,
    unfold: 1,
    leafAngle: 0,
    leftAngle: 0,
    rightAngle: 0,
    movingSide: null,
  });
  assert.equal(pageTurnPose({ active: false, progress: 1 }, 1).chapter, 1);
});
