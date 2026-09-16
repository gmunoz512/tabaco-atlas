import { ContactShadows, Environment, OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Monument } from "@/components/monument/Monument";
import { Surroundings } from "@/components/monument/Surroundings";

const CAMERA_POS: [number, number, number] = [18.2, 7.6, 22.0];
const TARGET: [number, number, number] = [0, 5.5, 0];

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
    node.minDistance = exploded ? 9 : 8;
    node.maxDistance = exploded ? 48 : 36;
  }, [exploded]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      minPolarAngle={0.18}
      maxPolarAngle={Math.PI * 0.49}
      minDistance={8}
      maxDistance={36}
      target={TARGET}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#8aa7c2"]} />
      <fog attach="fog" args={["#9bb3c8", 42, 95]} />
      <Sky
        sunPosition={[16, 4.2, 10]}
        turbidity={7.5}
        rayleigh={1.15}
        mieCoefficient={0.005}
        mieDirectionalG={0.82}
      />
      <hemisphereLight args={["#e7d3b4", "#4a5344", 0.7]} />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[16, 14, 9]}
        intensity={1.08}
        color="#fff1dc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={64}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={22}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-8, 5, -6]} intensity={0.28} color="#f0c9a0" />
      <Environment preset="sunset" environmentIntensity={0.28} />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <Monument />
        <Surroundings />
      </group>
      <ContactShadows position={[0, 0.02, 0]} opacity={0.28} scale={28} blur={4.2} far={10} />
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 36, near: 0.1, far: 180 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      className="absolute inset-0 z-0 h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
