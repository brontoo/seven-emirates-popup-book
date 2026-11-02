import { useMemo } from "react";
import { hingeQuaternion } from "./mechanics";
import * as THREE from "three";
import {
  Assembly,
  Standing,
  Panel,
  Tab,
  InkLine,
  Marker,
  Selectable,
  polygon,
  slabShape,
  palette,
} from "./Primitives";

export const towerSpecs = [
  {
    id: "etihad-1",
    page: "left",
    x: -0.62,
    z: -2.1,
    h: 3.1,
    w: 0.46,
    d: 0.16,
    lean: -0.13,
    color: "#aac0cc",
  },
  {
    id: "etihad-2",
    page: "right",
    x: 0.38,
    z: -2.16,
    h: 3.58,
    w: 0.51,
    d: 0.17,
    lean: -0.12,
    color: "#9fb7c6",
  },
  {
    id: "etihad-3",
    page: "left",
    x: -1.03,
    z: -1.82,
    h: 2.32,
    w: 0.42,
    d: 0.18,
    lean: 0.07,
    color: "#96afc0",
  },
  {
    id: "etihad-4",
    page: "right",
    x: 0.96,
    z: -1.94,
    h: 2.74,
    w: 0.37,
    d: 0.13,
    lean: 0.04,
    color: "#b3c6d0",
  },
  {
    id: "etihad-5",
    page: "right",
    x: 1.36,
    z: -1.86,
    h: 2.43,
    w: 0.36,
    d: 0.14,
    lean: -0.08,
    color: "#9eb4c3",
  },
];
function AccordionBlade({ spec, beta, frame = false }) {
  const { h, w, d, lean } = spec;
  const fold = beta / (Math.PI / 2);
  const front = useMemo(() => {
    const s = polygon([
      [-w / 2, 0],
      [w / 2, 0],
      [w / 2 + lean, h * 0.965],
      [-w * 0.26 + lean, h],
    ]);
    if (frame) {
      const hole = new THREE.Path();
      hole.moveTo(-w * 0.25, h * 0.77);
      hole.lineTo(w * 0.25, h * 0.77);
      hole.lineTo(w * 0.25, h * 0.9);
      hole.lineTo(-w * 0.25, h * 0.9);
      hole.closePath();
      s.holes.push(hole);
    }
    return s;
  }, [h, w, lean, frame]);
  const leftStart = [-w / 2, 0, 0],
    leftEnd = [-w * 0.26 + lean, h, 0],
    rightStart = [w / 2, 0, 0],
    rightEnd = [w / 2 + lean, h * 0.965, 0];
  const left = useMemo(
    () =>
      polygon([
        [0, 0],
        [-d, 0],
        [leftEnd[0] - leftStart[0] - d, h],
        [leftEnd[0] - leftStart[0], h],
      ]),
    [d, h, w, lean],
  );
  const right = useMemo(
    () =>
      polygon([
        [0, 0],
        [d, 0],
        [rightEnd[0] - rightStart[0] + d, h * 0.965],
        [rightEnd[0] - rightStart[0], h * 0.965],
      ]),
    [d, h, w, lean],
  );
  return (
    <>
      <Panel shape={front} color={spec.color} />
      <group
        position={leftStart}
        quaternion={hingeQuaternion(
          [0, 0, 0],
          [leftEnd[0] - leftStart[0], h, 0],
          -fold * 1.12,
        )}
        userData={{
          hingeAxis: [
            [0, 0, 0],
            [leftEnd[0] - leftStart[0], h, 0],
          ],
        }}
      >
        <Marker length={h} axis={[leftEnd[0] - leftStart[0], h, 0]} />
        <Panel shape={left} color={spec.color} />
      </group>
      <group
        position={rightStart}
        quaternion={hingeQuaternion(
          [0, 0, 0],
          [rightEnd[0] - rightStart[0], h * 0.965, 0],
          fold * 1.12,
        )}
        userData={{
          hingeAxis: [
            [0, 0, 0],
            [rightEnd[0] - rightStart[0], h * 0.965, 0],
          ],
        }}
      >
        <Panel shape={right} color="#8fa5b5" />
      </group>
      <InkLine
        points={[
          [-w / 2, 0.03, 0.012],
          [leftEnd[0], h, 0.012],
        ]}
        color="#e1e5e2"
      />
      {frame && (
        <InkLine
          points={[
            [0, 0.05, 0.014],
            [-w * 0.3, h * 0.62, 0.014],
            [w * 0.3, h * 0.54, 0.014],
          ]}
          dashed
        />
      )}
      {!frame &&
        spec.id === "etihad-4" &&
        Array.from({ length: 12 }, (_, i) => (
          <group key={i} position={[0, 0.28 + i * 0.14, 0.012]}>
            <Panel
              shape={slabShape(w * 0.5, 0.035, -w * 0.25)}
              color="#8298a7"
              thickness={0.002}
            />
          </group>
        ))}
    </>
  );
}
export default function Towers({ page, progress, enabled, onSelect }) {
  const extras = [
    {
      id: "frame-study",
      page: "right",
      x: 2.13,
      z: -1.65,
      h: 2.48,
      w: 0.42,
      d: 0.18,
      lean: 0.02,
      color: "#bebfc4",
      frame: true,
    },
    {
      id: "side-building",
      page: "right",
      x: 2.85,
      z: -1.58,
      h: 1.46,
      w: 0.49,
      d: 0.2,
      lean: -0.06,
      color: "#c6c9ca",
    },
  ];
  return (
    <Selectable id="towers" enabled={enabled} onSelect={onSelect}>
      {[...towerSpecs, ...extras]
        .filter((s) => s.page === page)
        .map((spec) => (
          <Assembly
            key={spec.id}
            id={spec.id}
            page={page}
            position={[spec.x, 0.038, spec.z]}
            nearest={Math.max(
              0.02,
              Math.abs(spec.x) - spec.w / 2 - spec.d - Math.abs(spec.lean),
            )}
            height={spec.h + spec.d + 0.08}
            progress={progress}
          >
            {({ beta }) => (
              <>
                <Tab width={spec.w} depth={0.13} />
                <Standing beta={beta}>
                  <AccordionBlade spec={spec} beta={beta} frame={spec.frame} />
                </Standing>
              </>
            )}
          </Assembly>
        ))}
    </Selectable>
  );
}
