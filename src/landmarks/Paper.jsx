import * as THREE from "three";
import { Edges } from "@react-three/drei";
let grain;
function cardstockGrain() {
  if (grain) return grain;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d"),
    data = ctx.createImageData(128, 128);
  let seed = 17;
  for (let i = 0; i < data.data.length; i += 4) {
    seed = (seed * 16807) % 2147483647;
    const value = 115 + Math.round((seed / 2147483647) * 26);
    data.data[i] = data.data[i + 1] = data.data[i + 2] = value;
    data.data[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  grain = new THREE.CanvasTexture(canvas);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  return grain;
}
export function Paper({ color = "#f1ead9", ...props }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={1}
      metalness={0}
      bumpMap={cardstockGrain()}
      bumpScale={0.002}
      {...props}
    />
  );
}
export function Block({
  position,
  size,
  color,
  rotation,
  edges = false,
  ...props
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      {...props}
    >
      <boxGeometry args={size} />
      <Paper color={color} />
      {edges && (
        <Edges color="#786e58" opacity={0.18} transparent threshold={25} />
      )}
    </mesh>
  );
}
