import { useMemo } from "react";
import {
  Assembly,
  Standing,
  Panel,
  Tab,
  InkLine,
  Selectable,
  polygon,
  palette,
} from "../shared/Primitives";
import { parallelTop } from "../../mechanisms/kinematics";
import { Block } from "../../landmarks/Paper";

export function museumProfile() {
  const points = [];
  for (let i = 0; i <= 24; i++) {
    const a = -Math.PI / 2 + (i / 24) * Math.PI;
    points.push([
      1.12 * Math.cos(a),
      Math.max(0, 0.61 + 0.61 * Math.sin(a) - 0.018),
    ]);
  }
  for (let i = 24; i >= 0; i--) {
    const a = -Math.PI / 2 + (i / 24) * Math.PI;
    points.push([0.73 * Math.cos(a), 0.592 + 0.3 * Math.sin(a)]);
  }
  return polygon(points);
}
function Ring({ beta, lowPower }) {
  const shape = useMemo(museumProfile, []),
    count = lowPower ? 3 : 5,
    fold = beta / (Math.PI / 2);
  const strokes = [
    [
      [0.79, 0.32, 0.012],
      [0.89, 0.29, 0.012],
      [1.0, 0.37, 0.012],
      [0.94, 0.45, 0.012],
    ],
    [
      [0.9, 0.64, 0.012],
      [1.04, 0.68, 0.012],
      [0.97, 0.76, 0.012],
      [0.85, 0.75, 0.012],
    ],
    [
      [0.67, 1.03, 0.012],
      [0.78, 0.99, 0.012],
      [0.72, 0.91, 0.012],
    ],
    [
      [0.25, 0.15, 0.012],
      [0.46, 0.18, 0.012],
      [0.57, 0.26, 0.012],
    ],
    [
      [0.33, 1.09, 0.012],
      [0.51, 1.05, 0.012],
      [0.49, 0.98, 0.012],
    ],
  ];
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const depth = (0.23 * i) / (count - 1);
        return (
          <Standing key={i} beta={beta} position={[0, 0, depth]}>
            <Panel
              shape={shape}
              color={
                i === count - 1 ? "#eee0c2" : i % 2 ? "#dfd0b3" : "#f4e8cd"
              }
              thickness={0.006}
            />
            {i === count - 1 &&
              strokes.map((points, j) => (
                <InkLine key={j} points={points} color="#8d8b7c" />
              ))}
          </Standing>
        );
      })}
      {[
        [0.9, 0.6],
        [0.3, 1.08],
        [0.3, 0.08],
      ].map(([x, y]) => {
        const top = parallelTop(y, beta / (Math.PI / 2));
        return (
          <group key={`${x}-${y}`} position={[x, top[1], top[2] + 0.115]}>
            <Block size={[0.045, 0.006, 0.23]} color="#e4d6b9" />
          </group>
        );
      })}
    </>
  );
}
function Pedestal({ beta, children }) {
  const shape = useMemo(
    () =>
      polygon([
        [0, 0.14],
        [1.1, 0.14],
        [1.29, 0],
        [0, 0],
        [0, 0.08],
      ]),
    [],
  );
  const top = parallelTop(0.14, beta / (Math.PI / 2));
  return (
    <>
      <Tab width={1.22} position={[0.61, 0.004, 0]} />
      {[0, 0.5].map((z) => (
        <Standing key={z} beta={beta} position={[0, 0, z]}>
          <Panel shape={shape} color="#bbc0c4" />
        </Standing>
      ))}
      <group position={top}>
        <Block
          position={[0.58, 0.004, 0.25]}
          size={[1.16, 0.008, 0.5]}
          color="#d3d4cc"
        />
        {children}
      </group>
    </>
  );
}
export default function Museum({
  page,
  progress,
  enabled,
  onSelect,
  lowPower,
}) {
  const sign = page === "left" ? -1 : 1;
  return (
    <Selectable id="museum" enabled={enabled} onSelect={onSelect}>
      <group position={[sign * 0.025, 0.047, 0.68]} scale={[sign, 1, 1]}>
        <Assembly
          id="museum"
          page={page}
          position={[0, 0, 0]}
          nearest={0.025}
          height={1.64}
          progress={progress}
        >
          {({ beta }) => (
            <Pedestal beta={beta}>
              <group position={[0, 0.014, 0.25]}>
                <Ring beta={beta} lowPower={lowPower} />
              </group>
            </Pedestal>
          )}
        </Assembly>
      </group>
    </Selectable>
  );
}
