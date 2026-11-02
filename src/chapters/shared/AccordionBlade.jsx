import { useMemo } from "react";
import * as THREE from "three";
import { Panel, InkLine, Marker, polygon, slabShape } from "./Primitives";
import { hingeQuaternion } from "./mechanics";
export function AccordionBlade({ spec, beta, frame = false }) {
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
