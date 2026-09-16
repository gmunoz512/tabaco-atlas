import { ContactShadows, Environment, OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Hill } from "@/components/monument/Hill";
import { Monument } from "@/components/monument/Monument";

const CAMERA_POS: [number, number, number] = [13.5, 6.4, 15.5];
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
    node.minDistance = exploded ? 9 : 8;
    node.maxDistance = exploded ? 36 : 26;
  }, [exploded]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      minPolarAngle={0.18}
      maxPolarAngle={Math.PI * 0.48}
      minDistance={8}
      maxDistance={26}
      target={TARGET}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#7ea3c4"]} />
      <fog attach="fog" args={["#8aabca", 28, 70]} />
      <Sky sunPosition={[12, 8, 6]} turbidity={6} rayleigh={1.4} mieCoefficient={0.004} />
      <hemisphereLight args={["#d7e6f5", "#5b5348", 0.55]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[14, 18, 8]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={48}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={18}
        shadow-camera-bottom={-8}
        shadow-bias={-0.00015}
      />
      <directionalLight position={[-10, 5, -8]} intensity={0.22} color="#f0d2ae" />
      <Environment preset="sunset" environmentIntensity={0.35} />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <Monument />
        <Hill />
      </group>
      <ContactShadows position={[0, 0, 0]} opacity={0.42} scale={22} blur={3.2} far={8} />
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 36, near: 0.1, far: 120 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      className="h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
