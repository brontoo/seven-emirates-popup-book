import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, SoftShadows } from "@react-three/drei";
import Book from "./Book";
import { DebugContext } from "../chapters/abuDhabi/Primitives";
import { auditBook } from "../dev/audit";
function CameraRig({ progress, dragging }) {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.position.set(0.18, 7.4, 14.2);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  useEffect(() => {
    camera.fov =
      size.width < 650
        ? 40 + 9 * progress
        : (size.width < 1100 ? 34 : 29) + 7 * Math.sin(Math.PI * progress);
    camera.updateProjectionMatrix();
  }, [camera, size, progress]);
  return (
    <OrbitControls
      makeDefault
      target={[0, 0.85, 0]}
      enabled={!dragging}
      enableRotate={progress > 0.98}
      enablePan={false}
      enableZoom={progress > 0.98}
      minDistance={12}
      maxDistance={23}
      minPolarAngle={0.45}
      maxPolarAngle={1.25}
      minAzimuthAngle={-0.55}
      maxAzimuthAngle={0.55}
      enableDamping={false}
      rotateSpeed={0.45}
    />
  );
}
function World({ lowPower, onSceneReady, onReport, debug, ...props }) {
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera),
    gl = useThree((s) => s.gl);
  useEffect(() => {
    if (!import.meta.env.DEV || !debug.enabled) return;
    const id = setTimeout(() => {
      const book = scene.getObjectByName("mechanical-book");
      if (book)
        onReport(
          auditBook(
            book,
            props.progress,
            camera,
            gl.domElement.getBoundingClientRect(),
          ),
        );
    }, 180);
    return () => clearTimeout(id);
  }, [scene, camera, gl, props.progress, debug, onReport]);
  const announced = useRef(false);
  useFrame(() => {
    if (!announced.current) {
      announced.current = true;
      onSceneReady();
    }
  });
  return (
    <>
      <color attach="background" args={["#e4e2df"]} />
      <fog attach="fog" args={["#e4e2df", 30, 65]} />
      {!lowPower && <SoftShadows size={18} samples={8} focus={0.5} />}
      <ambientLight intensity={0.95} color="#fffaf0" />
      <hemisphereLight intensity={0.85} args={["#fffdf5", "#b9bcb8"]} />
      <directionalLight
        position={[-3.5, 10, 6]}
        intensity={2.5}
        color="#fff7eb"
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
      <DebugContext.Provider value={debug}>
        <Book {...props} lowPower={lowPower} debug={debug} />
      </DebugContext.Provider>
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
      camera={{ position: [0.18, 7.4, 14.2], fov: 29, near: 0.1, far: 100 }}
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
