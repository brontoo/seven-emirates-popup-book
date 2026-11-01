import { Block } from "../landmarks/Paper";
import { paperTexture } from "./materials";
export default function BookPages({ side, label, progress }) {
  const center = side * 2.18;
  return (
    <group name={side === -1 ? "left-page-stack" : "right-page-stack"}>
      {Array.from({ length: 8 }, (_, i) => (
        <Block
          key={i}
          position={[center, -0.126 + i * 0.016, 0]}
          size={[4.35 - i * 0.008, 0.014, 5.56 - i * 0.005]}
          color={i % 2 ? "#d7cdb4" : "#e7dec9"}
        />
      ))}
      <mesh position={[center, -0.004, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.29, 0.014, 5.5]} />
        {Array.from({ length: 6 }, (_, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            color={i === 2 ? "white" : "#c5b99c"}
            map={i === 2 ? paperTexture(label) : null}
            roughness={1}
          />
        ))}
      </mesh>
      <Block
        position={[side * 0.075, 0.008, 0]}
        size={[0.016, 0.008, 5.48]}
        color="#b7aa8e"
      />
      <Block
        position={[side * 0.13, 0.008, 0]}
        size={[0.004, 0.005, 5.48]}
        color="#e3d6b6"
      />
    </group>
  );
}
