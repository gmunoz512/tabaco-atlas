import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  createAsphaltTexture,
  createDuskSkyTexture,
  createFacadeTexture,
  createGrassTexture,
} from "@/components/monument/geometries";

function mulberry(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function terrainHeight(x: number, z: number) {
  const r = Math.hypot(x, z);
  const n = Math.sin(x * 0.19) * 0.16 + Math.cos(z * 0.14) * 0.14 + Math.sin((x + z) * 0.08) * 0.22;
  if (r < 5.8) return 0.05;
  if (r < 7.2) return 0.02 - (r - 5.8) * 0.04 + n * 0.04;
  if (r < 10.2) return -0.08 - (r - 7.2) * 0.05 + n * 0.06;
  if (r < 16) return -0.28 - (r - 10.2) * 0.12 + n * 0.28;
  if (r < 28) return -1.0 - (r - 16) * 0.07 + n * 0.4;
  return -1.85 - (r - 28) * 0.035 + n * 0.5;
}

function createTerrain() {
  const geo = new THREE.CircleGeometry(62, 140);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const lawn = new THREE.Color("#8fb85a");
  const mid = new THREE.Color("#6d9248");
  const far = new THREE.Color("#4e6c36");
  const dirt = new THREE.Color("#6a6840");
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.hypot(x, y);
    pos.setZ(i, terrainHeight(x, y));
    let mix = far;
    if (r < 6.4) mix = lawn;
    else if (r < 11) mix = lawn.clone().lerp(mid, 0.35);
    else if (r < 20) mix = mid;
    else if (r < 36) mix = far;
    else mix = dirt.clone().lerp(far, 0.55);
    const jitter = 0.88 + mulberry(i * 17) * 0.22;
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
      <sphereGeometry args={[160, 64, 40]} />
      <meshBasicMaterial
        map={tex ?? undefined}
        color={tex ? "#ffffff" : "#5a7394"}
        side={THREE.BackSide}
        fog={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function Palm({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const y = terrainHeight(x, z);
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.09, 2.3, 8]} />
        <meshStandardMaterial color="#6a4e32" roughness={0.96} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh key={i} position={[0, 2.28, 0]} rotation={[1.12, (i / 8) * Math.PI * 2, 0.08]}>
          <boxGeometry args={[0.08, 0.02, 1.15]} />
          <meshStandardMaterial color="#3d6a38" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function HedgeBeds() {
  const beds = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + 0.1;
        return { x: Math.cos(a) * 6.15, z: Math.sin(a) * 6.15, rot: a, w: 1.55 + (i % 3) * 0.2 };
      }),
    [],
  );
  return (
    <group>
      {beds.map((h) => (
        <mesh key={`${h.x}-${h.z}`} position={[h.x, 0.22, h.z]} rotation={[0, h.rot, 0]} receiveShadow>
          <boxGeometry args={[h.w, 0.42, 0.32]} />
          <meshStandardMaterial color="#3f6232" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function RoadSystem() {
  const asphalt = useMemo(() => (typeof document === "undefined" ? null : createAsphaltTexture()), []);
  const curve = useMemo(() => {
    const raw: [number, number][] = [
      [-20, 16],
      [-12, 12.2],
      [-3, 11.4],
      [5, 12.6],
      [13, 11.2],
      [18, 4.5],
      [16, -6],
      [8, -14],
      [-4, -16],
      [-16, -8],
      [-20, 4],
    ];
    const pts = raw.map(([x, z]) => new THREE.Vector3(x, terrainHeight(x, z) + 0.08, z));
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.35);
  }, []);
  const ribbon = useMemo(() => new THREE.TubeGeometry(curve, 180, 1.35, 6, false), [curve]);
  const edge = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return { x: Math.cos(a) * 8.4, z: Math.sin(a) * 7.15, rot: a };
      }),
    [],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.4]} scale={[1.22, 1, 0.92]} receiveShadow>
        <ringGeometry args={[7.05, 9.45, 96]} />
        <meshStandardMaterial map={asphalt ?? undefined} color="#3c3b3a" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0.4]} scale={[1.22, 1, 0.92]}>
        <ringGeometry args={[7.12, 7.24, 96]} />
        <meshStandardMaterial color="#d8d2c6" roughness={0.74} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0.4]} scale={[1.22, 1, 0.92]}>
        <ringGeometry args={[9.28, 9.4, 96]} />
        <meshStandardMaterial color="#d8d2c6" roughness={0.74} />
      </mesh>
      {edge.map((d, i) =>
        i % 3 === 0 ? null : (
          <mesh key={`${d.x}-${d.z}`} position={[d.x * 1.22, 0.034, d.z * 0.92 + 0.4]} rotation={[0, d.rot, 0]}>
            <boxGeometry args={[0.42, 0.008, 0.055]} />
            <meshStandardMaterial color="#cfc8ba" roughness={0.7} />
          </mesh>
        ),
      )}
      <mesh geometry={ribbon} scale={[1, 0.06, 1]} receiveShadow>
        <meshStandardMaterial map={asphalt ?? undefined} color="#3a3938" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0.4]} scale={[1.22, 1, 0.92]} receiveShadow>
        <ringGeometry args={[9.45, 10.5, 96]} />
        <meshStandardMaterial color="#73944c" roughness={1} />
      </mesh>
    </group>
  );
}

