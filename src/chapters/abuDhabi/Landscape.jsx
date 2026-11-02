import { useMemo } from "react";
import * as THREE from "three";
import {
  Assembly,
  Standing,
  Panel,
  Tab,
  Marker,
  Selectable,
  polygon,
  palette,
} from "./Primitives";
import { Block } from "../../landmarks/Paper";

function Palm({ page, progress, x, z, height = 0.8 }) {
  const trunk = useMemo(
    () =>
      polygon([
        [-0.034, 0],
        [0.034, 0],
        [0.075, height],
        [0.035, height],
      ]),
    [height],
  );
  const frond = useMemo(() => {
    const s = polygon([
      [0, 0],
      [0.17, 0.085],
      [0.4, 0.055],
      [0.61, -0.01],
      [0.38, -0.045],
      [0.14, -0.04],
    ]);
    return s;
  }, []);
  return (
    <Assembly
      id={`palm-${x}-${z}`}
      page={page}
      position={[x, 0.035, z]}
      nearest={Math.abs(x) - 0.15}
      height={height + 0.7}
      direction={-1}
      progress={progress}
    >
      {({ beta, fold }) => (
        <>
          <Tab width={0.16} depth={0.12} />
          <Standing beta={beta} direction={-1}>
            <Panel shape={trunk} color="#8f9679" />
            <group rotation={[0, beta, 0]}>
              <Panel shape={trunk} color="#b3b59b" />
            </group>
            <group position={[0.055, height, 0]}>
              {Array.from({ length: 9 }, (_, i) => (
                <group key={i} rotation={[0, (i / 9) * Math.PI * 2 * fold, 0]}>
                  <group
                    rotation={[
                      0,
                      0,
                      ((1 - fold) * Math.PI) / 2 -
                        fold * (0.12 + (i % 3) * 0.09),
                    ]}
                  >
                    <group rotation={[(-fold * Math.PI) / 2, 0, 0]}>
                      <Panel
                        shape={frond}
                        color={i % 3 ? "#9eae91" : "#839a82"}
                        thickness={0.005}
                      />
                    </group>
                  </group>
                </group>
              ))}
            </group>
          </Standing>
        </>
      )}
    </Assembly>
  );
}
function GroundPaper({ points, y = 0.014, color }) {
  const shape = useMemo(
    () => polygon(points.map(([x, z]) => [x, -z])),
    [points],
  );
  return (
    <group position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <Panel shape={shape} color={color} thickness={0.012} />
    </group>
  );
}
function Garden({ page }) {
  const sign = page === "left" ? -1 : 1;
  const broad = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.15, -1.97);
    s.bezierCurveTo(0.9, -2.05, 1.58, -1.83, 2.15, -1.9);
    s.bezierCurveTo(2.5, -1.7, 3.5, -1.65, 4.04, -1.91);
    s.lineTo(4.14, -2.45);
    s.bezierCurveTo(3.4, -2.61, 2.7, -2.45, 2.2, -2.51);
    s.bezierCurveTo(1.4, -2.46, 0.75, -2.57, 0.16, -2.49);
    s.closePath();
    return s;
  }, []);
  const long = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.35, -1.5);
    s.bezierCurveTo(0.9, -1.45, 1.6, -1.36, 1.8, -1.48);
    s.bezierCurveTo(1.95, -1.61, 1.45, -1.72, 0.32, -1.67);
    s.closePath();
    return s;
  }, []);
  return (
    <group scale={[sign, 1, 1]}>
      <group position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Panel shape={broad} color="#b2bf9f" thickness={0.015} />
      </group>
      <group position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Panel shape={long} color="#b5c3a7" thickness={0.018} />
      </group>
      <GroundPaper
        color="#c2cbb2"
        y={0.025}
        points={[
          [0.38, 1.83],
          [0.75, 1.73],
          [1.17, 1.8],
          [1.15, 1.94],
          [0.55, 1.98],
        ]}
      />
      <GroundPaper
        color="#9fb194"
        y={0.016}
        points={[
          [0.2, 1.26],
          [2.45, 1.26],
          [2.55, 1.34],
          [0.24, 1.35],
        ]}
      />
    </group>
  );
}
export function Skyline({ page, progress }) {
  const sign = page === "left" ? -1 : 1;
  const shape = useMemo(() => {
    const heights = [
      0.66, 0.58, 0.95, 0.72, 1.1, 1.32, 0.9, 0.82, 1.1, 0.71, 0.56, 0.78,
    ];
    const pts = [
      [0.08, 0],
      [4.17, 0],
    ];
    for (let i = heights.length - 1; i >= 0; i--) {
      const x = 0.08 + i * (4.09 / heights.length),
        next = x + 4.09 / heights.length;
      pts.push([next, heights[i]], [x, heights[i]]);
    }
    return polygon(pts);
  }, []);
  return (
    <group scale={[sign, 1, 1]}>
      <Assembly
        id="skyline"
        page={page}
        position={[0, 0.024, -2.47]}
        nearest={0.08}
        height={1.4}
        progress={progress}
      >
        {({ beta }) => (
          <>
            <Tab width={0.18} position={[0.17, 0.004, 0]} />
            <Standing beta={beta}>
              <Panel shape={shape} color="#c0d4d6" thickness={0.009} />
            </Standing>
          </>
        )}
      </Assembly>
    </group>
  );
}
export default function Landscape({ page, progress, enabled, onSelect }) {
  const palms =
    page === "left"
      ? [
          [-3.55, 1.74, 0.83],
          [-3.0, 1.18, 0.98],
          [-3.95, 2.1, 0.65],
        ]
      : [
          [2.76, 1.1, 0.95],
          [3.28, 1.82, 0.82],
          [3.9, 1.65, 0.96],
          [2.34, 1.92, 0.66],
        ];
  return (
    <Selectable id="mangroves" enabled={enabled} onSelect={onSelect}>
      <group
        name={`assembly-gardens-${page}`}
        userData={{ assembly: true, id: "gardens", page }}
      >
        <Garden page={page} />
      </group>
      {page === "right" && (
        <group
          name="assembly-coast-right"
          userData={{ assembly: true, id: "coast", page }}
        >
          {["#a5ced2", "#bedcdb", "#c8e2e0"].map((c, i) => (
            <GroundPaper
              key={c}
              color={c}
              y={0.018 + i * 0.014}
              points={[
                [0.14, 2.25 + i * 0.07],
                [1.48, 2.23 + i * 0.08],
                [2.29, 2.35 + i * 0.07],
                [3.15, 2.22 + i * 0.09],
                [4.21, 2.13 + i * 0.07],
                [4.27, 2.67],
                [0.15, 2.68],
              ]}
            />
          ))}
        </group>
      )}
      {palms.map(([x, z, h]) => (
        <Palm
          key={`${x}`}
          page={page}
          progress={progress}
          x={x}
          z={z}
          height={h}
        />
      ))}
    </Selectable>
  );
}
