import { Paper, Block } from "../landmarks/Paper";
import { coverAngle } from "../mechanisms/kinematics";
export default function BookSpine({ progress }) {
  const gap = 0.16 * (1 - progress);
  return (
    <group name="cloth-spine">
      <Block
        position={[0.015, gap / 2 - 0.08, 0]}
        size={[0.16, 0.3 + gap, 5.78]}
        color="#3d4d40"
      />
      <group rotation={[0, 0, coverAngle(progress) / 2]}>
        <mesh
          position={[0, gap / 2 - 0.02, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.19 + gap / 2,
              0.19 + gap / 2,
              5.76,
              20,
              1,
              false,
              0,
              Math.PI,
            ]}
          />
          <Paper color="#4b5c4b" />
        </mesh>
      </group>
      {[-2.2, 2.2].map((z) => (
        <Block
          key={z}
          position={[0, -0.14, z]}
          size={[0.19, 0.23, 0.035]}
          color="#9f8b5c"
        />
      ))}
    </group>
  );
}
