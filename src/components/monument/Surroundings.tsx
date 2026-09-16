import { useMemo } from "react";
import * as THREE from "three";
import { createDaySkyTexture } from "@/components/monument/geometries";

function DaySky() {
  const tex = useMemo(() => (typeof document === "undefined" ? null : createDaySkyTexture()), []);
  return (
    <mesh>
      <sphereGeometry args={[160, 48, 32]} />
      <meshBasicMaterial
        map={tex ?? undefined}
        color={tex ? "#ffffff" : "#8eb8dc"}
        side={THREE.BackSide}
        fog={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function SoftCloud({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 20, 12]} />
      <meshBasicMaterial color="#f4f8fd" transparent opacity={0.22} depthWrite={false} fog={false} />
    </mesh>
  );
}

export function Surroundings() {
  return (
    <group>
      <DaySky />
      <SoftCloud position={[-38, 42, -70]} scale={[18, 4.2, 8]} />
      <SoftCloud position={[46, 48, -62]} scale={[14, 3.4, 7]} />
      <SoftCloud position={[12, 38, -88]} scale={[22, 3.8, 9]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]} receiveShadow>
        <circleGeometry args={[32, 72]} />
        <meshStandardMaterial color="#7d9560" roughness={0.92} metalness={0.02} envMapIntensity={0.18} />
      </mesh>
      <mesh position={[0, -0.34, 0]} receiveShadow>
        <cylinderGeometry args={[14.2, 17.6, 0.72, 80]} />
        <meshStandardMaterial color="#708854" roughness={0.9} metalness={0.02} envMapIntensity={0.16} />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[10.4, 11.2, 0.08, 80]} />
        <meshStandardMaterial color="#667d4e" roughness={0.88} metalness={0.03} envMapIntensity={0.2} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]} receiveShadow>
        <ringGeometry args={[7.35, 8.85, 96]} />
        <meshStandardMaterial color="#d8d2c6" roughness={0.62} metalness={0.08} envMapIntensity={0.28} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]}>
        <ringGeometry args={[8.82, 8.98, 96]} />
        <meshBasicMaterial color="#e2c14a" toneMapped={false} />
      </mesh>
    </group>
  );
}
