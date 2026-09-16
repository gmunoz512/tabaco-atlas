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

const CAMERA_POS: [number, number, number] = [34, 16.8, 48];
const CAMERA_POS_NARROW: [number, number, number] = [30, 22, 54];
const TARGET: [number, number, number] = [0, 6.2, 0];
const EXPLODE_CAM: [number, number, number] = [4, 20, 64];
const EXPLODE_CAM_NARROW: [number, number, number] = [2, 26, 72];
const EXPLODE_TARGET: [number, number, number] = [1.2, 6.4, 4];

function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.72;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
      envScene.dispose();
    };
  }, [gl, scene]);
  return null;
}

function assembledPos(narrow: boolean): [number, number, number] {
  return narrow ? CAMERA_POS_NARROW : CAMERA_POS;
}

function explodedPos(narrow: boolean): [number, number, number] {
  return narrow ? EXPLODE_CAM_NARROW : EXPLODE_CAM;
}

function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { resetViewToken, explode } = useAtlas();
  const { camera, size } = useThree();
  const narrow = size.width / Math.max(size.height, 1) < 0.92;
  const framed = useRef<"assembled" | "exploded">("assembled");

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = narrow ? 46 : 40;
    cam.updateProjectionMatrix();
    const exploded = framed.current === "exploded";
    const pos = exploded ? explodedPos(narrow) : assembledPos(narrow);
    const target = exploded ? EXPLODE_TARGET : TARGET;
    camera.position.set(...pos);
    controls.current?.target.set(...target);
    controls.current?.update();
  }, [camera, resetViewToken, narrow]);

  useEffect(() => {
    const node = controls.current;
    if (!node) return;
    const exploded = explode > 0.28;
    node.minDistance = exploded ? 28 : 22;
    node.maxDistance = exploded ? 120 : 90;
  }, [explode]);

  useEffect(() => {
    const next = explode > 0.38 ? "exploded" : explode < 0.14 ? "assembled" : framed.current;
    if (next === framed.current) return;
    framed.current = next;
    const pos = next === "exploded" ? explodedPos(narrow) : assembledPos(narrow);
    const target = next === "exploded" ? EXPLODE_TARGET : TARGET;
    camera.position.set(...pos);
    controls.current?.target.set(...target);
    controls.current?.update();
  }, [explode, camera, narrow]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.065}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI * 0.495}
      minDistance={22}
      maxDistance={90}
      target={TARGET}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#8eb8dc"]} />
      <fog attach="fog" args={["#c5d8ea", 78, 165]} />
      <hemisphereLight args={["#e7f1fb", "#8a9a70", 0.92]} />
      <ambientLight intensity={0.46} color="#f4f1ea" />
      <directionalLight
        position={[18, 28, 14]}
        intensity={2.05}
        color="#fff6e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={90}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={34}
        shadow-camera-bottom={-16}
        shadow-bias={-0.00018}
        shadow-radius={2.4}
      />
      <directionalLight position={[-14, 10, -10]} intensity={0.38} color="#a8c4e0" />
      <directionalLight position={[0, 8, 22]} intensity={0.32} color="#fffdf8" />
      <StudioEnvironment />
      <SoftShadows size={18} samples={10} focus={0.5} />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.22} scale={36} blur={2.6} far={16} />
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
        <N8AO aoRadius={0.7} intensity={0.55} quality="medium" halfRes color="#6a737c" distanceFalloff={1.3} />
        <Bloom luminanceThreshold={0.92} intensity={0.08} mipmapBlur />
        <Vignette offset={0.38} darkness={0.12} />
        <SMAA />
      </EffectComposer>
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 40, near: 0.1, far: 280 }}
      dpr={[1, 2]}
      gl={{
        antialias: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.16,
      }}
      className="absolute inset-0 z-0 h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
