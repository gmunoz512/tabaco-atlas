import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { PARTS, PART_BY_ID } from "@/data/parts";
import { useAtlas } from "@/state/atlas-store";
import {
  createArchGeometry,
  createHelixGeometry,
  createShieldGeometry,
  createWingGeometry,
} from "@/components/monument/geometries";
import { ATTIC_W, COL_HEIGHT, COL_HW, COL_Y, PART_POSES, SHAFT } from "@/components/monument/poses";
import { useSceneTextures } from "@/components/monument/pbr";
import { SelectablePart } from "@/components/monument/SelectablePart";

function Surface({
  id,
  roughness = 0.62,
  metalness = 0.04,
  envMapIntensity = 0.95,
  stone = true,
  offset = false,
}: {
  id: string;
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  stone?: boolean;
  offset?: boolean;
}) {
  const { selectedId } = useAtlas();
  const selected = selectedId === id;
  const maps = useSceneTextures();
  const base = PART_BY_ID[id].color;
  const color = selected ? "#c4a56a" : base;

  if (!stone) {
    return (
      <meshPhysicalMaterial
        color={color}
        roughness={selected ? 0.28 : roughness}
        metalness={selected ? 0.45 : metalness}
        envMapIntensity={envMapIntensity}
        emissive={selected ? "#5c4520" : "#000000"}
        emissiveIntensity={selected ? 0.14 : 0}
        polygonOffset={offset}
        polygonOffsetFactor={offset ? -1 : 0}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      color={color}
      map={maps.stoneMap}
      normalMap={maps.stoneNor}
      normalScale={new THREE.Vector2(0.42, 0.42)}
      roughnessMap={maps.stoneRough}
      roughness={selected ? 0.42 : roughness}
      metalness={selected ? 0.12 : metalness}
      envMapIntensity={envMapIntensity}
      clearcoat={0.1}
      clearcoatRoughness={0.48}
      emissive={selected ? "#5c4520" : "#000000"}
      emissiveIntensity={selected ? 0.14 : 0}
      polygonOffset={offset}
      polygonOffsetFactor={offset ? -1 : 0}
    />
  );
}

function StairsBody({ id }: { id: string }) {
  return (
    <group>
      {Array.from({ length: 22 }, (_, index) => (
        <mesh
          key={index}
          position={[0, index * 0.032 - 0.3, 1.05 - index * 0.092]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[3.85, 0.032, 0.12]} />
          <Surface id={id} roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}

function ColumnBody({ id }: { id: string }) {
  const shaftH = COL_HEIGHT - 0.28;
  const baseY = -COL_HEIGHT / 2;
  return (
    <group>
      <mesh position={[0, baseY + 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.068, 0.072, 0.08, 24]} />
        <Surface id={id} roughness={0.84} />
      </mesh>
      <mesh position={[0, baseY + 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.048, 0.06, 0.05, 24]} />
        <Surface id={id} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.048, shaftH, 48]} />
        <Surface id={id} roughness={0.7} metalness={0.05} envMapIntensity={0.7} />
      </mesh>
      <mesh position={[0, COL_HEIGHT / 2 - 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.042, 0.055, 24]} />
        <Surface id={id} roughness={0.78} />
      </mesh>
      <mesh position={[0, COL_HEIGHT / 2 - 0.055, 0]} castShadow>
        <cylinderGeometry args={[0.068, 0.068, 0.05, 16]} />
        <Surface id={id} roughness={0.82} />
      </mesh>
    </group>
  );
}

function GateBody({ id }: { id: string }) {
  const voidGeo = useMemo(() => createArchGeometry(0.78, 0.88, 0.16), []);
  const frameGeo = useMemo(() => createArchGeometry(0.92, 0.98, 0.08), []);
  return (
    <group>
      <mesh geometry={frameGeo} position={[0, -0.46, -0.1]} castShadow>
        <Surface id="podium-plinth" roughness={0.9} />
      </mesh>
      <mesh geometry={voidGeo} position={[0, -0.44, -0.04]}>
        <meshStandardMaterial color="#3a1514" roughness={0.94} />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh geometry={frameGeo} position={[0, -0.46, -0.1]} castShadow>
            <Surface id="podium-plinth" roughness={0.9} />
          </mesh>
          <mesh geometry={voidGeo} position={[0, -0.44, -0.04]}>
            <meshStandardMaterial color="#321210" roughness={0.94} />
          </mesh>
        </group>
      ))}
      {[-0.24, -0.12, 0, 0.12, 0.24].map((x) => (
        <mesh key={x} position={[x, -0.1, 0.05]} castShadow>
          <boxGeometry args={[0.02, 0.68, 0.02]} />
          <Surface id={id} roughness={0.38} metalness={0.62} envMapIntensity={0.85} stone={false} />
        </mesh>
      ))}
      {[-0.16, 0.08].map((y) => (
        <mesh key={y} position={[0, y, 0.055]} castShadow>
          <boxGeometry args={[0.54, 0.016, 0.016]} />
          <Surface id={id} roughness={0.38} metalness={0.62} stone={false} />
        </mesh>
      ))}
    </group>
  );
}

