import { chapters } from "../data/chapters";
import { paperTexture } from "./materials";
export default function TurningPage({ turn, angle }) {
  if (!turn.active) return null;
  const forward = turn.to > turn.from,
    front = chapters[forward ? turn.from : turn.to],
    back = chapters[forward ? turn.to : turn.from];
  return (
    <group
      name="turning-inner-page"
      position={[0, 0.004, 0]}
      rotation={[0, 0, angle]}
    >
      <mesh position={[2.18, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.29, 0.006, 5.5]} />
        {Array.from({ length: 6 }, (_, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            roughness={1}
            color={i === 2 || i === 3 ? "#ffffff" : "#d9cbb0"}
            map={
              i === 2
                ? paperTexture(
                    `${front.index}  —  ${front.title.toUpperCase()}`,
                  )
                : i === 3
                  ? paperTexture(
                      `${back.index}  —  ${back.title.toUpperCase()}`,
                    )
                  : null
            }
          />
        ))}
      </mesh>
    </group>
  );
}
