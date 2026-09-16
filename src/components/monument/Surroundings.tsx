import { useMemo } from "react";
import * as THREE from "three";

function mulberry(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function createTerrain() {
  const geo = new THREE.CircleGeometry(48, 96);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.hypot(x, y);
    const n =
      Math.sin(x * 0.18) * 0.12 +
      Math.cos(y * 0.14) * 0.1 +
      Math.sin((x + y) * 0.07) * 0.18;
    let h = 0;
    if (r < 5.6) {
      h = 0.02;
    } else if (r < 9.5) {
      h = -0.08 - (r - 5.6) * 0.16 + n * 0.15;
    } else if (r < 18) {
      h = -0.72 - (r - 9.5) * 0.09 + n * 0.35;
    } else {
      h = -1.5 - (r - 18) * 0.045 + n * 0.5;
    }
    pos.setZ(i, h);
  }
  geo.computeVertexNormals();
  return geo;
}

function grassMaps() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#5a7348";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 12000; i += 1) {
    const g = 70 + Math.random() * 80;
    ctx.fillStyle = `rgba(${g - 18},${g},${g - 28},${0.08 + Math.random() * 0.18})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 2 + Math.random() * 4);
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(14, 14);
  map.anisotropy = 4;
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

function Palm({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0.02, z]} scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.05, 1.1, 8]} />
        <meshStandardMaterial color="#5c4a38" roughness={0.96} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[0, 1.12, 0]}
          rotation={[0.95, (i / 5) * Math.PI * 2, 0]}
        >
          <coneGeometry args={[0.16, 0.55, 6]} />
          <meshStandardMaterial color="#35543a" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function DistantHills() {
  const hills = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const a = Math.PI * 0.7 + i * 0.28;
        const r = 40 + mulberry(i * 19) * 10;
        return {
          x: Math.cos(a) * r,
          z: Math.sin(a) * r,
          w: 9 + mulberry(i * 3) * 8,
          h: 1.6 + mulberry(i * 7) * 1.8,
        };
      }),
    [],
  );
  return (
    <group>
      {hills.map((hill, i) => (
        <mesh key={i} position={[hill.x, hill.h * 0.08 - 1.9, hill.z]} scale={[hill.w, hill.h, hill.w * 0.65]}>
          <sphereGeometry args={[1, 14, 8]} />
          <meshStandardMaterial color={i % 2 ? "#6d7c70" : "#617066"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function DistantCity() {
  const blocks = useMemo(() => {
    const list: { x: number; y: number; z: number; w: number; h: number; d: number; color: string }[] = [];
    const colors = ["#8b908a", "#7d8688", "#918a80", "#6f7774"];
    for (let i = 0; i < 36; i += 1) {
      const a = Math.PI * 0.65 + mulberry(i * 11) * 1.7;
      const r = 38 + mulberry(i * 17) * 12;
      const h = 0.7 + mulberry(i * 23) * 2.4;
      list.push({
        x: Math.cos(a) * r,
        y: h / 2 - 1.35,
        z: Math.sin(a) * r,
        w: 0.35 + mulberry(i * 29) * 0.55,
        h,
        d: 0.35 + mulberry(i * 31) * 0.55,
        color: colors[i % colors.length],
      });
    }
    return list;
  }, []);
  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color={b.color} roughness={0.95} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

export function Surroundings() {
  const terrain = useMemo(() => createTerrain(), []);
  const grass = useMemo(() => (typeof document === "undefined" ? null : grassMaps()), []);
  const palms = useMemo(
    () => [
      { x: 6.4, z: 4.2, s: 1 },
      { x: 7.1, z: -1.8, s: 0.85 },
      { x: -5.8, z: 5.1, s: 1.1 },
      { x: -6.6, z: -3.4, s: 0.9 },
      { x: 3.2, z: 7.4, s: 0.75 },
      { x: -2.4, z: -7.0, s: 0.95 },
      { x: 8.4, z: 1.2, s: 0.7 },
    ],
    [],
  );

  return (
    <group>
      <mesh geometry={terrain} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#7a9160" map={grass ?? undefined} roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[6.6, 8.15, 72]} />
        <meshStandardMaterial color="#5a5854" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]} receiveShadow>
        <ringGeometry args={[7.25, 7.55, 72]} />
        <meshStandardMaterial color="#8a8680" roughness={0.85} />
      </mesh>
      {palms.map((p) => (
        <Palm key={`${p.x}-${p.z}`} x={p.x} z={p.z} scale={p.s} />
      ))}
      <DistantHills />
      <DistantCity />
    </group>
  );
}
