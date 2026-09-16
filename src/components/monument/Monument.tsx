import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { PARTS, PART_BY_ID } from "@/data/parts";
import { useAtlas } from "@/state/atlas-store";
import {
  createArchGeometry,
  createHelixGeometry,
  createShieldGeometry,
  createWingGeometry,
  getStoneMaps,
} from "@/components/monument/geometries";
import { COL_HEIGHT, PART_POSES } from "@/components/monument/poses";
import { SelectablePart } from "@/components/monument/SelectablePart";

function Surface({
  id,
  roughness = 0.88,
  metalness = 0.04,
  envMapIntensity = 0.48,
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
  const maps = useMemo(() => (stone ? getStoneMaps() : null), [stone]);
  const base = PART_BY_ID[id].color;
  const color = selected ? "#c4a56a" : base;

  return (
    <meshStandardMaterial
      color={color}
      map={maps?.albedo}
      bumpMap={maps?.bump}
      bumpScale={stone && !selected ? 0.038 : 0.012}
      roughness={selected ? 0.52 : roughness}
      metalness={selected ? 0.14 : metalness}
      envMapIntensity={envMapIntensity}
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
      {Array.from({ length: 18 }, (_, index) => (
        <mesh
          key={index}
          position={[0, index * 0.034 - 0.28, 0.95 - index * 0.1]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[3.15, 0.034, 0.12]} />
          <Surface id={id} roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}

function ColumnBody({ id }: { id: string }) {
  const shaftH = COL_HEIGHT - 0.26;
  const baseY = -COL_HEIGHT / 2;
  return (
    <group>
      <mesh position={[0, baseY + 0.035, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.074, 0.07, 22]} />
        <Surface id={id} roughness={0.84} />
      </mesh>
      <mesh position={[0, baseY + 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.052, 0.062, 0.05, 22]} />
        <Surface id={id} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.044, 0.054, shaftH, 28]} />
        <Surface id={id} roughness={0.72} metalness={0.05} envMapIntensity={0.7} />
      </mesh>
      <mesh position={[0, COL_HEIGHT / 2 - 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.062, 0.046, 0.055, 22]} />
        <Surface id={id} roughness={0.78} />
      </mesh>
      <mesh position={[0, COL_HEIGHT / 2 - 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.045, 16]} />
        <Surface id={id} roughness={0.82} />
      </mesh>
    </group>
  );
}

function GateBody({ id }: { id: string }) {
  const voidGeo = useMemo(() => createArchGeometry(0.92, 0.92, 0.14), []);
  const frameGeo = useMemo(() => createArchGeometry(1.08, 1.04, 0.07), []);
  return (
    <group>
      <mesh geometry={frameGeo} position={[0, -0.48, -0.1]} castShadow>
        <Surface id="podium-plinth" roughness={0.9} />
      </mesh>
      <mesh geometry={voidGeo} position={[0, -0.46, -0.04]}>
        <meshStandardMaterial color="#3d1614" roughness={0.94} />
      </mesh>
      {[-0.28, -0.14, 0, 0.14, 0.28].map((x) => (
        <mesh key={x} position={[x, -0.12, 0.05]} castShadow>
          <boxGeometry args={[0.022, 0.72, 0.022]} />
          <Surface id={id} roughness={0.38} metalness={0.62} envMapIntensity={0.85} stone={false} />
        </mesh>
      ))}
      {[-0.18, 0.08].map((y) => (
        <mesh key={y} position={[0, y, 0.055]} castShadow>
          <boxGeometry args={[0.62, 0.018, 0.018]} />
          <Surface id={id} roughness={0.38} metalness={0.62} stone={false} />
        </mesh>
      ))}
    </group>
  );
}

function ArchBody({ id }: { id: string }) {
  const voidGeo = useMemo(() => createArchGeometry(0.4, 0.5, 0.12), []);
  const frameGeo = useMemo(() => createArchGeometry(0.5, 0.6, 0.05), []);
  return (
    <group>
      <mesh geometry={frameGeo} position={[0, -0.22, -0.05]} castShadow>
        <meshStandardMaterial color="#e8d9bc" roughness={0.84} />
      </mesh>
      <mesh geometry={voidGeo} position={[0, -0.2, 0]}>
        <Surface id={id} roughness={0.72} metalness={0.06} envMapIntensity={0.28} stone={false} />
      </mesh>
    </group>
  );
}

function HelixBody({ id }: { id: string }) {
  const geo = useMemo(() => createHelixGeometry(0.21, 7.2, 2.85, 0.013), []);
  return (
    <mesh geometry={geo} castShadow>
      <Surface id={id} roughness={0.78} offset />
    </mesh>
  );
}

function BalconyBody({ id }: { id: string }) {
  const posts = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return [Math.cos(a) * 0.29, Math.sin(a) * 0.29] as const;
      }),
    [],
  );
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.28, 0.07, 40]} />
        <Surface id={id} roughness={0.84} />
      </mesh>
      <mesh position={[0, 0.055, 0]}>
        <torusGeometry args={[0.29, 0.012, 8, 48]} />
        <Surface id={id} roughness={0.62} metalness={0.12} />
      </mesh>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.045, z]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.09, 6]} />
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
    <group rotation={[0, 0, 0]}>
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
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.09, 0.32, 16]} />
        <Surface id={id} roughness={0.28} metalness={0.72} envMapIntensity={1} stone={false} />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <sphereGeometry args={[0.055, 14, 12]} />
        <Surface id={id} roughness={0.26} metalness={0.74} envMapIntensity={1} stone={false} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.034, 12, 10]} />
        <Surface id={id} roughness={0.3} metalness={0.65} stone={false} />
      </mesh>
      <mesh position={[-0.05, 0.52, 0.02]} rotation={[0.08, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.014, 0.34, 8]} />
        <Surface id={id} roughness={0.3} metalness={0.7} stone={false} />
      </mesh>
      <mesh position={[0.05, 0.52, 0.02]} rotation={[0.08, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.014, 0.34, 8]} />
        <Surface id={id} roughness={0.3} metalness={0.7} stone={false} />
      </mesh>
      <mesh position={[-0.07, 0.68, 0.05]} castShadow>
        <sphereGeometry args={[0.016, 8, 8]} />
        <Surface id={id} roughness={0.3} metalness={0.7} stone={false} />
      </mesh>
      <mesh position={[0.07, 0.68, 0.05]} castShadow>
        <sphereGeometry args={[0.016, 8, 8]} />
        <Surface id={id} roughness={0.3} metalness={0.7} stone={false} />
      </mesh>
      <mesh geometry={wing} position={[-0.03, 0.22, -0.04]} rotation={[0.2, -0.4, 0.4]} castShadow>
        <Surface id={id} roughness={0.32} metalness={0.66} envMapIntensity={0.95} stone={false} />
      </mesh>
      <mesh
        geometry={wing}
        position={[0.03, 0.22, -0.04]}
        rotation={[0.2, Math.PI + 0.4, -0.4]}
        castShadow
      >
        <Surface id={id} roughness={0.32} metalness={0.66} envMapIntensity={0.95} stone={false} />
      </mesh>
    </group>
  );
}

