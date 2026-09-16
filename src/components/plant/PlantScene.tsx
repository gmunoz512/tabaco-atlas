import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Ground } from "@/components/plant/Ground";
import { TobaccoPlant } from "@/components/plant/TobaccoPlant";

function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { resetViewToken, exploded } = useAtlas();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(2.9, 1.7, 3.8);
    controls.current?.target.set(0, 1.05, 0);
    controls.current?.update();
  }, [camera, resetViewToken]);

  useEffect(() => {
    const node = controls.current;
    if (!node) return;
    node.minDistance = exploded ? 3.2 : 2.1;
    node.maxDistance = exploded ? 11 : 8.5;
  }, [exploded]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI * 0.62}
      minDistance={2.1}
      maxDistance={8.5}
      target={[0, 1.05, 0]}
    />
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#10140d"]} />
      <hemisphereLight args={["#d7e4c7", "#3a2b1f", 0.72]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[4.2, 6.4, 3.2]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3.5, 2.2, -2.4]} intensity={0.28} color="#f0d7a0" />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <TobaccoPlant />
        <Ground />
      </group>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.38} scale={8} blur={2.2} far={2.4} />
    </>
  );
}

export function PlantScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [2.9, 1.7, 3.8], fov: 42, near: 0.1, far: 40 }}
      dpr={[1, 2]}
      className="h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
