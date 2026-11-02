import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import * as THREE from "three";
import { Paper, Block } from "../../landmarks/Paper";
import { PaperPanel } from "../../mechanisms/PopUpMechanism";
import { deployAngle } from "./mechanics";
export const DebugContext = createContext({});
export const palette = {
  ivory: "#f2e2bf",
  light: "#f6eace",
  edge: "#d9c59f",
  blue: "#a5bbc6",
  blueDark: "#8fa6b7",
  blueLight: "#b6cbd1",
  sage: "#aab99b",
  sageDark: "#82987e",
  water: "#b6d9da",
  waterDark: "#9fc8ce",
};
export function polygon(points) {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
}
export function slabShape(width, height, x = 0) {
  return polygon([
    [x, 0],
    [x + width, 0],
    [x + width, height],
    [x, height],
  ]);
}
const slabCache = new Map();
export function cachedSlab(width, height, x = 0) {
  const key = `${width}:${height}:${x}`;
  if (!slabCache.has(key)) slabCache.set(key, slabShape(width, height, x));
  return slabCache.get(key);
}
export function archHole(x, width, height, base = 0) {
  const h = new THREE.Path();
  h.moveTo(x - width / 2, base);
  h.lineTo(x - width / 2, base + height * 0.62);
  h.quadraticCurveTo(x - width / 2, base + height * 0.85, x, base + height);
  h.quadraticCurveTo(
    x + width / 2,
    base + height * 0.85,
    x + width / 2,
    base + height * 0.62,
  );
  h.lineTo(x + width / 2, base);
  h.closePath();
  return h;
}
export function Marker({ length = 0.4, axis = [1, 0, 0] }) {
  const debug = useContext(DebugContext);
  const axisGeometry = useMemo(
    () =>
      new Float32Array([
        0,
        0,
        0,
        ...new THREE.Vector3(...axis)
          .normalize()
          .multiplyScalar(length)
          .toArray(),
      ]),
    [length, ...axis],
  );
  return (
    <group userData={{ debugMarker: true }}>
      {debug.hinges && (
        <mesh renderOrder={20}>
          <sphereGeometry args={[0.033, 8, 6]} />
          <meshBasicMaterial color="#e39924" depthTest={false} />
        </mesh>
      )}
      {debug.axes && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[axisGeometry, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#c44936" depthTest={false} />
        </line>
      )}
      {debug.attachments && (
        <mesh
          position={[0, 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={20}
        >
          <ringGeometry args={[0.055, 0.073, 16]} />
          <meshBasicMaterial color="#2a9478" depthTest={false} />
        </mesh>
      )}
    </group>
  );
}
export function Assembly({
  id,
  page,
  position,
  nearest,
  height,
  direction = 1,
  progress,
  children,
}) {
  const beta = deployAngle(progress, nearest, height);
  return (
    <group
      name={`assembly-${id}-${page}`}
      position={position}
      userData={{ assembly: true, id, page, nearest, height, direction }}
    >
      <Marker />
      {children({ beta, fold: beta / (Math.PI / 2), direction })}
    </group>
  );
}
export function Standing({
  beta,
  direction = 1,
  position = [0, 0, 0],
  children,
}) {
  return (
    <group
      position={position}
      rotation={[direction * (Math.PI / 2 - beta), 0, 0]}
    >
      {children}
    </group>
  );
}
export function Selectable({ id, enabled, onSelect, children }) {
  return (
    <group
      name={`landmark-${id}`}
      onPointerDown={(e) => {
        if (enabled) e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (enabled) onSelect(id);
      }}
      onPointerOver={(e) => {
        if (enabled) {
          e.stopPropagation();
          e.nativeEvent.target.style.cursor = "pointer";
        }
      }}
      onPointerOut={(e) => {
        e.nativeEvent.target.style.cursor = "auto";
      }}
    >
      {children}
    </group>
  );
}
export function Tab({ width = 0.18, depth = 0.09, position = [0, 0.004, 0] }) {
  return (
    <Block
      position={[position[0], position[1], position[2] + depth / 2]}
      size={[width, 0.008, depth]}
      color={palette.edge}
    />
  );
}
export function InkLine({ points, color = "#8b8f8a", dashed = false }) {
  const g = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(...p)),
      ),
    [points],
  );
  const ref = useRef();
  useLayoutEffect(() => {
    if (dashed) ref.current.computeLineDistances();
  }, [g, dashed]);
  useEffect(() => () => g.dispose(), [g]);
  return (
    <line ref={ref} geometry={g}>
      {dashed ? (
        <lineDashedMaterial
          color={color}
          dashSize={0.065}
          gapSize={0.04}
          transparent
          opacity={0.55}
        />
      ) : (
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      )}
    </line>
  );
}
export function Panel({
  shape,
  color = palette.ivory,
  thickness = 0.009,
  edges = false,
  ...props
}) {
  return (
    <PaperPanel
      shape={shape}
      color={color}
      thickness={thickness}
      edges={edges}
      {...props}
    />
  );
}
export function Prototype({ page, progress }) {
  const shape = useMemo(() => {
    const s = slabShape(0.95, 1);
    s.holes.push(archHole(0.475, 0.22, 0.5, 0.08));
    return s;
  }, []);
  return page === "right" ? (
    <Assembly
      id="prototype"
      page={page}
      position={[1.1, 0.035, -0.55]}
      nearest={1.1}
      height={1.1}
      progress={progress}
    >
      {({ beta }) => (
        <>
          <Tab width={0.95} />
          <Standing beta={beta}>
            <Panel shape={shape} />
          </Standing>
        </>
      )}
    </Assembly>
  ) : null;
}
