import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Edges } from "@react-three/drei";
import { Paper, Block } from "../landmarks/Paper";
import {
  solveVFold,
  solveGlueBridge,
  standingAngle,
  tubeCorners,
  parallelTop,
} from "./kinematics";

export function PaperPanel({
  shape,
  color = "#eee6d2",
  thickness = 0.014,
  edges = true,
  ...props
}) {
  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: thickness,
        bevelEnabled: false,
      }),
    [shape, thickness],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} castShadow receiveShadow {...props}>
      <Paper color={color} />
      {edges && (
        <Edges threshold={25} color="#a69c81" transparent opacity={0.25} />
      )}
    </mesh>
  );
}
export function RectanglePanel({ width, height, color, ...props }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-width / 2, 0);
    s.lineTo(width / 2, 0);
    s.lineTo(width / 2, height);
    s.lineTo(-width / 2, height);
    s.closePath();
    return s;
  }, [width, height]);
  return <PaperPanel shape={shape} color={color} {...props} />;
}
export function Hinge({ progress, position = [0, 0, 0], children }) {
  return (
    <group
      position={position}
      rotation={[Math.PI / 2 - standingAngle(progress), 0, 0]}
    >
      {children}
    </group>
  );
}
export function Crease({ width = 0.5, position = [0, 0.01, 0] }) {
  return (
    <Block position={position} size={[width, 0.005, 0.009]} color="#b1a58b" />
  );
}
function Triangle({ points, color }) {
  const geometry = useMemo(() => {
    const a = new THREE.Vector3(...points[0]),
      b = new THREE.Vector3(...points[1]),
      c = new THREE.Vector3(...points[2]);
    const normal = new THREE.Vector3()
      .crossVectors(b.clone().sub(a), c.clone().sub(a))
      .normalize()
      .multiplyScalar(0.004);
    const vertices = [a, b, c]
      .flatMap((p) => p.clone().add(normal).toArray())
      .concat([a, b, c].flatMap((p) => p.clone().sub(normal).toArray()));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    g.setIndex([
      0, 1, 2, 5, 4, 3, 0, 3, 4, 0, 4, 1, 1, 4, 5, 1, 5, 2, 2, 5, 3, 2, 3, 0,
    ]);
    g.computeVertexNormals();
    return g;
  }, [points]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <Paper color={color} side={THREE.DoubleSide} />
      <Edges color="#9d9b7f" transparent opacity={0.5} />
    </mesh>
  );
}
export function VFold({
  progress,
  base = 1.05,
  ridge = 1.35,
  position = [0, 0.02, -0.3],
}) {
  const f = solveVFold(progress, { base, ridge }),
    bridge = solveGlueBridge(progress);
  const add = (a, b) => a.map((v, i) => v + b[i]);
  const m = bridge.mid,
    d = bridge.offset,
    a = f.left;
  return (
    <group position={position} name="constrained-v-fold">
      <Triangle points={[f.origin, f.left, f.ridge]} color="#d8d2b5" />
      <Triangle points={[f.origin, f.ridge, f.right]} color="#c9cbb1" />
      {/* Accordion glue tabs connect to the offset left page with fixed strip widths. */}
      <Triangle points={[f.origin, a, add(a, m)]} color="#e0d7bf" />
      <Triangle points={[f.origin, add(a, m), m]} color="#e0d7bf" />
      <Triangle points={[m, add(a, m), add(a, d)]} color="#d2c9ad" />
      <Triangle points={[m, add(a, d), d]} color="#d2c9ad" />
      <mesh
        position={[base * 0.25, 0.003, base * 0.433]}
        rotation={[-Math.PI / 2, 0, Math.PI / 6]}
      >
        <planeGeometry args={[0.08, base]} />
        <Paper color="#ddd6bd" />
      </mesh>
    </group>
  );
}
export function FoldingTube({
  progress,
  width = 0.4,
  depth = 0.27,
  height = 2,
  color = "#9daea6",
  position = [0, 0, 0],
}) {
  const corners = tubeCorners(width, depth, progress);
  return (
    <group position={position}>
      <Crease width={width + depth} />
      <Hinge progress={progress}>
        {corners.map(([x, z], i) => {
          const b = corners[(i + 1) % 4];
          const length = i % 2 ? depth : width;
          const angle = -Math.atan2(b[1] - z, b[0] - x);
          return (
            <group
              key={i}
              position={[(x + b[0]) / 2, 0, (z + b[1]) / 2 + i * 0.002]}
              rotation={[0, angle, 0]}
            >
              <RectanglePanel
                width={length}
                height={height}
                color={i % 2 ? "#c0c8b5" : color}
              />
              {[0.22, 0.43, 0.64, 0.84].map((t) => (
                <Block
                  key={t}
                  position={[0, height * t, 0.019]}
                  size={[length, 0.009, 0.006]}
                  color="#d8d9c5"
                />
              ))}
            </group>
          );
        })}
      </Hinge>
    </group>
  );
}
// A real four-bar parallel fold. The top remains parallel to the page because
// two equal-length hinged walls share its front and rear edges.
export function ParallelFold({
  progress,
  width,
  height,
  depth,
  position,
  children,
  color = "#ece3cf",
}) {
  const top = parallelTop(height, progress);
  return (
    <group position={position} name="parallel-fold">
      <Crease width={width} />
      <Crease width={width} position={[0, 0.01, depth]} />
      {[0, depth].map((z) => (
        <Hinge key={z} progress={progress} position={[0, 0, z]}>
          <RectanglePanel width={width} height={height} color={color} />
        </Hinge>
      ))}
      <group position={top}>
        <Block
          position={[0, 0.006, depth / 2]}
          size={[width, 0.012, depth]}
          color={color}
        />
        {children}
      </group>
    </group>
  );
}
