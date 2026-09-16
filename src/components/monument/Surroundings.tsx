import { Cloud, Clouds } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createDuskSkyTexture } from "@/components/monument/geometries";

function mulberry(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function createTerrain() {
  const geo = new THREE.CircleGeometry(56, 120);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const light = new THREE.Color("#7f9a55");
  const dark = new THREE.Color("#4e6a38");
  const lawn = new THREE.Color("#8fb35c");
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.hypot(x, y);
    const n = Math.sin(x * 0.21) * 0.14 + Math.cos(y * 0.16) * 0.12 + Math.sin((x + y) * 0.09) * 0.2;
    let h = 0;
    if (r < 6.2) h = 0.04;
    else if (r < 11) h = -0.05 - (r - 6.2) * 0.14 + n * 0.18;
    else if (r < 22) h = -0.72 - (r - 11) * 0.08 + n * 0.4;
    else h = -1.6 - (r - 22) * 0.04 + n * 0.55;
    pos.setZ(i, h);
    const mix = r < 8 ? lawn : r < 18 ? light : dark;
    const jitter = 0.92 + mulberry(i * 13) * 0.16;
    colors[i * 3] = mix.r * jitter;
    colors[i * 3 + 1] = mix.g * jitter;
    colors[i * 3 + 2] = mix.b * jitter;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

function DuskDome() {
  const tex = useMemo(() => (typeof document === "undefined" ? null : createDuskSkyTexture()), []);
  return (
    <mesh>
      <sphereGeometry args={[110, 48, 32]} />
      <meshBasicMaterial map={tex ?? undefined} color={tex ? "#ffffff" : "#6a86a8"} side={THREE.BackSide} fog={false} />
    </mesh>
  );
}

function Palm({ x, z, y = 0, scale = 1 }: { x: number; z: number; y?: number; scale?: number }) {
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.07, 1.7, 8]} />
        <meshStandardMaterial color="#6b5136" roughness={0.96} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 1.72, 0]} rotation={[1.05, (i / 6) * Math.PI * 2, 0]}>
          <coneGeometry args={[0.18, 0.85, 7]} />
          <meshStandardMaterial color="#3a5c32" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function HedgeRing() {
  const hedges = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return { x: Math.cos(a) * 6.05, z: Math.sin(a) * 6.05, rot: a };
      }),
    [],
  );
  return (
    <group>
      {hedges.map((h) => (
        <mesh key={`${h.x}-${h.z}`} position={[h.x, 0.18, h.z]} rotation={[0, h.rot, 0]} receiveShadow>
          <boxGeometry args={[1.8, 0.36, 0.28]} />
          <meshStandardMaterial color="#4a6b38" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Road() {
  const dashes = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return { x: Math.cos(a) * 8.35, z: Math.sin(a) * 8.35, rot: a };
      }),
    [],
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <ringGeometry args={[7.15, 9.55, 96]} />
        <meshStandardMaterial color="#3a3938" roughness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.038, 0]}>
        <ringGeometry args={[7.22, 7.34, 96]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.038, 0]}>
        <ringGeometry args={[9.36, 9.48, 96]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.7} />
      </mesh>
      {dashes.map((d) => (
        <mesh key={`${d.x}-${d.z}`} position={[d.x, 0.042, d.z]} rotation={[0, d.rot, 0]}>
          <boxGeometry args={[0.55, 0.01, 0.07]} />
          <meshStandardMaterial color="#d9d4c6" roughness={0.65} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]} receiveShadow>
        <ringGeometry args={[9.55, 10.4, 96]} />
        <meshStandardMaterial color="#6f8c4e" roughness={1} />
      </mesh>
    </group>
  );
}

