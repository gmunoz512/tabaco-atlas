import { Environment, OrbitControls, SoftShadows } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Monument } from "@/components/monument/Monument";
import { Surroundings } from "@/components/monument/Surroundings";
import { HDRI_PATH } from "@/components/monument/pbr";

const CAMERA_POS: [number, number, number] = [21.2, 12.4, 30.2];
const TARGET: [number, number, number] = [0, 7.4, 0];

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
      <color attach="background" args={["#4a3a32"]} />
      <fog attach="fog" args={["#c9a888", 95, 210]} />
      <hemisphereLight args={["#ffd2a8", "#2a3228", 0.42]} />
      <ambientLight intensity={0.08} />
      <directionalLight
        position={[24, 9, 14]}
        intensity={2.1}
        color="#ffb070"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={90}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={30}
        shadow-camera-bottom={-16}
        shadow-bias={-0.00018}
        shadow-radius={4}
      />
      <directionalLight position={[-16, 7, -8]} intensity={0.35} color="#6a7fa0" />
      <Environment
        files={HDRI_PATH}
        background
        backgroundIntensity={1.15}
        environmentIntensity={0.7}
        backgroundRotation={[0, Math.PI * 0.42, 0]}
        environmentRotation={[0, Math.PI * 0.42, 0]}
      />
      <SoftShadows size={18} samples={12} focus={0.4} />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <Monument />
        <Surroundings />
      </group>
      <EffectComposer multisampling={0} enableNormalPass>
        <N8AO aoRadius={1.15} intensity={1.55} quality="medium" halfRes color="#1c120e" distanceFalloff={1.1} />
        <Bloom luminanceThreshold={0.88} intensity={0.22} mipmapBlur />
        <Vignette offset={0.22} darkness={0.42} />
        <SMAA />
      </EffectComposer>
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 40, near: 0.1, far: 380 }}
      dpr={[1, 2]}
      gl={{
        antialias: false,
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
