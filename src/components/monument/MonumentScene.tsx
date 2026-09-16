import { ContactShadows, OrbitControls, SoftShadows } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Monument } from "@/components/monument/Monument";
import { Surroundings } from "@/components/monument/Surroundings";

const CAMERA_POS: [number, number, number] = [18.6, 11.2, 26.4];
const TARGET: [number, number, number] = [0, 7.2, 0];

function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.46;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
      envScene.dispose();
    };
  }, [gl, scene]);
  return null;
}

function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { resetViewToken, explode } = useAtlas();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...CAMERA_POS);
    controls.current?.target.set(...TARGET);
    controls.current?.update();
  }, [camera, resetViewToken]);

  useEffect(() => {
    const node = controls.current;
    if (!node) return;
    const exploded = explode > 0.35;
    node.minDistance = exploded ? 14 : 10;
    node.maxDistance = exploded ? 64 : 44;
  }, [explode]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.065}
      minPolarAngle={0.18}
      maxPolarAngle={Math.PI * 0.49}
      minDistance={10}
      maxDistance={44}
      target={TARGET}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#080a10"]} />
      <fog attach="fog" args={["#0c1018", 48, 110]} />
      <hemisphereLight args={["#c9d6e8", "#12151c", 0.55]} />
      <ambientLight intensity={0.22} color="#e8eef6" />
      <directionalLight
        position={[16, 22, 12]}
        intensity={1.55}
        color="#fff7ee"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={28}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0002}
        shadow-radius={3}
      />
      <directionalLight position={[-14, 8, -10]} intensity={0.42} color="#8eb4d4" />
      <directionalLight position={[0, 6, 18]} intensity={0.28} color="#f0d8b0" />
      <pointLight position={[0, 17.4, 0]} intensity={0.55} color="#e8c48a" distance={14} />
      <StudioEnvironment />
      <SoftShadows size={16} samples={10} focus={0.45} />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.42} scale={32} blur={2.4} far={14} />
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
        <N8AO aoRadius={0.85} intensity={1.15} quality="medium" halfRes color="#0a0c10" distanceFalloff={1.2} />
        <Bloom luminanceThreshold={0.86} intensity={0.2} mipmapBlur />
        <Vignette offset={0.28} darkness={0.32} />
        <SMAA />
      </EffectComposer>
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 38, near: 0.1, far: 220 }}
      dpr={[1, 2]}
      gl={{
        antialias: false,
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
