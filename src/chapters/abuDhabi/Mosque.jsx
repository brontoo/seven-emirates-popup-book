import { useMemo, useRef, useLayoutEffect, useEffect } from "react";
import * as THREE from "three";
import {
  Assembly,
  Standing,
  Panel,
  Tab,
  Marker,
  Selectable,
  polygon,
  slabShape,
  archHole,
  palette,
} from "./Primitives";
import { parallelTop } from "../../mechanisms/kinematics";
import { domeFanAngle } from "./mechanics";
import { Block, Paper } from "../../landmarks/Paper";

function arcade(width, height, count = 7) {
  const s = slabShape(width, height);
  for (let i = 0; i < count; i++)
    s.holes.push(
      archHole(
        ((i + 0.5) * width) / count,
        (width / count) * 0.55,
        height * 0.62,
        0.025,
      ),
    );
  return s;
}
function DomeRibs({ beta, radius, height, drum = 0.18, lowPower }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, drum);
    s.lineTo(radius, drum);
    s.bezierCurveTo(
      radius * 1.04,
      drum + height * 0.3,
      radius * 0.65,
      drum + height * 0.7,
      0,
      drum + height,
    );
    s.closePath();
    return s;
  }, [radius, height, drum]);
  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.004,
        bevelEnabled: false,
        curveSegments: 5,
      }),
    [shape],
  );
  const ref = useRef();
  const count = lowPower ? 10 : 20;
  const fan = domeFanAngle(beta, drum, radius);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.rotation.set(0, (-1 + (2 * i) / (count - 1)) * fan, 0);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
      ref.current.setColorAt(i, new THREE.Color(i % 3 ? "#f2e4c6" : "#ead9b6"));
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [fan, count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, null, count]}
      castShadow
      receiveShadow
    >
      <Paper color="#ffffff" />
    </instancedMesh>
  );
}
function Dome({ beta, radius, height, drum, lowPower, whole = false }) {
  const drumShape = useMemo(
    () => arcade(radius, drum, Math.max(2, Math.round(radius / 0.105))),
    [radius, drum],
  );
  return (
    <>
      <Standing beta={beta}>
        <DomeRibs
          beta={beta}
          radius={radius}
          height={height}
          drum={drum}
          lowPower={lowPower}
        />
        {whole && (
          <group scale={[-1, 1, 1]}>
            <DomeRibs
              beta={beta}
              radius={radius}
              height={height}
              drum={drum}
              lowPower={lowPower}
            />
          </group>
        )}
      </Standing>
      <Standing beta={beta} position={[0, 0.006, radius]}>
        <Panel shape={drumShape} color={palette.light} />
        {whole && (
          <group scale={[-1, 1, 1]}>
            <Panel shape={drumShape} color={palette.light} />
          </group>
        )}
      </Standing>
    </>
  );
}
function BoxArcade({ beta, width, height, depth = 0.24, children }) {
  const shape = useMemo(
    () => arcade(width, height, Math.max(3, Math.round(width / 0.25))),
    [width, height],
  );
  const top = parallelTop(height, beta / (Math.PI / 2));
  return (
    <>
      <Marker length={width} />
      <group position={[0, 0, depth]}>
        <Marker length={width} />
      </group>
      <Tab width={width} position={[width / 2, 0.002, 0]} />
      <Tab width={width} position={[width / 2, 0.002, depth]} />
      {[0, depth].map((z) => (
        <Standing key={z} beta={beta} position={[0, 0, z]}>
          <Panel shape={shape} color={palette.ivory} />
        </Standing>
      ))}
      <group position={top}>
        <Block
          position={[width / 2, 0.004, depth / 2]}
          size={[width, 0.009, depth]}
          color={palette.light}
        />
        {children}
      </group>
    </>
  );
}
function Portal({ beta }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.19, 0);
    s.lineTo(0.37, 0);
    s.lineTo(0.37, 0.72);
    s.lineTo(0.31, 0.72);
    s.lineTo(0.31, 0.79);
    s.lineTo(0, 0.79);
    s.lineTo(0, 0.53);
    s.quadraticCurveTo(0.18, 0.4, 0.19, 0.26);
    s.closePath();
    return s;
  }, []);
  return (
    <Standing beta={beta}>
      <Panel shape={shape} color="#edddbc" />
      <Block
        position={[0.34, 0.76, 0.01]}
        size={[0.045, 0.11, 0.018]}
        color={palette.light}
      />
    </Standing>
  );
}
function Minaret({ page, progress }) {
  const height = 1.94,
    rootX = 1.32;
  const shape = useMemo(
    () =>
      polygon(
        [
          [-0.07, 0],
          [0.07, 0],
          [0.07, 0.59],
          [0.105, 0.59],
          [0.105, 0.68],
          [0.052, 0.68],
          [0.052, 1.4],
          [0.082, 1.4],
          [0.082, 1.48],
          [0.04, 1.48],
          [0.04, 2.04],
          [0, 2.27],
          [-0.04, 2.04],
          [-0.04, 1.48],
          [-0.082, 1.48],
          [-0.082, 1.4],
          [-0.052, 1.4],
          [-0.052, 0.68],
          [-0.105, 0.68],
          [-0.105, 0.59],
          [-0.07, 0.59],
        ].map(([x, y]) => [x, y * 0.85]),
      ),
    [],
  );
  const sideShape = useMemo(() => slabShape(0.07, 2.04 * 0.85, 0), []);
  return (
    <Assembly
      id="minaret"
      page={page}
      position={[rootX, 0.016, 0.15]}
      nearest={rootX - 0.16}
      height={height + 0.6}
      direction={-1}
      progress={progress}
    >
      {({ beta, fold }) => (
        <>
          <Tab width={0.25} depth={0.14} />
          <Standing beta={beta} direction={-1}>
            <Panel shape={shape} color={palette.light} />
            {[-1, 1].map((side) => (
              <group
                key={side}
                position={[side * 0.055, 0, 0]}
                rotation={[0, (-side * fold * Math.PI) / 2, 0]}
              >
                <group scale={[side, 1, 1]}>
                  <Panel shape={sideShape} color={palette.ivory} />
                </group>
              </group>
            ))}
            {[0.61, 1.42, 2.02].map((y, i) => (
              <group
                key={y}
                position={[0, y * 0.85, 0.004]}
                rotation={[-beta, 0, 0]}
              >
                <Panel
                  shape={slabShape(0.22 - i * 0.035, 0.13, -0.11 + i * 0.0175)}
                  color={palette.light}
                />
              </group>
            ))}
          </Standing>
        </>
      )}
    </Assembly>
  );
}
export default function Mosque({
  page,
  progress,
  enabled,
  onSelect,
  lowPower,
}) {
  const sign = page === "left" ? -1 : 1;
  return (
    <Selectable id="mosque" enabled={enabled} onSelect={onSelect}>
      <group position={[sign * 0.025, 0.028, 0]} scale={[sign, 1, 1]}>
        {[
          { id: "front", z: 1.03, h: 0.47, w: 1.55, d: 0.52 },
          { id: "middle", z: 0.22, h: 0.7, w: 1.76, d: 0.64 },
          { id: "rear", z: -0.99, h: 0.9, w: 0.79, d: 1.38 },
        ].map((tier) => (
          <Assembly
            key={tier.id}
            id={`mosque-${tier.id}`}
            page={page}
            position={[0, 0.005, tier.z]}
            nearest={0.025}
            height={tier.id === "rear" ? 2.1 : tier.h + 0.12}
            progress={progress}
          >
            {({ beta }) => (
              <BoxArcade
                beta={beta}
                width={tier.w}
                height={tier.h}
                depth={tier.d}
              >
                {tier.id === "rear" && (
                  <group position={[0, 0.009, 0.69]}>
                    <Dome
                      beta={beta}
                      radius={0.67}
                      height={0.85}
                      drum={0.2}
                      lowPower={lowPower}
                    />
                  </group>
                )}
                {tier.id === "front" && (
                  <>
                    <group position={[0, 0.008, 0.26]}>
                      <Dome
                        beta={beta}
                        radius={0.24}
                        height={0.3}
                        drum={0.075}
                        lowPower={lowPower}
                      />
                    </group>
                    <Minaret page={page} progress={progress} />
                  </>
                )}
                {tier.id === "middle" && (
                  <>
                    <group position={[0, 0.008, 0.32]}>
                      <Dome
                        beta={beta}
                        radius={0.32}
                        height={0.37}
                        drum={0.09}
                        lowPower={lowPower}
                      />
                    </group>
                  </>
                )}
              </BoxArcade>
            )}
          </Assembly>
        ))}
        <Assembly
          id="entrance"
          page={page}
          position={[0, 0.012, 1.63]}
          nearest={0.025}
          height={0.88}
          progress={progress}
        >
          {({ beta }) => (
            <>
              <Tab width={0.36} position={[0.18, 0.004, 0]} />
              <Portal beta={beta} />
            </>
          )}
        </Assembly>
        <Assembly
          id="side-dome"
          page={page}
          position={[0.94, 0.01, -0.48]}
          nearest={0.88}
          height={1.7}
          progress={progress}
        >
          {({ beta }) => (
            <BoxArcade beta={beta} width={0.52} height={0.84} depth={0.65}>
              <group position={[0.26, 0.008, 0.325]}>
                <Dome
                  beta={beta}
                  radius={0.29}
                  height={0.45}
                  drum={0.12}
                  whole
                  lowPower={lowPower}
                />
              </group>
            </BoxArcade>
          )}
        </Assembly>
        <Assembly
          id="corner-pavilion"
          page={page}
          position={[1.6, 0.009, 0.93]}
          nearest={1.55}
          height={0.87}
          progress={progress}
        >
          {({ beta }) => (
            <BoxArcade beta={beta} width={0.39} height={0.74} depth={0.34} />
          )}
        </Assembly>
      </group>
    </Selectable>
  );
}
