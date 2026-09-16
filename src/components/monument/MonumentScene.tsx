import { ContactShadows, Environment, OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Monument } from "@/components/monument/Monument";
import { Surroundings } from "@/components/monument/Surroundings";

const CAMERA_POS: [number, number, number] = [14.2, 10.2, 19.6];
const TARGET: [number, number, number] = [0, 6.0, 0];

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
    node.minDistance = exploded ? 10 : 9;
    node.maxDistance = exploded ? 52 : 40;
  }, [exploded]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI * 0.48}
      minDistance={9}
      maxDistance={40}
      target={TARGET}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#4a5e7a"]} />
      <fog attach="fog" args={["#c9b49a", 38, 95]} />
      <Sky
        sunPosition={[12, 1.15, 8]}
        turbidity={14}
        rayleigh={0.55}
        mieCoefficient={0.006}
        mieDirectionalG={0.88}
      />
      <hemisphereLight args={["#f3d2a8", "#3f4a3c", 0.75]} />
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[18, 8, 10]}
        intensity={1.35}
        color="#ffd0a0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={70}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={24}
        shadow-camera-bottom={-12}
        shadow-bias={-0.00022}
      />
      <directionalLight position={[-10, 4, -8]} intensity={0.22} color="#8aa0c0" />
      <Environment preset="sunset" environmentIntensity={0.42} />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <Monument />
        <Surroundings />
      </group>
      <ContactShadows position={[0, 0.03, 0]} opacity={0.32} scale={30} blur={4.4} far={12} />
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 44, near: 0.1, far: 220 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
      }}
      className="absolute inset-0 z-0 h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
