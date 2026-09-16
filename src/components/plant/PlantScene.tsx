import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Ground } from "@/components/plant/Ground";
import { TobaccoPlant } from "@/components/plant/TobaccoPlant";

const CAMERA_POS: [number, number, number] = [5.4, 2.05, 4.3];
const TARGET: [number, number, number] = [0, 1.05, 0];

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
    node.minDistance = exploded ? 4.2 : 3.2;
    node.maxDistance = exploded ? 12 : 9;
  }, [exploded]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={0.55}
      maxPolarAngle={Math.PI * 0.49}
      minDistance={3.2}
      maxDistance={9}
      target={TARGET}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#10140d"]} />
      <hemisphereLight args={["#d7e4c7", "#3a2b1f", 0.85]} />
      <ambientLight intensity={0.38} />
      <directionalLight
        position={[5.4, 7.2, 4.1]}
        intensity={1.45}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3.8, 2.8, -2.6]} intensity={0.35} color="#f0d7a0" />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <TobaccoPlant />
        <Ground />
      </group>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.32} scale={9} blur={2.4} far={2.8} />
    </>
  );
}

export function PlantScene() {
  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POS, fov: 42, near: 0.1, far: 50 }}
      dpr={[1, 2]}
      className="h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
