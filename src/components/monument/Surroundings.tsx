import { useMemo } from "react";
import * as THREE from "three";
import {
  createDaySkyTexture,
  createDominicanFlagTexture,
  createSideFlagTexture,
} from "@/components/monument/geometries";

function DaySky() {
  const tex = useMemo(() => (typeof document === "undefined" ? null : createDaySkyTexture()), []);
  return (
    <mesh>
      <sphereGeometry args={[180, 64, 40]} />
      <meshBasicMaterial
        map={tex ?? undefined}
        color={tex ? "#ffffff" : "#5ea0dc"}
        side={THREE.BackSide}
        fog={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function Palm({ position, scale = 1, tilt = 0 }: { position: [number, number, number]; scale?: number; tilt?: number }) {
  const fronds = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return {
          x: Math.cos(a) * 0.55,
          z: Math.sin(a) * 0.55,
          rot: a,
          drop: 0.18 + (i % 3) * 0.06,
        };
      }),
    [],
  );
  return (
    <group position={position} scale={scale} rotation={[0, tilt, 0.04]}>
      <mesh position={[0, 2.05, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.16, 4.1, 12]} />
        <meshStandardMaterial color="#8a6a42" roughness={0.78} />
      </mesh>
      <mesh position={[0, 4.15, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color="#3f6b32" roughness={0.7} />
      </mesh>
      {fronds.map((f) => (
        <mesh
          key={f.rot}
          position={[f.x * 0.35, 4.22, f.z * 0.35]}
          rotation={[0.95 + f.drop, f.rot, 0]}
          castShadow
        >
          <boxGeometry args={[0.18, 0.04, 1.55]} />
          <meshStandardMaterial color="#4f8a3c" roughness={0.62} />
        </mesh>
      ))}
    </group>
  );
}

function Flag({
  position,
  texture,
  height = 7.4,
  yaw = 0.12,
}: {
  position: [number, number, number];
  texture: THREE.Texture | null;
  height?: number;
  yaw?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.034, height, 10]} />
        <meshStandardMaterial color="#d8d0c4" metalness={0.35} roughness={0.38} />
      </mesh>
      <mesh position={[0, height + 0.04, 0]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.78, height - 0.62, 0]} rotation={[0, yaw, 0.08]} castShadow>
        <planeGeometry args={[1.55, 0.95]} />
        <meshStandardMaterial
          map={texture ?? undefined}
          color={texture ? "#ffffff" : "#ce1126"}
          side={THREE.DoubleSide}
          roughness={0.55}
        />
      </mesh>
    </group>
  );
}

function HedgeRing({ radius, y = 0.28 }: { radius: number; y?: number }) {
  const bushes = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        return [Math.cos(a) * radius, Math.sin(a) * radius] as const;
      }),
    [radius],
  );
  return (
    <group>
      {bushes.map(([x, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.55, 0.52, 0.4]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#5d8a3e" : "#4e7a36"} roughness={0.82} />
        </mesh>
      ))}
      {bushes.filter((_, i) => i % 2 === 0).map(([x, z], i) => (
        <mesh key={`f${i}`} position={[x * 1.02, y + 0.18, z * 1.02]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color="#c45a4a" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function Surroundings() {
  const drFlag = useMemo(() => (typeof document === "undefined" ? null : createDominicanFlagTexture()), []);
  const whiteFlag = useMemo(() => (typeof document === "undefined" ? null : createSideFlagTexture("#f4f1ea")), []);
  const crestFlag = useMemo(() => (typeof document === "undefined" ? null : createSideFlagTexture("#e8e4dc")), []);

  return (
    <group>
      <DaySky />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, 0]} receiveShadow>
        <circleGeometry args={[42, 80]} />
        <meshStandardMaterial color="#6f8f4e" roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh position={[0, -0.28, 2]} receiveShadow>
        <cylinderGeometry args={[13.5, 16.8, 0.62, 72]} />
        <meshStandardMaterial color="#67864a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 6.4]} receiveShadow>
        <cylinderGeometry args={[5.4, 6.2, 0.12, 48]} />
        <meshStandardMaterial color="#5f8044" roughness={0.86} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 12.4]} receiveShadow>
        <ringGeometry args={[3.6, 7.6, 64, 1, Math.PI * 0.18, Math.PI * 0.64]} />
        <meshStandardMaterial color="#cfc6b6" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 12.4]}>
        <ringGeometry args={[7.55, 7.78, 64, 1, Math.PI * 0.18, Math.PI * 0.64]} />
        <meshBasicMaterial color="#e2c14a" toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]} receiveShadow>
        <ringGeometry args={[7.6, 9.1, 96]} />
        <meshStandardMaterial color="#d5cec0" roughness={0.64} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]}>
        <ringGeometry args={[9.05, 9.22, 96]} />
        <meshBasicMaterial color="#e2c14a" toneMapped={false} />
      </mesh>

      <group position={[0, 0, 11.65]}>
        <HedgeRing radius={2.15} />
        <HedgeRing radius={2.85} y={0.22} />
      </group>

      <Palm position={[-9.2, 0, 7.4]} scale={1.15} tilt={0.4} />
      <Palm position={[-11.4, 0, 11.2]} scale={1.35} tilt={-0.2} />
      <Palm position={[-8.6, 0, 14.8]} scale={1.05} tilt={0.7} />
      <Palm position={[8.8, 0, 6.8]} scale={1.2} tilt={2.2} />
      <Palm position={[11.2, 0, 10.6]} scale={1.42} tilt={2.6} />
      <Palm position={[9.4, 0, 14.4]} scale={1.08} tilt={3.1} />
      <Palm position={[-6.4, 0, 4.2]} scale={0.82} tilt={0.1} />
      <Palm position={[6.8, 0, 3.8]} scale={0.78} tilt={1.8} />

      <Flag position={[-1.92, 0, 3.55]} texture={whiteFlag} height={7.05} yaw={0.18} />
      <Flag position={[0, 0, 3.72]} texture={drFlag} height={7.55} yaw={0.08} />
      <Flag position={[1.92, 0, 3.55]} texture={crestFlag} height={7.05} yaw={-0.12} />

      {[-4.8, 4.8].map((x) => (
        <group key={x} position={[x, 1.35, 8.4]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 2.7, 8]} />
            <meshStandardMaterial color="#2a2a28" roughness={0.45} metalness={0.4} />
          </mesh>
          <mesh position={[0, 1.15, 0]}>
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial color="#f2e6c4" emissive="#f2e6c4" emissiveIntensity={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
