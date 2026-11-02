import { useMemo } from "react";
import {
  Assembly,
  Standing,
  Panel,
  Tab,
  InkLine,
  Selectable,
  polygon,
  slabShape,
  cachedSlab,
} from "../shared/Primitives";
import { parallelTop } from "../../mechanisms/kinematics";
import { Block } from "../../landmarks/Paper";

export function metroRoute(t) {
  return [1.25 + 2.72 * t, -0.65 + 1.98 * t - 0.35 * Math.sin(Math.PI * t)];
}
function Carriage({ beta }) {
  const side = useMemo(() => {
    const s = polygon([
      [-0.39, 0],
      [0.4, 0],
      [0.31, 0.2],
      [-0.39, 0.2],
    ]);
    for (let i = 0; i < 5; i++) {
      const x = -0.32 + i * 0.125;
      const hole = polygon([
        [x, 0.07],
        [x + 0.085, 0.07],
        [x + 0.085, 0.165],
        [x, 0.165],
      ]);
      s.holes.push(hole);
    }
    return s;
  }, []);
  const top = parallelTop(0.2, beta / (Math.PI / 2));
  return (
    <>
      {[-0.09, 0.09].map((z) => (
        <Standing key={z} beta={beta} position={[0, 0, z]}>
          <Panel shape={side} color="#e9e4d7" />
          <group position={[-0.34, 0.065, -0.004]}>
            <Panel
              shape={cachedSlab(0.64, 0.105)}
              color="#899ca8"
              thickness={0.003}
            />
          </group>
        </Standing>
      ))}
      <group position={top}>
        <Block
          position={[0, 0.003, 0]}
          size={[0.73, 0.006, 0.21]}
          color="#e1dfd4"
        />
      </group>
    </>
  );
}
export default function Metro({ page, progress, enabled, onSelect }) {
  const track = useMemo(() => {
    const edge = [];
    for (let i = 0; i <= 32; i++) {
      const [x, z] = metroRoute(i / 32);
      edge.push([x, -z - 0.085]);
    }
    for (let i = 32; i >= 0; i--) {
      const [x, z] = metroRoute(i / 32);
      edge.push([x, -z + 0.085]);
    }
    return polygon(edge);
  }, []);
  if (page !== "right") return null;
  return (
    <Selectable id="metro" enabled={enabled} onSelect={onSelect}>
      <Assembly
        id="metro"
        page={page}
        position={[0, 0.035, 0]}
        nearest={1.1}
        height={0.91}
        progress={progress}
      >
        {({ beta }) => {
          const top = parallelTop(0.5, beta / (Math.PI / 2));
          const car = metroRoute(0.58);
          const tangent = Math.atan2(
            metroRoute(0.59)[1] - car[1],
            metroRoute(0.59)[0] - car[0],
          );
          return (
            <>
              {[0.03, 0.25, 0.5, 0.75, 0.99].map((t) => {
                const [x, z] = metroRoute(t);
                return (
                  <group key={t} position={[x, 0, z]}>
                    <Tab width={0.13} />
                    <Standing beta={beta}>
                      <Panel
                        shape={cachedSlab(0.055, 0.5, -0.0275)}
                        color="#d9cdb4"
                      />
                    </Standing>
                  </group>
                );
              })}
              <group position={top}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <Panel shape={track} color="#e5d9bf" thickness={0.022} />
                </group>
                <InkLine
                  points={Array.from({ length: 33 }, (_, i) => {
                    const [x, z] = metroRoute(i / 32);
                    return [x, 0.027, z];
                  })}
                  color="#b5aa91"
                />
                <group
                  position={[car[0], 0.03, car[1]]}
                  rotation={[0, -tangent, 0]}
                >
                  <Carriage beta={beta} />
                </group>
              </group>
            </>
          );
        }}
      </Assembly>
    </Selectable>
  );
}