type BuildingSpec = {
  x: number;
  z: number;
  y: number;
  sx: number;
  h: number;
  sz: number;
  rot: number;
  color: THREE.Color;
  roof: THREE.Color;
  tall: boolean;
};

function buildCity(): BuildingSpec[] {
  const palette = [
    "#f2e4cc",
    "#efc07a",
    "#e8a090",
    "#d9c4a0",
    "#cfe0d4",
    "#f0d8b4",
    "#e8c9a0",
    "#dcc8b0",
    "#f7eee0",
    "#c8d4c0",
    "#e4b070",
    "#d8dce0",
  ].map((hex) => new THREE.Color(hex));
  const roofs = ["#8a4a32", "#6e5340", "#9a6a48", "#5c5854", "#a07050", "#c45c38"].map((hex) => new THREE.Color(hex));
  const out: BuildingSpec[] = [];
  for (let gx = -48; gx <= 48; gx += 1.35) {
    for (let gz = -48; gz <= 48; gz += 1.35) {
      const streetX = Math.abs((gx + 200) % 8.4) < 1.25;
      const streetZ = Math.abs((gz + 200) % 8.4) < 1.25;
      if (streetX || streetZ) continue;
      const jx = gx + (mulberry(gx * 13 + gz * 7) - 0.5) * 0.4;
      const jz = gz + (mulberry(gx * 19 + gz * 11) - 0.5) * 0.4;
      const r = Math.hypot(jx, jz);
      if (r < 13.2 || r > 51) continue;
      if (mulberry(gx * 3 + gz * 5) < 0.06) continue;
      if (out.length >= 920) return out;
      const tall = r > 30 && mulberry(gx * 9 + gz) > 0.93;
      const h = tall
        ? 1.6 + mulberry(gx * 17 + gz) * 2.4
        : 0.32 + mulberry(gx * 11 + gz * 3) * 0.7 + (r > 32 ? mulberry(gx + gz) * 0.35 : 0);
      const yBase = terrainHeight(jx, jz);
      out.push({
        x: jx,
        z: jz,
        y: yBase + h / 2,
        sx: tall ? 0.85 + mulberry(gx) * 0.7 : 0.55 + mulberry(gx * 23) * 0.7,
        h,
        sz: tall ? 0.7 + mulberry(gz) * 0.65 : 0.5 + mulberry(gz * 29) * 0.65,
        rot: (mulberry(gx * 31 + gz) - 0.5) * 0.2,
        color: palette[Math.floor(mulberry(gx * 41 + gz) * palette.length)],
        roof: roofs[Math.floor(mulberry(gx * 43 + gz * 3) * roofs.length)],
        tall,
      });
    }
  }
  return out;
}

function CityField() {
  const buildings = useMemo(() => buildCity(), []);
  const houses = useMemo(() => buildings.filter((b) => !b.tall), [buildings]);
  const towers = useMemo(() => buildings.filter((b) => b.tall), [buildings]);
  const houseMesh = useRef<THREE.InstancedMesh>(null);
  const roofMesh = useRef<THREE.InstancedMesh>(null);
  const towerMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const facade = useMemo(() => (typeof document === "undefined" ? null : createFacadeTexture()), []);

  useLayoutEffect(() => {
    const body = houseMesh.current;
    const roof = roofMesh.current;
    if (!body || !roof) return;
    houses.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z);
      dummy.scale.set(b.sx, b.h, b.sz);
      dummy.rotation.set(0, b.rot, 0);
      dummy.updateMatrix();
      body.setMatrixAt(i, dummy.matrix);
      body.setColorAt(i, b.color);
      dummy.position.set(b.x, b.y + b.h / 2 + 0.1, b.z);
      dummy.scale.set(b.sx * 0.72, 0.22, b.sz * 0.72);
      dummy.updateMatrix();
      roof.setMatrixAt(i, dummy.matrix);
      roof.setColorAt(i, b.roof);
    });
    body.instanceMatrix.needsUpdate = true;
    roof.instanceMatrix.needsUpdate = true;
    if (body.instanceColor) body.instanceColor.needsUpdate = true;
    if (roof.instanceColor) roof.instanceColor.needsUpdate = true;
  }, [dummy, houses]);

  useLayoutEffect(() => {
    const node = towerMesh.current;
    if (!node) return;
    towers.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z);
      dummy.scale.set(b.sx, b.h, b.sz);
      dummy.rotation.set(0, b.rot, 0);
      dummy.updateMatrix();
      node.setMatrixAt(i, dummy.matrix);
      node.setColorAt(i, b.color);
    });
    node.instanceMatrix.needsUpdate = true;
    if (node.instanceColor) node.instanceColor.needsUpdate = true;
  }, [dummy, towers]);

  return (
    <group>
      <instancedMesh ref={houseMesh} args={[undefined, undefined, Math.max(houses.length, 1)]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={facade ?? undefined} roughness={0.88} metalness={0.03} />
      </instancedMesh>
      <instancedMesh ref={roofMesh} args={[undefined, undefined, Math.max(houses.length, 1)]} frustumCulled={false}>
        <coneGeometry args={[0.85, 0.55, 4]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={towerMesh} args={[undefined, undefined, Math.max(towers.length, 1)]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={facade ?? undefined} roughness={0.82} metalness={0.08} />
      </instancedMesh>
    </group>
  );
}

function TreeField() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const trunks = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 70;
  const spots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = mulberry(i * 3) * Math.PI * 2;
        const r = 10.4 + mulberry(i * 7) * (i % 3 === 0 ? 22 : 4.5);
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        return { x, z, y: terrainHeight(x, z), s: 0.65 + mulberry(i * 11) * 0.9 };
      }).filter((s) => Math.hypot(s.x, s.z) > 10.1),
    [],
  );

  useLayoutEffect(() => {
    const canopy = mesh.current;
    const trunk = trunks.current;
    if (!canopy || !trunk) return;
    spots.forEach((s, i) => {
      dummy.position.set(s.x, s.y + 0.35 * s.s, s.z);
      dummy.scale.set(0.07 * s.s, 0.7 * s.s, 0.07 * s.s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      trunk.setMatrixAt(i, dummy.matrix);
      dummy.position.set(s.x, s.y + 0.95 * s.s, s.z);
      dummy.scale.set(0.55 * s.s, 0.7 * s.s, 0.55 * s.s);
      dummy.updateMatrix();
      canopy.setMatrixAt(i, dummy.matrix);
    });
    canopy.instanceMatrix.needsUpdate = true;
    trunk.instanceMatrix.needsUpdate = true;
  }, [dummy, spots]);

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, spots.length]} frustumCulled={false}>
        <cylinderGeometry args={[1, 1.4, 1, 5]} />
        <meshStandardMaterial color="#5a4030" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, spots.length]} frustumCulled={false} castShadow>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#3d5e32" roughness={1} />
      </instancedMesh>
    </group>
  );
}