function ArchBody({ id }: { id: string }) {
  const voidGeo = useMemo(() => createArchGeometry(0.42, 0.52, 0.14), []);
  const frameGeo = useMemo(() => createArchGeometry(0.52, 0.62, 0.06), []);
  return (
    <group>
      <mesh geometry={frameGeo} position={[0, -0.24, -0.05]} castShadow>
        <meshStandardMaterial color="#f0e6d4" roughness={0.84} />
      </mesh>
      <mesh geometry={voidGeo} position={[0, -0.22, 0]}>
        <Surface id={id} roughness={0.72} metalness={0.06} envMapIntensity={0.28} stone={false} />
      </mesh>
    </group>
  );
}

function HelixBody({ id }: { id: string }) {
  const geo = useMemo(() => createHelixGeometry(SHAFT.helixR, SHAFT.helixH, 2.7, 0.016), []);
  return (
    <mesh geometry={geo} castShadow>
      <Surface id={id} roughness={0.78} offset />
    </mesh>
  );
}

function BalconyBody({ id }: { id: string }) {
  const posts = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return [Math.cos(a) * 0.46, Math.sin(a) * 0.46] as const;
      }),
    [],
  );
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.44, 0.09, 40]} />
        <Surface id={id} roughness={0.84} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.46, 0.014, 8, 48]} />
        <Surface id={id} roughness={0.62} metalness={0.12} />
      </mesh>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.055, z]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.11, 6]} />
          <Surface id={id} roughness={0.6} metalness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function RailBody({ id }: { id: string }) {
  return (
    <group>
      {[-0.18, 0, 0.18].map((x) => (
        <mesh key={x} position={[x, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          <Surface id={id} roughness={0.52} metalness={0.22} stone={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.42, 8]} />
        <Surface id={id} roughness={0.52} metalness={0.22} stone={false} />
      </mesh>
    </group>
  );
}

function PinnacleBody({ id }: { id: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.1, 12]} />
        <Surface id={id} roughness={0.84} />
      </mesh>
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.07, 0.18, 10]} />
        <Surface id={id} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.045, 14, 10]} />
        <Surface id={id} roughness={0.74} />
      </mesh>
    </group>
  );
}

function EmblemBody({ id }: { id: string }) {
  const geo = useMemo(() => createShieldGeometry(), []);
  return (
    <group>
      <mesh geometry={geo} position={[0, 0, -0.02]} castShadow>
        <Surface id={id} roughness={0.32} metalness={0.62} envMapIntensity={0.9} stone={false} />
      </mesh>
    </group>
  );
}

