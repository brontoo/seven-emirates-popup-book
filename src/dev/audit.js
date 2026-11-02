import * as THREE from "three";
import { leafOffset } from "../mechanisms/kinematics.js";

// Inspect actual rendered mesh vertices, including every instanced dome rib.
// This checks the book's two interior half-spaces and closed cover envelope;
// it deliberately does not claim general sheet-to-sheet collision detection.
export function auditBook(book, progress, camera, rect) {
  book.updateWorldMatrix(true, true);
  const inverse = book.matrixWorld.clone().invert(),
    point = new THREE.Vector3(),
    instance = new THREE.Matrix4(),
    matrix = new THREE.Matrix4();
  const offset = new THREE.Vector3(...leafOffset(progress));
  const alpha = Math.PI * progress;
  const normal = new THREE.Vector3(Math.sin(alpha), -Math.cos(alpha), 0);
  let assemblies = 0,
    vertices = 0,
    pageViolations = 0,
    coverViolations = 0,
    minClearance = Infinity;
  const failures = {};
  const scan = (node, owner) => {
    if (node.userData.debugMarker) return;
    if (node.userData.assembly) {
      assemblies++;
      owner = node.name;
    }
    if (owner && node.isMesh && node.geometry?.attributes.position) {
      const positions = node.geometry.attributes.position;
      const instances = node.isInstancedMesh ? node.count : 1;
      for (let inst = 0; inst < instances; inst++) {
        matrix.copy(node.matrixWorld);
        if (node.isInstancedMesh) {
          node.getMatrixAt(inst, instance);
          matrix.multiply(instance);
        }
        matrix.premultiply(inverse);
        // All distinct polygon corners are represented; no bounding-box substitution.
        for (let i = 0; i < positions.count; i++) {
          point.fromBufferAttribute(positions, i).applyMatrix4(matrix);
          vertices++;
          const other = normal.dot(point.clone().sub(offset));
          const clearance = Math.min(point.y, other);
          minClearance = Math.min(minClearance, clearance);
          if (clearance < -0.018) {
            pageViolations++;
            failures[owner] = (failures[owner] || 0) + 1;
          }
          if (
            progress < 1e-6 &&
            (point.x < -0.075 ||
              point.x > 4.445 ||
              Math.abs(point.z) > 2.81 ||
              point.y < -0.018 ||
              point.y > 0.178)
          ) {
            coverViolations++;
            failures[owner] = (failures[owner] || 0) + 1;
          }
        }
      }
    }
    node.children.forEach((child) => scan(child, owner));
  };
  scan(book, null);
  const screenPoint = (name, coordinates) => {
    const object = book.getObjectByName(name);
    const point = new THREE.Vector3(...coordinates)
      .applyMatrix4(object.matrixWorld)
      .project(camera);
    return [
      rect.left + ((point.x + 1) * rect.width) / 2,
      rect.top + ((1 - point.y) * rect.height) / 2,
    ];
  };
  const grips =
    camera && rect
      ? {
          outside: screenPoint("front-cover", [-3.5, -0.276, 0.4]),
          inside: screenPoint("moving-leaf", [-4.32, 0.025, 0.3]),
        }
      : null;
  return {
    progress: Number(progress.toFixed(4)),
    grips,
    assemblies,
    vertices,
    pageViolations,
    coverViolations,
    minClearance: Number(minClearance.toFixed(5)),
    failures,
  };
}
