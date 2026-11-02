import * as THREE from "three";
import { clamp01 } from "../../mechanisms/kinematics.js";

// A rigid page-mounted assembly must remain inside the two page half-spaces.
// Limit its standing angle by the available wedge at its nearest gutter edge.
export function deployAngle(progress, nearestGutter, radius) {
  const p = clamp01(progress),
    target = (p * Math.PI) / 2;
  if (p >= 0.5) return target;
  const allowed =
    (0.72 * Math.max(0.012, nearestGutter) * Math.tan(Math.PI * p)) / radius;
  return Math.min(target, Math.asin(Math.min(1, Math.max(0, allowed))));
}
export function domeFanAngle(beta, drum, radius) {
  if (beta >= Math.PI / 2 - 1e-8) return Math.PI / 2;
  // The lowest point of every rib must remain above its supporting roof.
  return Math.min(
    beta,
    Math.asin(Math.min(1, ((0.92 * drum) / radius) * Math.tan(beta))),
  );
}
export const STAGES = [
  ["a", "A · Single façade"],
  ["b", "B · Mosque"],
  ["c", "C · Towers"],
  ["d", "D · Landscape"],
  ["e", "E · Complete"],
];
export const stageIncludes = (stage, threshold) =>
  "abcde".indexOf(stage) >= "abcde".indexOf(threshold);

export function hingeQuaternion(start, end, angle) {
  return new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(...end).sub(new THREE.Vector3(...start)).normalize(),
    angle,
  );
}
