import { useMemo } from "react";
import * as THREE from "three";
import {
  PaperPanel,
  RectanglePanel,
  Hinge,
  Crease,
  FoldingTube,
  ParallelFold,
} from "../mechanisms/PopUpMechanism";
import { standingAngle } from "../mechanisms/kinematics";
import { Block } from "./Paper";

function Selectable({ id, enabled, onSelect, children }) {
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
function onionShape(radius, height) {
  const s = new THREE.Shape();
  s.moveTo(-radius, 0);
  s.bezierCurveTo(
    -radius * 1.35,
    height * 0.45,
    -radius * 0.22,
    height * 0.62,
    0,
    height,
  );
  s.bezierCurveTo(
    radius * 0.22,
    height * 0.62,
    radius * 1.35,
    height * 0.45,
    radius,
    0,
  );
  s.closePath();
  return s;
}
function DomeFan({ progress, radius = 0.4, height = 0.57, position }) {
  const shape = useMemo(() => onionShape(radius, height), [radius, height]);
  // Each onion silhouette is a rigid cardstock lamella hinged on its centre line.
  return (
    <group position={position}>
      {[-1, -0.5, 0, 0.5, 1].map((factor, i) => (
        <group key={i} rotation={[0, factor * standingAngle(progress), 0]}>
          <PaperPanel
            shape={shape}
            color={i % 2 ? "#f3edda" : "#e8dfc9"}
            thickness={0.008}
          />
        </group>
      ))}
    </group>
  );
}
function Arcade({ width = 2.5, count = 9 }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-width / 2, 0);
    s.lineTo(width / 2, 0);
    s.lineTo(width / 2, 0.42);
    s.lineTo(-width / 2, 0.42);
    s.closePath();
    for (let i = 0; i < count; i++) {
      const x = -width / 2 + ((i + 0.5) * width) / count,
        w = (width / count) * 0.33;
      const h = new THREE.Path();
      h.moveTo(x - w, 0);
      h.lineTo(x - w, 0.19);
      h.quadraticCurveTo(x - w, 0.3, x, 0.34);
      h.quadraticCurveTo(x + w, 0.3, x + w, 0.19);
      h.lineTo(x + w, 0);
      h.closePath();
      s.holes.push(h);
    }
    return s;
  }, [width, count]);
  return <PaperPanel shape={shape} color="#f4ecd6" />;
}
function Minaret({ progress, position }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const pts = [
      [-0.075, 0],
      [0.075, 0],
      [0.075, 0.62],
      [0.11, 0.62],
      [0.11, 0.68],
      [0.05, 0.68],
      [0.05, 1.1],
      [0.08, 1.1],
      [0.08, 1.16],
      [0.029, 1.16],
      [0.029, 1.36],
      [0, 1.56],
      [-0.029, 1.36],
      [-0.029, 1.16],
      [-0.08, 1.16],
      [-0.08, 1.1],
      [-0.05, 1.1],
      [-0.05, 0.68],
      [-0.11, 0.68],
      [-0.11, 0.62],
      [-0.075, 0.62],
    ];
    pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
    s.closePath();
    return s;
  }, []);
  return (
    <group position={position}>
      <Crease width={0.25} />
      <Hinge progress={progress}>
        {[0, 1].map((i) => (
          <group key={i} rotation={[0, i * standingAngle(progress), 0]}>
            <PaperPanel
              shape={shape}
              color={i ? "#ddd5bf" : "#f6efdd"}
              thickness={0.009}
            />
          </group>
        ))}
      </Hinge>
    </group>
  );
}
export function FoldableMosque({ progress, ...props }) {
  return (
    <Selectable id="mosque" {...props}>
      <Block
        position={[0, 0.008, 0.05]}
        size={[3.06, 0.014, 2.35]}
        color="#e3dac3"
      />
      <ParallelFold
        progress={progress}
        width={1.04}
        height={0.61}
        depth={0.58}
        position={[0, 0.027, -0.78]}
      >
        <Hinge progress={progress} position={[0, 0.008, 0.27]}>
          <DomeFan
            progress={progress}
            radius={0.45}
            height={0.67}
            position={[0, 0, 0]}
          />
        </Hinge>
      </ParallelFold>
      {[-1, 1].map((x) => (
        <group key={x}>
          <ParallelFold
            progress={progress}
            width={0.62}
            height={0.4}
            depth={0.42}
            position={[x * 0.86, 0.023, -0.63]}
          >
            <Hinge progress={progress} position={[0, 0.008, 0.21]}>
              <DomeFan
                progress={progress}
                radius={0.26}
                height={0.39}
                position={[0, 0, 0]}
              />
            </Hinge>
          </ParallelFold>
          {[-0.98, 0.65].map((z) => (
            <Minaret
              key={z}
              progress={progress}
              position={[x * 1.32, 0.03, z]}
            />
          ))}
        </group>
      ))}
      {[-0.78, 0.71].map((z, i) => (
        <group key={z} position={[0, 0.024, z]}>
          <Crease width={2.59} />
          <Hinge progress={progress}>
            <Arcade width={2.59} />
            {[-0.98, -0.65, -0.32, 0, 0.32, 0.65, 0.98].map((x) => (
              <DomeFan
                key={x}
                progress={progress}
                radius={0.12}
                height={0.17}
                position={[x, 0.42, 0]}
              />
            ))}
          </Hinge>
        </group>
      ))}
      {[-1, 1].map((x) => (
        <group key={x} position={[x * 1.2, 0.024, 0]} rotation={[0, 0, 0]}>
          <Hinge progress={progress}>
            <RectanglePanel width={0.065} height={0.5} color="#ddd2b8" />
          </Hinge>
        </group>
      ))}
    </Selectable>
  );
}
export function FoldableTowers({ progress, ...props }) {
  return (
    <Selectable id="towers" {...props}>
      <Block
        position={[0, 0.008, 0.45]}
        size={[1.63, 0.014, 3.02]}
        color="#e0d8c0"
      />
      {[
        [-0.52, -0.8, 2.2, 0.32],
        [-0.02, -1.1, 2.72, 0.36],
        [0.49, -0.67, 2.43, 0.33],
        [-0.5, -0.03, 1.72, 0.28],
        [0.12, 0.07, 1.92, 0.31],
      ].map(([x, z, h, w], i) => (
        <FoldingTube
          key={i}
          progress={progress}
          position={[x, 0.025 + i * 0.007, z]}
          height={h}
          width={w}
          depth={w * 0.63}
          color={["#a1b2aa", "#829d9b", "#b7bca8", "#9aafa8", "#aabdb0"][i]}
        />
      ))}
    </Selectable>
  );
}
function Canopy({ progress, position, scale = 1 }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2,
        r = 0.28 + 0.025 * Math.sin(7 * a);
      const x = r * Math.cos(a),
        y = 0.5 + r * 0.85 * Math.sin(a);
      i ? s.lineTo(x, y) : s.moveTo(x, y);
    }
    s.closePath();
    return s;
  }, []);
  return (
    <group position={position} scale={scale}>
      <Crease width={0.28} />
      <Hinge progress={progress}>
        <RectanglePanel width={0.028} height={0.52} color="#918062" />
        {[-1, 0, 1].map((x, i) => (
          <group key={i} rotation={[0, x * standingAngle(progress) * 0.65, 0]}>
            <PaperPanel
              shape={shape}
              color={["#839875", "#a5af87", "#6d8b71"][i]}
              thickness={0.01}
            />
            <RectanglePanel width={0.018} height={0.45} color="#928264" />
          </group>
        ))}
      </Hinge>
    </group>
  );
}
function Water({ progress, index, color }) {
  const { shape, minY } = useMemo(() => {
    const points = Array.from({ length: 65 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2,
        r = 1 + 0.04 * Math.sin(5 * a);
      return [
        Math.cos(a) * r * (1.17 - index * 0.055),
        Math.sin(a) * r * (0.59 - index * 0.035),
      ];
    });
    const minY = Math.min(...points.map((p) => p[1]));
    const shape = new THREE.Shape();
    points.forEach(([x, y], i) => {
      const lifted = Math.max(0, y - minY - 0.04);
      i ? shape.lineTo(x, lifted) : shape.moveTo(x, lifted);
    });
    shape.closePath();
    return { shape, minY };
  }, [index]);
  const shore = -0.2 - minY - 0.04;
  // Fixed shoreline crease: flat at both endpoints, small reversible fan in between.
  return (
    <>
      <Crease width={0.3} position={[0, 0.012 + index * 0.012, shore]} />
      <group
        position={[0, 0.012 + index * 0.012, shore]}
        rotation={[
          -Math.PI / 2 + Math.sin(Math.PI * progress) * index * 0.025,
          0,
          0,
        ]}
      >
        <PaperPanel shape={shape} color={color} thickness={0.012} />
      </group>
    </>
  );
}
export function FoldableMangroves({ progress, ...props }) {
  return (
    <Selectable id="mangroves" {...props}>
      {["#c0cbb8", "#9ebdb2", "#79a39a", "#b1c6b8"].map((c, i) => (
        <Water key={c} progress={progress} index={i} color={c} />
      ))}
      {[
        [-0.78, -0.43, 0.82],
        [-0.39, -0.56, 1.05],
        [0.04, -0.59, 1.12],
        [0.44, -0.48, 0.95],
        [0.78, -0.32, 0.7],
        [-0.24, -0.12, 0.78],
        [0.32, -0.12, 0.82],
      ].map(([x, z, s], i) => (
        <Canopy
          key={i}
          progress={progress}
          position={[x, 0.06 + i * 0.006, z]}
          scale={s}
        />
      ))}
    </Selectable>
  );
}
export function FoldableDubai({ progress, ...props }) {
  return (
    <Selectable id="burj" {...props}>
      <Block
        size={[2.5, 0.015, 3]}
        position={[0, 0.007, 0.35]}
        color="#ded5bd"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Hinge
          key={i}
          progress={progress}
          position={[0, 0.018 + i * 0.003, -0.9]}
        >
          <RectanglePanel
            width={0.6 - i * 0.085}
            height={2.8 - i * 0.13}
            color={i % 2 ? "#c3c6b5" : "#9eafa6"}
          />
        </Hinge>
      ))}
      {[-1, 1].map((x) => (
        <FoldingTube
          key={x}
          progress={progress}
          position={[x * 0.85, 0.025, -0.5]}
          height={1.35}
          width={0.3}
          depth={0.2}
        />
      ))}
    </Selectable>
  );
}
