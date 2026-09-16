import { ContactShadows, Environment, OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Hill } from "@/components/monument/Hill";
import { Monument } from "@/components/monument/Monument";

const CAMERA_POS: [number, number, number] = [18.5, 11.8, 22.4];
const TARGET: [number, number, number] = [0, 4.6, 0];

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
    node.maxDistance = exploded ? 38 : 28;
  }, [exploded]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      minPolarAngle={0.16}
      maxPolarAngle={Math.PI * 0.48}
      minDistance={9}
      maxDistance={28}
      target={TARGET}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#7ea3c4"]} />
      <fog attach="fog" args={["#8aabca", 38, 88]} />
      <Sky sunPosition={[14, 7, 8]} turbidity={5.5} rayleigh={1.35} mieCoefficient={0.0038} />
      <hemisphereLight args={["#d7e6f5", "#5b5348", 0.62]} />
      <ambientLight intensity={0.32} />
      <directionalLight
        position={[14, 18, 8]}
        intensity={1.02}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={48}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={18}
        shadow-camera-bottom={-8}
        shadow-bias={-0.00018}
      />
      <directionalLight position={[-9, 6, -7]} intensity={0.24} color="#f0d2ae" />
      <directionalLight position={[4, 3, 12]} intensity={0.12} color="#cfd8e6" />
      <Environment preset="sunset" environmentIntensity={0.32} />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <Monument />
        <Hill />
      </group>
      <ContactShadows position={[0, 0, 0]} opacity={0.38} scale={24} blur={3.6} far={9} />
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 36, near: 0.1, far: 140 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.02,
      }}
      className="absolute inset-0 z-0 h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