function AngelBody({ id }: { id: string }) {
  const wing = useMemo(() => createWingGeometry(), []);
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.11, 0.28, 16]} />
        <Surface id={id} roughness={0.22} metalness={1} envMapIntensity={1.45} stone={false} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.07, 0.22, 16]} />
        <Surface id={id} roughness={0.22} metalness={1} envMapIntensity={1.45} stone={false} />
      </mesh>
      <mesh position={[0, 0.44, 0]} castShadow>
        <sphereGeometry args={[0.048, 14, 12]} />
        <Surface id={id} roughness={0.26} metalness={0.74} envMapIntensity={1} stone={false} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.02, 0.05, 10]} />
        <Surface id={id} roughness={0.24} metalness={0.95} envMapIntensity={1.35} stone={false} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <sphereGeometry args={[0.038, 12, 10]} />
        <Surface id={id} roughness={0.24} metalness={0.95} envMapIntensity={1.35} stone={false} />
      </mesh>
      <mesh position={[-0.055, 0.62, 0.04]} rotation={[0.12, 0, 0.42]} castShadow>
        <cylinderGeometry args={[0.012, 0.018, 0.46, 8]} />
        <Surface id={id} roughness={0.24} metalness={0.96} envMapIntensity={1.4} stone={false} />
      </mesh>
      <mesh position={[0.055, 0.62, 0.04]} rotation={[0.12, 0, -0.42]} castShadow>
        <cylinderGeometry args={[0.012, 0.018, 0.46, 8]} />
        <Surface id={id} roughness={0.24} metalness={0.96} envMapIntensity={1.4} stone={false} />
      </mesh>
      <mesh position={[-0.14, 0.82, 0.12]} castShadow>
        <sphereGeometry args={[0.02, 8, 8]} />
        <Surface id={id} roughness={0.24} metalness={0.96} envMapIntensity={1.4} stone={false} />
      </mesh>
      <mesh position={[0.14, 0.82, 0.12]} castShadow>
        <sphereGeometry args={[0.02, 8, 8]} />
        <Surface id={id} roughness={0.24} metalness={0.96} envMapIntensity={1.4} stone={false} />
      </mesh>
      <mesh geometry={wing} position={[-0.04, 0.28, -0.05]} rotation={[0.35, -0.55, 0.55]} scale={[1.15, 1.2, 1]} castShadow>
        <Surface id={id} roughness={0.26} metalness={0.92} envMapIntensity={1.35} stone={false} />
      </mesh>
      <mesh
        geometry={wing}
        position={[0.04, 0.28, -0.05]}
        rotation={[0.35, Math.PI + 0.55, -0.55]}
        scale={[1.15, 1.2, 1]}
        castShadow
      >
        <Surface id={id} roughness={0.26} metalness={0.92} envMapIntensity={1.35} stone={false} />
      </mesh>
    </group>
  );
}

function PodiumMass({ id, size }: { id: string; size: [number, number, number] }) {
  const courses = [0.28, 0.3, 0.32, 0.42];
  let y = -size[1] / 2;
  return (
    <group>
      {courses.map((h, index) => {
        const inset = index * 0.022;
        const mid = y + h / 2;
        y += h;
        return (
          <RoundedBox
            key={index}
            args={[size[0] - inset, h - 0.01, size[2] - inset]}
            radius={0.028}
            smoothness={3}
            position={[0, mid, 0]}
            castShadow
            receiveShadow
          >
            <Surface id={id} roughness={0.92} />
          </RoundedBox>
        );
      })}
    </group>
  );
}

function AtticMass({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <group>
      <RoundedBox args={size} radius={0.04} smoothness={3} castShadow receiveShadow>
        <Surface id={id} roughness={0.84} />
      </RoundedBox>
      <RoundedBox
        args={[size[0] + 0.12, 0.1, size[2] + 0.12]}
        radius={0.03}
        smoothness={3}
        position={[0, size[1] / 2 + 0.02, 0]}
        castShadow
      >
        <Surface id={id} roughness={0.82} />
      </RoundedBox>
      <RoundedBox
        args={[size[0] * 0.52, 0.42, size[2] * 0.52]}
        radius={0.04}
        smoothness={3}
        position={[0, size[1] / 2 + 0.28, 0]}
        castShadow
      >
        <Surface id={id} roughness={0.84} />
      </RoundedBox>
    </group>
  );
}

