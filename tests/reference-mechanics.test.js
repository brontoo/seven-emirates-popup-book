import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  deployAngle,
  domeFanAngle,
  hingeQuaternion,
} from "../src/chapters/abuDhabi/mechanics.js";
test("gutter-limited standing panels stay inside the opening page wedge", () => {
  for (const [x, radius] of [
    [0.025, 2.1],
    [0.88, 1.7],
    [1.16, 2.54],
    [0.02, 3.83],
    [3.3, 1.6],
  ]) {
    let previous = 0;
    for (let i = 0; i <= 1000; i++) {
      const p = i / 1000,
        beta = deployAngle(p, x, radius);
      assert.ok(beta >= previous - 1e-12);
      assert.ok(beta >= 0 && beta <= Math.PI / 2);
      if (p < 0.5)
        assert.ok(radius * Math.sin(beta) <= x * Math.tan(Math.PI * p) + 1e-9);
      previous = beta;
    }
    assert.equal(deployAngle(0, x, radius), 0);
    assert.equal(deployAngle(1, x, radius), Math.PI / 2);
  }
});
test("dome ribs cannot pass down through their parallel-fold roof", () => {
  for (const [drum, radius] of [
    [0.2, 0.67],
    [0.12, 0.29],
    [0.075, 0.24],
    [0.09, 0.32],
  ])
    for (let i = 0; i <= 1000; i++) {
      const beta = ((i / 1000) * Math.PI) / 2,
        fan = domeFanAngle(beta, drum, radius);
      assert.ok(
        drum * Math.sin(beta) - radius * Math.sin(fan) * Math.cos(beta) >=
          -1e-10,
      );
    }
});
test("sloped architectural crease endpoints coincide through the full accordion fold", () => {
  const start = new THREE.Vector3(0, 0, 0),
    end = new THREE.Vector3(-0.12, 3.58, 0),
    corner = new THREE.Vector3(0.18, 0, 0);
  for (let i = 0; i <= 100; i++) {
    const q = hingeQuaternion(start.toArray(), end.toArray(), (i / 100) * 1.12);
    assert.ok(start.clone().applyQuaternion(q).distanceTo(start) < 1e-12);
    assert.ok(end.clone().applyQuaternion(q).distanceTo(end) < 1e-12);
    assert.ok(
      Math.abs(
        corner.clone().applyQuaternion(q).distanceTo(end) -
          corner.distanceTo(end),
      ) < 1e-12,
    );
  }
});
