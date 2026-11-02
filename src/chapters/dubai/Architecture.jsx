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
import { AccordionBlade } from "../shared/AccordionBlade";
import { Block } from "../../landmarks/Paper";
import * as THREE from "three";

export function burjProfile() {
  return polygon([
    [0, 0],
    [0.24, 0],
    [0.24, 0.4],
    [0.2, 0.4],
    [0.2, 1.15],
    [0.165, 1.15],
    [0.165, 1.9],
    [0.13, 1.9],
    [0.13, 2.57],
    [0.092, 2.57],
    [0.092, 3.14],
    [0.055, 3.14],
    [0.055, 3.62],
    [0.025, 3.62],
    [0, 4.12],
  ]);
}
export function BurjKhalifa({ page, progress, enabled, onSelect }) {
  const sign = page === "left" ? -1 : 1;
  const shape = useMemo(burjProfile, []);
  return (
    <Selectable id="burj-khalifa" enabled={enabled} onSelect={onSelect}>
      <group position={[sign * 0.025, 0.033, -2.23]} scale={[sign, 1, 1]}>
        <Assembly
          id="burj-khalifa"
          page={page}
          position={[0, 0, 0]}
          nearest={0.025}
          height={4.3}
          progress={progress}
        >
          {({ beta, fold }) => (
            <>
              <Tab width={0.3} position={[0.15, 0.004, 0]} />
              <Standing beta={beta}>
                {[0, 0.4, 0.8].map((factor, i) => (
                  <group key={i} rotation={[0, factor * beta, 0]}>
                    <Panel
                      shape={shape}
                      color={["#b2c7d0", "#96adbd", "#c1d1d7"][i]}
                    />
                  </group>
                ))}
                {[0.62, 1.5, 2.42].map((y, i) => (
                  <group key={y} position={[0, y, 0.012]}>
                    <Panel
                      shape={cachedSlab([0.21, 0.16, 0.13][i], 0.035)}
                      color="#a3aaae"
                      thickness={0.003}
                    />
                  </group>
                ))}
                <InkLine
                  points={[
                    [0.03, 0.03, 0.014],
                    [0.03, 3.55, 0.014],
                  ]}
                  color="#e4e5de"
                />
              </Standing>
            </>
          )}
        </Assembly>
      </group>
    </Selectable>
  );
}
function EmiratesTower({ x, z, h, w, progress, page, mirror = false }) {
  const shape = useMemo(() => {
    const points = [
      [-w / 2, 0],
      [w / 2, 0],
      [w / 2, h * 0.58],
      [w * 0.1, h * 0.58],
      [w * 0.1, h],
      [0, h * 1.04],
      [-w * 0.035, h * 0.88],
      [-w * 0.62, h * 0.64],
      [-w / 2, h * 0.5],
    ];
    const s = polygon(points);
    for (const y of [0.28, 0.92]) {
      const hole = new THREE.Path();
      hole.moveTo(-w * 0.3, y);
      hole.lineTo(w * 0.2, y);
      hole.lineTo(w * 0.2, y + 0.5);
      hole.lineTo(-w * 0.3, y + 0.5);
      hole.closePath();
      s.holes.push(hole);
    }
    return s;
  }, [h, w]);
  const side = useMemo(
    () =>
      polygon([
        [0, 0],
        [0.2, 0],
        [0.2, h * 0.57],
        [0, h * 0.58],
      ]),
    [h],
  );
  return (
    <Assembly
      id={`emirates-${x}`}
      page={page}
      position={[x, 0.038, z]}
      nearest={Math.abs(x) - w - 0.25}
      height={h * 1.04 + 0.25}
      progress={progress}
    >
      {({ beta, fold }) => (
        <>
          <Tab width={w} />
          <Standing beta={beta}>
            <group scale={[mirror ? -1 : 1, 1, 1]}>
              <Panel shape={shape} color="#b5c7d0" />
              <group position={[w / 2, 0, 0]} rotation={[0, beta, 0]}>
                <Panel shape={side} color="#97aebd" />
              </group>
              {[0.28, 0.92].map((y) => (
                <group key={y} position={[-w * 0.3, y, -0.006]}>
                  <Panel
                    shape={cachedSlab(w * 0.5, 0.5)}
                    color="#b6b8bc"
                    thickness={0.003}
                  />
                </group>
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <group key={i} position={[w * 0.22, 0.5 + i * 0.1, 0.012]}>
                  <Panel
                    shape={cachedSlab(w * 0.32, 0.017)}
                    color="#7f939d"
                    thickness={0.002}
                  />
                </group>
              ))}
            </group>
          </Standing>
        </>
      )}
    </Assembly>
  );
}
export function EmiratesTowers({ page, progress, enabled, onSelect }) {
  return page === "left" ? (
    <Selectable id="emirates-towers" enabled={enabled} onSelect={onSelect}>
      <EmiratesTower
        page={page}
        progress={progress}
        x={-2.82}
        z={-1.43}
        h={2.66}
        w={0.48}
      />
      <EmiratesTower
        page={page}
        progress={progress}
        x={-2.04}
        z={-1.5}
        h={2.85}
        w={0.47}
        mirror
      />
    </Selectable>
  ) : null;
}
export function DubaiSkyline({ page, progress }) {
  if (page !== "right") return null;
  const specs = [
    {
      id: "dubai-frame-silhouette",
      x: 1.55,
      z: -1.55,
      h: 2.26,
      w: 0.38,
      d: 0.14,
      lean: 0.02,
      color: "#bfc1c5",
      frame: true,
    },
    {
      id: "dubai-rooftop",
      x: 2.24,
      z: -1.57,
      h: 2.54,
      w: 0.4,
      d: 0.18,
      lean: -0.04,
      color: "#b4c4cc",
    },
    {
      id: "dubai-east-cluster",
      x: 2.88,
      z: -1.53,
      h: 2.02,
      w: 0.5,
      d: 0.18,
      lean: 0.03,
      color: "#a5bac5",
    },
  ];
  return specs.map((spec) => (
    <Assembly
      key={spec.id}
      id={spec.id}
      page={page}
      position={[spec.x, 0.034, spec.z]}
      nearest={spec.x - spec.w}
      height={spec.h + 0.2}
      progress={progress}
    >
      {({ beta }) => (
        <>
          <Tab width={spec.w} />
          <Standing beta={beta}>
            <AccordionBlade spec={spec} beta={beta} frame={spec.frame} />
          </Standing>
        </>
      )}
    </Assembly>
  ));
}