function WallBody({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <group>
      <RoundedBox args={size} radius={0.02} smoothness={2} castShadow receiveShadow>
        <Surface id={id} roughness={0.86} />
      </RoundedBox>
      {[-1.15, -0.38, 0.38, 1.15].map((x) => (
        <mesh key={x} position={[x, 0.02, size[2] / 2 + 0.012]}>
          <boxGeometry args={[0.13, size[1] * 0.46, 0.03]} />
          <meshStandardMaterial color="#5c241c" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function CylinderBody({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[size[0], size[2] ?? size[0], size[1], 96]} />
      <Surface id={id} roughness={0.78} envMapIntensity={0.58} />
    </mesh>
  );
}

function BoxBody({ id, size }: { id: string; size: [number, number, number] }) {
  const minDim = Math.min(size[0], size[1], size[2]);
  const radius = Math.min(0.028, minDim * 0.22);
  return (
    <RoundedBox args={size} radius={radius} smoothness={3} castShadow receiveShadow>
      <Surface id={id} roughness={0.88} />
    </RoundedBox>
  );
}

function PartBody({ id }: { id: string }) {
  const pose = PART_POSES[id];
  const size = pose.size ?? [1, 1, 1];
  switch (pose.kind) {
    case "stairs":
      return <StairsBody id={id} />;
    case "column":
      return <ColumnBody id={id} />;
    case "gate":
      return <GateBody id={id} />;
    case "arch":
      return <ArchBody id={id} />;
    case "helix":
      return <HelixBody id={id} />;
    case "balcony":
      return <BalconyBody id={id} />;
    case "rail":
      return <RailBody id={id} />;
    case "pinnacle":
      return <PinnacleBody id={id} />;
    case "emblem":
      return <EmblemBody id={id} />;
    case "angel":
      return <AngelBody id={id} />;
    case "podium":
      return <PodiumMass id={id} size={size} />;
    case "attic":
      return <AtticMass id={id} size={size} />;
    case "wall":
      return <WallBody id={id} size={size} />;
    case "cylinder":
      return <CylinderBody id={id} size={size} />;
    default:
      return <BoxBody id={id} size={size} />;
  }
}

function FillerColumns() {
  const { exploded, layers } = useAtlas();
  const pts = useMemo(() => {
    const extraT = [0.1, 0.3, 0.5, 0.7, 0.9];
    const out: { x: number; z: number }[] = [];
    for (const t of extraT) {
      out.push({ x: -COL_HW + 2 * COL_HW * t, z: COL_HW });
      out.push({ x: COL_HW - 2 * COL_HW * t, z: -COL_HW });
      out.push({ x: COL_HW, z: COL_HW - 2 * COL_HW * t });
      out.push({ x: -COL_HW, z: -COL_HW + 2 * COL_HW * t });
    }
    return out;
  }, []);
  if (exploded || !layers.colonnade) return null;
  return (
    <group>
      {pts.map((p, i) => (
        <group key={i} position={[p.x, COL_Y, p.z]}>
          <ColumnBody id="column-south-1" />
        </group>
      ))}
    </group>
  );
}

function FillerArches() {
  const { exploded, layers } = useAtlas();
  if (exploded || !layers.attic) return null;
  const along = [-0.54, 0.54];
  const faces = [
    { x: 0, z: 1, rot: 0 },
    { x: 0, z: -1, rot: Math.PI },
    { x: 1, z: 0, rot: Math.PI / 2 },
    { x: -1, z: 0, rot: -Math.PI / 2 },
  ];
  return (
    <group>
      {faces.flatMap((f, fi) =>
        along.map((a, ai) => (
          <group
            key={`${fi}-${ai}`}
            position={f.z !== 0 ? [a, 5.92, f.z * (ATTIC_W / 2 + 0.02)] : [f.x * (ATTIC_W / 2 + 0.02), 5.92, a]}
            rotation={[0, f.rot, 0]}
          >
            <ArchBody id="arch-south-1" />
          </group>
        )),
      )}
    </group>
  );
}

export function Monument() {
  return (
    <group>
      {PARTS.map((part) => (
        <SelectablePart key={part.id} id={part.id}>
          <PartBody id={part.id} />
        </SelectablePart>
      ))}
      <FillerColumns />
      <FillerArches />
    </group>
  );
}
