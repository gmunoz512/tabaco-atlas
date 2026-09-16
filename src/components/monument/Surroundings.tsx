import { useMemo } from "react";
import * as THREE from "three";
import { createVoidSkyTexture } from "@/components/monument/geometries";

function VoidDome() {
  const tex = useMemo(() => (typeof document === "undefined" ? null : createVoidSkyTexture()), []);
  return (
    <mesh>
      <sphereGeometry args={[120, 48, 32]} />
      <meshBasicMaterial
        map={tex ?? undefined}
        color={tex ? "#ffffff" : "#10141c"}
        side={THREE.BackSide}
        fog={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function ExhibitRings() {
  const rings = [
    { r: 6.2, w: 0.018, y: 0.012, color: "#8aa0b8", opacity: 0.55 },
    { r: 8.4, w: 0.01, y: 0.01, color: "#6a7c90", opacity: 0.32 },
    { r: 11.6, w: 0.008, y: 0.008, color: "#4a5868", opacity: 0.22 },
  ];
  return (
    <group>
      {rings.map((ring) => (
        <mesh key={ring.r} rotation={[-Math.PI / 2, 0, 0]} position={[0, ring.y, 0]}>
          <ringGeometry args={[ring.r, ring.r + ring.w, 128]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function RadialTicks() {
  const ticks = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return { x: Math.cos(a) * 8.4, z: Math.sin(a) * 8.4, rot: a };
      }),
    [],
  );
  return (
    <group>
      {ticks.map((tick) => (
        <mesh key={tick.rot} position={[tick.x, 0.014, tick.z]} rotation={[0, -tick.rot, 0]}>
          <boxGeometry args={[0.28, 0.006, 0.012]} />
          <meshBasicMaterial color="#7a8fa8" transparent opacity={0.28} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function Surroundings() {
  return (
    <group>
      <VoidDome />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <circleGeometry args={[56, 72]} />
        <meshStandardMaterial color="#0a0d14" roughness={1} metalness={0.04} envMapIntensity={0.12} />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[12.4, 12.4, 0.05, 80]} />
        <meshPhysicalMaterial
          color="#121722"
          roughness={0.42}
          metalness={0.38}
          envMapIntensity={0.4}
          clearcoat={0.12}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[7.15, 7.15, 0.04, 80]} />
        <meshPhysicalMaterial
          color="#171d28"
          roughness={0.38}
          metalness={0.42}
          envMapIntensity={0.45}
        />
      </mesh>
      <ExhibitRings />
      <RadialTicks />
    </group>
  );
}