function CityField() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 320;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const palette = useMemo(
    () =>
      ["#efe6d4", "#e2c9a4", "#d7b48a", "#c9cfd4", "#f0d0b0", "#b8c3b0", "#e8b8a0", "#dcd6c8"].map(
        (hex) => new THREE.Color(hex),
      ),
    [],
  );

  useLayoutEffect(() => {
    const node = mesh.current;
    if (!node) return;
    for (let i = 0; i < count; i += 1) {
      const a = mulberry(i * 3) * Math.PI * 2;
      const r = 13 + mulberry(i * 7) * 28;
      const h = 0.45 + mulberry(i * 11) * 1.8 + (r > 28 ? mulberry(i * 17) * 2.2 : 0);
      const yBase = r < 18 ? -0.85 : r < 28 ? -1.15 : -1.45;
      dummy.position.set(Math.cos(a) * r, yBase + h / 2, Math.sin(a) * r);
      dummy.scale.set(0.45 + mulberry(i * 19) * 0.7, h, 0.45 + mulberry(i * 23) * 0.7);
      dummy.rotation.set(0, mulberry(i * 29) * 0.4, 0);
      dummy.updateMatrix();
      node.setMatrixAt(i, dummy.matrix);
      node.setColorAt(i, palette[i % palette.length]);
    }
    node.instanceMatrix.needsUpdate = true;
    if (node.instanceColor) node.instanceColor.needsUpdate = true;
  }, [count, dummy, palette]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false} castShadow={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.86} metalness={0.04} />
    </instancedMesh>
  );
}

function DistantHills() {
  const hills = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = 46 + mulberry(i * 5) * 8;
        return {
          x: Math.cos(a) * r,
          z: Math.sin(a) * r,
          w: 10 + mulberry(i * 9) * 8,
          h: 1.8 + mulberry(i * 13) * 2,
        };
      }),
    [],
  );
  return (
    <group>
      {hills.map((hill, i) => (
        <mesh key={i} position={[hill.x, hill.h * 0.1 - 2.1, hill.z]} scale={[hill.w, hill.h, hill.w * 0.7]}>
          <sphereGeometry args={[1, 14, 8]} />
          <meshStandardMaterial color={i % 2 ? "#5d6e58" : "#4f614c"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function Surroundings() {
  const terrain = useMemo(() => createTerrain(), []);
  const palms = useMemo(
    () => [
      { x: 8.8, z: 6.4, y: -0.15, s: 1.15 },
      { x: 10.2, z: 3.1, y: -0.22, s: 0.95 },
      { x: 7.6, z: 9.0, y: -0.28, s: 1.05 },
      { x: -7.4, z: 7.8, y: -0.18, s: 1.2 },
      { x: -9.5, z: 4.2, y: -0.25, s: 0.9 },
      { x: -8.2, z: -6.6, y: -0.2, s: 1.1 },
      { x: 4.1, z: 10.4, y: -0.3, s: 0.8 },
      { x: 11.0, z: -2.4, y: -0.35, s: 1 },
      { x: -3.2, z: 9.6, y: -0.22, s: 0.85 },
    ],
    [],
  );

  return (
    <group>
      <DuskDome />
      <Clouds frustumCulled={false}>
        <Cloud
          seed={1}
          position={[-22, 16, -6]}
          segments={28}
          bounds={[18, 4, 10]}
          volume={22}
          color="#2f3d52"
          fade={80}
          speed={0.04}
          opacity={0.55}
        />
        <Cloud
          seed={2}
          position={[20, 14, 4]}
          segments={24}
          bounds={[14, 3, 9]}
          volume={16}
          color="#f0c39a"
          fade={80}
          speed={0.03}
          opacity={0.4}
        />
        <Cloud
          seed={3}
          position={[2, 18, -24]}
          segments={22}
          bounds={[20, 3, 8]}
          volume={14}
          color="#d5deea"
          fade={90}
          speed={0.02}
          opacity={0.35}
        />
      </Clouds>
      <mesh geometry={terrain} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]} receiveShadow>
        <circleGeometry args={[6.15, 64]} />
        <meshStandardMaterial color="#8fb35c" roughness={1} />
      </mesh>
      <HedgeRing />
      <Road />
      {palms.map((p) => (
        <Palm key={`${p.x}-${p.z}`} x={p.x} z={p.z} y={p.y} scale={p.s} />
      ))}
      <CityField />
      <DistantHills />
    </group>
  );
}
