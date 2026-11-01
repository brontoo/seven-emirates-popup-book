import { Edges } from "@react-three/drei";
export function Paper({ color = "#f1ead9", ...props }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={1}
      metalness={0}
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
