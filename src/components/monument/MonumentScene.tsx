import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Monument } from "@/components/monument/Monument";
import { Surroundings } from "@/components/monument/Surroundings";

const CAMERA_POS: [number, number, number] = [19.8, 11.6, 27.8];
const TARGET: [number, number, number] = [0, 7.1, 0];

function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { resetViewToken, exploded } = useAtlas();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...CAMERA_POS);
    controls.current?.target.set(...TARGET);
    controls.current?.update();
  }, [camera, resetViewToken]);

  useEffect(() => {
    const node = controls.current;
    if (!node) return;
    node.minDistance = exploded ? 12 : 11;
    node.maxDistance = exploded ? 58 : 46;
  }, [exploded]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      minPolarAngle={0.22}
      maxPolarAngle={Math.PI * 0.48}
      minDistance={11}
      maxDistance={46}
      target={TARGET}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#4a6280"]} />
      <fog attach="fog" args={["#c4b09a", 62, 155]} />
      <hemisphereLight args={["#f4d2a4", "#3c4a36", 0.7]} />
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[22, 7.5, 12]}
        intensity={1.45}
        color="#ffc48a"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={28}
        shadow-camera-bottom={-14}
        shadow-bias={-0.00022}
      />
      <directionalLight position={[-14, 6, -6]} intensity={0.28} color="#7a90b0" />
      <Environment preset="sunset" environmentIntensity={0.32} />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <Monument />
        <Surroundings />
      </group>
      <ContactShadows position={[0, 0.02, 0]} opacity={0.22} scale={34} blur={4.8} far={14} />
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 38, near: 0.1, far: 360 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      className="absolute inset-0 z-0 h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