function PodiumMass({ id, size }: { id: string; size: [number, number, number] }) {
  const courses = [0.24, 0.26, 0.28, 0.34];
  let y = -size[1] / 2;
  return (
    <group>
      {courses.map((h, index) => {
        const inset = index * 0.028;
        const mid = y + h / 2;
        y += h;
        return (
          <RoundedBox
            key={index}
            args={[size[0] - inset, h - 0.012, size[2] - inset]}
            radius={0.035}
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
      <RoundedBox args={size} radius={0.045} smoothness={3} castShadow receiveShadow>
        <Surface id={id} roughness={0.86} />
      </RoundedBox>
      <RoundedBox
        args={[size[0] + 0.1, 0.09, size[2] + 0.1]}
        radius={0.03}
        smoothness={3}
        position={[0, size[1] / 2 + 0.02, 0]}
        castShadow
      >
        <Surface id={id} roughness={0.84} />
      </RoundedBox>
      <mesh position={[0, size[1] / 2 + 0.1, 0]} castShadow>
        <boxGeometry args={[size[0] * 0.48, 0.08, size[2] * 0.48]} />
        <Surface id={id} roughness={0.84} />
      </mesh>
    </group>
  );
}

function CylinderBody({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[size[0], size[2] ?? size[0], size[1], 64]} />
      <Surface id={id} roughness={0.8} envMapIntensity={0.58} />
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
    case "cylinder":
      return <CylinderBody id={id} size={size} />;
    default:
      return <BoxBody id={id} size={size} />;
  }
}

export function Monument() {
  return (
    <group>
      {PARTS.map((part) => (
        <SelectablePart key={part.id} id={part.id}>
          <PartBody id={part.id} />
        </SelectablePart>
      ))}
    </group>
  );
}
