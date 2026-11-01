// All lengths are fixed. Only hinge angles change; no scale or spring/timeline state.
export const clamp01 = (value) => Math.max(0, Math.min(1, value));
export const bookAngle = (progress) => Math.PI * clamp01(progress);
export const coverAngle = (progress) => bookAngle(progress) - Math.PI;
export const standingAngle = (progress) => (Math.PI / 2) * clamp01(progress);

/**
 * Symmetric V-fold with two triangular rigid wings sharing O--R.
 * Page creases O--A and O--B make delta=30° with the binding (Z).
 * Each wing's fixed included angle is gamma=60°.
 * R is the positive intersection of the unit sphere and the two crease cones.
 * At closure R points along +X, flat between the pages. At full opening it
 * points upward, without changing OA, OB, OR, AR, or BR.
 */
export function solveVFold(
  progress,
  { base = 1.05, ridge = 1.35, delta = Math.PI / 6 } = {},
) {
  const alpha = bookAngle(progress),
    gamma = Math.PI / 2 - delta;
  const s = Math.sin(delta),
    c = Math.cos(delta),
    u = s * Math.cos(alpha / 2);
  const radius2 = u * u + c * c,
    projection = Math.cos(gamma);
  const radical = Math.sqrt(Math.max(0, radius2 - projection * projection));
  const k = (projection * u + c * radical) / radius2;
  const z = (projection * c - u * radical) / radius2;
  return {
    origin: [0, 0, 0],
    left: [base * s * Math.cos(alpha), base * s * Math.sin(alpha), base * c],
    right: [base * s, 0, base * c],
    ridge: [
      ridge * k * Math.cos(alpha / 2),
      ridge * k * Math.sin(alpha / 2),
      ridge * z,
    ],
  };
}

// Four-panel tube: every edge keeps its length while its cross-section flattens.
export function tubeCorners(width, depth, progress) {
  const phi = standingAngle(progress),
    dx = depth * Math.cos(phi),
    dz = depth * Math.sin(phi);
  return [
    [-width / 2, 0],
    [width / 2, 0],
    [width / 2 + dx, dz],
    [-width / 2 + dx, dz],
  ];
}
// A parallel-fold's top hinge is constrained by the rigid side panel length.
export function parallelTop(height, progress) {
  const beta = standingAngle(progress);
  return [0, height * Math.sin(beta), height * Math.cos(beta)];
}

// Finite-thickness clearance: shift the left leaf along its outward normal.
// This creates a real 0.16-unit cavity for the collapsed cardstock at closure.
export function leafOffset(progress, clearance = 0.16) {
  const p = clamp01(progress),
    alpha = bookAngle(p),
    gap = clearance * (1 - p);
  return [-gap * Math.sin(alpha), gap * Math.cos(alpha), 0];
}
// Two rigid glue-tab strips bridge the finite spine gap. Each strip is 0.12
// units wide and folds about the V-fold's base crease; no tab stretches.
export function solveGlueBridge(progress, delta = Math.PI / 6, length = 0.12) {
  const p = clamp01(progress),
    a = bookAngle(p),
    offset = leafOffset(p);
  const tangent = [
    Math.sin(delta) * Math.cos(a),
    Math.sin(delta) * Math.sin(a),
    Math.cos(delta),
  ];
  const normal = [-Math.sin(a), Math.cos(a), 0];
  const perpendicular = [
    tangent[1] * normal[2] - tangent[2] * normal[1],
    tangent[2] * normal[0] - tangent[0] * normal[2],
    tangent[0] * normal[1] - tangent[1] * normal[0],
  ];
  const halfGap = Math.hypot(...offset) / 2,
    reach = Math.sqrt(Math.max(0, length * length - halfGap * halfGap));
  return {
    offset,
    mid: offset.map((v, i) => v / 2 - perpendicular[i] * reach),
  };
}