function DistantHills() {
  const hills = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 + 0.2;
        const r = 54 + mulberry(i * 5) * 10;
        return {
          x: Math.cos(a) * r,
          z: Math.sin(a) * r,
          w: 14 + mulberry(i * 9) * 12,
          h: 2.4 + mulberry(i * 13) * 3.2,
        };
      }),
    [],
  );
  return (
    <group>
      {hills.map((hill, i) => (
        <mesh key={i} position={[hill.x, hill.h * 0.12 - 2.4, hill.z]} scale={[hill.w, hill.h, hill.w * 0.65]}>
          <sphereGeometry args={[1, 16, 10]} />
          <meshStandardMaterial color={i % 2 ? "#4f6148" : "#44563f"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Flagpoles() {
  const poles = [
    [4.9, 3.35],
    [5.25, 2.55],
    [5.5, 1.7],
  ] as const;
  return (
    <group>
      {poles.map(([x, z], i) => (
        <group key={i} position={[x, terrainHeight(x, z), z]}>
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 2.3, 8]} />
            <meshStandardMaterial color="#cfc8bc" metalness={0.35} roughness={0.4} />
          </mesh>
          <mesh position={[0.22, 1.95, 0]}>
            <planeGeometry args={[0.42, 0.26]} />
            <meshStandardMaterial color={i === 1 ? "#ffffff" : i === 0 ? "#0c2d8a" : "#c8102e"} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Surroundings() {
  const terrain = useMemo(() => createTerrain(), []);
  const grass = useMemo(() => (typeof document === "undefined" ? null : createGrassTexture()), []);
  const palms = useMemo(
    () => [
      { x: 9.4, z: 7.2, s: 1.25 },
      { x: 11.2, z: 3.6, s: 1.05 },
      { x: 8.2, z: 10.2, s: 1.15 },
      { x: -8.0, z: 8.6, s: 1.3 },
      { x: -10.4, z: 4.6, s: 0.95 },
      { x: -9.0, z: -7.2, s: 1.2 },
      { x: 4.6, z: 11.4, s: 0.9 },
      { x: 12.2, z: -2.8, s: 1.1 },
      { x: -3.6, z: 10.6, s: 0.92 },
      { x: 10.6, z: 8.8, s: 0.8 },
      { x: 7.4, z: -9.2, s: 1.05 },
    ],
    [],
  );

  return (
    <group>
      <DuskDome />
      <mesh geometry={terrain} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial map={grass ?? undefined} vertexColors roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]} receiveShadow>
        <circleGeometry args={[5.9, 72]} />
        <meshStandardMaterial color="#8fba5e" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.048, 0]} receiveShadow>
        <ringGeometry args={[5.9, 7.05, 72]} />
        <meshStandardMaterial color="#7fa34f" roughness={1} />
      </mesh>
      <HedgeBeds />
      <RoadSystem />
      {palms.map((p) => (
        <Palm key={`${p.x}-${p.z}`} x={p.x} z={p.z} scale={p.s} />
      ))}
      <TreeField />
      <CityField />
      <DistantHills />
      <Flagpoles />
    </group>
  );
}
