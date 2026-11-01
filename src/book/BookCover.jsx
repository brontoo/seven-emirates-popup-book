import { coverTexture } from "./materials";
import CoverStickers from "./CoverStickers";
export default function BookCover({ front = false, handlers = {} }) {
  return (
    <group {...handlers} name={front ? "front-cover" : "back-cover"}>
      <mesh position={[-2.18, -0.205, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.13, 5.78]} />
        {Array.from({ length: 6 }, (_, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            map={front && i === 3 ? coverTexture() : null}
            color={front && i === 3 ? "#ffffff" : "#435347"}
            roughness={1}
          />
        ))}
      </mesh>
      <mesh position={[-2.18, -0.135, 0]} receiveShadow>
        <boxGeometry args={[4.43, 0.012, 5.7]} />
        <meshStandardMaterial color="#a99c7e" roughness={1} />
      </mesh>
      {front && <CoverStickers />}
    </group>
  );
}
