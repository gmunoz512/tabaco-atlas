import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Hill } from "@/components/monument/Hill";
import { Monument } from "@/components/monument/Monument";

const CAMERA_POS: [number, number, number] = [11.5, 6.2, 13.2];
const TARGET: [number, number, number] = [0, 3.6, 0];

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
    node.minDistance = exploded ? 8 : 6.5;
    node.maxDistance = exploded ? 32 : 22;
  }, [exploded]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={0.22}
      maxPolarAngle={Math.PI * 0.48}
      minDistance={6.5}
      maxDistance={22}
      target={TARGET}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#0c1118"]} />
      <fog attach="fog" args={["#0c1118", 22, 48]} />
      <hemisphereLight args={["#8aa0b8", "#2a1c12", 0.72]} />
      <ambientLight intensity={0.32} />
      <directionalLight
        position={[10, 14, 6]}
        intensity={1.55}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={14}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-8, 4, -6]} intensity={0.28} color="#f0c98a" />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <Monument />
        <Hill />
      </group>
      <ContactShadows position={[0, -0.02, 0]} opacity={0.38} scale={18} blur={2.6} far={6} />
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 42, near: 0.1, far: 80 }}
      dpr={[1, 2]}
      className="h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
