import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, SoftShadows } from "@react-three/drei";
import Book from "./Book";
function CameraRig({ progress, dragging }) {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.position.set(9.1, 10.1, 13.1);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  useEffect(() => {
    camera.fov =
      size.width < 650
        ? 33 + 7 * progress
        : (size.width < 1100 ? 31 : 28) + 7 * Math.sin(Math.PI * progress);
    camera.updateProjectionMatrix();
  }, [camera, size, progress]);
  return (
    <OrbitControls
      makeDefault
      target={[0, 0.32, 0]}
      enabled={!dragging}
      enableRotate={progress > 0.98}
      enablePan={false}
      enableZoom={progress > 0.98}
      minDistance={12}
      maxDistance={23}
      minPolarAngle={0.45}
      maxPolarAngle={1.25}
      minAzimuthAngle={-0.7}
      maxAzimuthAngle={0.9}
      enableDamping={false}
      rotateSpeed={0.45}
    />
  );
}
function World({ lowPower, onSceneReady, ...props }) {
  const announced = useRef(false);
  useFrame(() => {
    if (!announced.current) {
      announced.current = true;
      onSceneReady();
    }
  });
  return (
    <>
      <color attach="background" args={["#242c27"]} />
      <fog attach="fog" args={["#242c27", 30, 65]} />
      {!lowPower && <SoftShadows size={18} samples={8} focus={0.5} />}
      <ambientLight intensity={0.85} color="#e6e3d2" />
      <hemisphereLight intensity={1.1} args={["#fff5df", "#687264"]} />
      <directionalLight
        position={[-4, 10, 4]}
        intensity={3.1}
        color="#fff2d8"
        castShadow
        shadow-mapSize-width={lowPower ? 1024 : 2048}
        shadow-mapSize-height={lowPower ? 1024 : 2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-normalBias={0.025}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[6, 5, -6]}
        intensity={1.35}
        color="#d5e3df"
      />
      <Book {...props} />
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.25, 0]}
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.35} />
      </mesh>
      <CameraRig progress={props.progress} dragging={props.dragging} />
    </>
  );
}
export default function Scene(props) {
  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={props.lowPower ? 1 : [1, 1.65]}
      camera={{ position: [9.1, 10.1, 13.1], fov: 29, near: 0.1, far: 100 }}
      gl={{
        antialias: !props.lowPower,
        powerPreference: props.lowPower ? "low-power" : "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          props.onContextLost,
          { once: true },
        );
      }}
    >
      <Suspense fallback={null}>
        <World {...props} />
      </Suspense>
    </Canvas>
  );
}
