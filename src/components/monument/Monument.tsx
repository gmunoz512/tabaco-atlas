import { useMemo } from "react";
import { PARTS, PART_BY_ID } from "@/data/parts";
import { useAtlas } from "@/state/atlas-store";
import { createArchGeometry, createHelixGeometry } from "@/components/monument/geometries";
import { PART_POSES, type MeshKind } from "@/components/monument/poses";
import { SelectablePart } from "@/components/monument/SelectablePart";

function Surface({
  id,
  roughness = 0.9,
  metalness = 0.03,
  envMapIntensity = 0.55,
}: {
  id: string;
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
}) {
  const { selectedId } = useAtlas();
  const selected = selectedId === id;
  const base = PART_BY_ID[id].color;
  const color = selected ? "#c4a56a" : base;

  return (
    <meshStandardMaterial
      color={color}
      roughness={selected ? 0.55 : roughness}
      metalness={selected ? 0.12 : metalness}
      envMapIntensity={envMapIntensity}
      emissive={selected ? "#5c4520" : "#000000"}
      emissiveIntensity={selected ? 0.16 : 0}
    />
  );
}

function StairsBody({ id }: { id: string }) {
  return (
    <group>
      {Array.from({ length: 11 }, (_, index) => (
        <mesh
          key={index}
          position={[0, index * 0.055 - 0.28, 0.72 - index * 0.13]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[2.55, 0.055, 0.16]} />
          <Surface id={id} roughness={0.94} />
        </mesh>
      ))}
    </group>
  );
}

function ColumnBody({ id }: { id: string }) {
  return (
    <group>
      <mesh position={[0, -1.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.08, 0.26]} />
        <Surface id={id} roughness={0.86} />
      </mesh>
      <mesh position={[0, -0.94, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.13, 0.08, 16]} />
        <Surface id={id} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.105, 1.88, 20]} />
        <Surface id={id} roughness={0.78} metalness={0.05} envMapIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.98, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.08, 16]} />
        <Surface id={id} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.24, 0.07, 0.24]} />
        <Surface id={id} roughness={0.84} />
      </mesh>
    </group>
  );
}

function GateBody({ id }: { id: string }) {
  const voidGeo = useMemo(() => createArchGeometry(0.95, 1.05, 0.12), []);
  const frameGeo = useMemo(() => createArchGeometry(1.12, 1.18, 0.06), []);
  return (
    <group>
      <mesh geometry={frameGeo} position={[0, -0.52, -0.08]} castShadow>
        <Surface id="podium-plinth" roughness={0.88} />
      </mesh>
      <mesh geometry={voidGeo} position={[0, -0.48, -0.02]}>
        <meshStandardMaterial color="#4a1c18" roughness={0.92} />
      </mesh>
      {[-0.22, 0, 0.22].map((x) => (
        <mesh key={x} position={[x, -0.08, 0.04]} castShadow>
          <boxGeometry args={[0.035, 0.85, 0.03]} />
          <Surface id={id} roughness={0.4} metalness={0.55} envMapIntensity={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.22, 0.05]} castShadow>
        <boxGeometry args={[0.78, 0.035, 0.03]} />
        <Surface id={id} roughness={0.4} metalness={0.55} />
      </mesh>
    </group>
  );
}

function ArchBody({ id }: { id: string }) {
  const voidGeo = useMemo(() => createArchGeometry(0.42, 0.52, 0.1), []);
  const frameGeo = useMemo(() => createArchGeometry(0.52, 0.62, 0.05), []);
  return (
    <group>
      <mesh geometry={frameGeo} position={[0, -0.22, -0.04]} castShadow>
        <meshStandardMaterial color="#e4d4b4" roughness={0.86} />
      </mesh>
      <mesh geometry={voidGeo} position={[0, -0.2, 0]}>
        <Surface id={id} roughness={0.78} metalness={0.08} envMapIntensity={0.35} />
      </mesh>
    </group>
  );
}

function HelixBody({ id }: { id: string }) {
  const geo = useMemo(() => createHelixGeometry(0.49, 5.05, 2.35, 0.03), []);
  return (
    <mesh geometry={geo} castShadow>
      <Surface id={id} roughness={0.8} />
    </mesh>
  );
}

function BalconyBody({ id }: { id: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.66, 0.66, 0.1, 32]} />
        <Surface id={id} roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.64, 0.025, 8, 40]} />
        <Surface id={id} roughness={0.7} metalness={0.08} />
      </mesh>
    </group>
  );
}

function RailBody({ id }: { id: string }) {
  return (
    <group>
      {[-0.28, 0, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.2, 8]} />
          <Surface id={id} roughness={0.55} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.62, 8]} />
        <Surface id={id} roughness={0.55} metalness={0.2} />
      </mesh>
    </group>
  );
}

function PinnacleBody({ id }: { id: string }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.12, 0.22]} />
        <Surface id={id} roughness={0.84} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.22, 8]} />
        <Surface id={id} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <sphereGeometry args={[0.055, 12, 8]} />
        <Surface id={id} roughness={0.76} />
      </mesh>
    </group>
  );
}

function EmblemBody({ id }: { id: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.04, 16]} />
        <Surface id={id} roughness={0.38} metalness={0.55} envMapIntensity={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.07, 16]} />
        <meshStandardMaterial color="#7a341c" roughness={0.45} metalness={0.4} />
      </mesh>
    </group>
  );
}

function AngelBody({ id }: { id: string }) {
  return (
    <group>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.055, 0.16, 10]} />
        <Surface id={id} roughness={0.32} metalness={0.62} envMapIntensity={1} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.05, 0.22, 10]} />
        <Surface id={id} roughness={0.3} metalness={0.65} envMapIntensity={1} />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.055, 12, 10]} />
        <Surface id={id} roughness={0.28} metalness={0.62} />
      </mesh>
      <mesh position={[-0.08, 0.42, 0]} rotation={[0, 0, 0.85]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
        <Surface id={id} roughness={0.32} metalness={0.6} />
      </mesh>
      <mesh position={[0.08, 0.42, 0]} rotation={[0, 0, -0.85]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
        <Surface id={id} roughness={0.32} metalness={0.6} />
      </mesh>
      <mesh position={[-0.16, 0.28, -0.02]} rotation={[0.15, 0.4, 0.7]} scale={[0.35, 1, 0.55]} castShadow>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial
          color={PART_BY_ID[id].color}
          roughness={0.35}
          metalness={0.58}
          envMapIntensity={0.9}
        />
      </mesh>
      <mesh position={[0.16, 0.28, -0.02]} rotation={[0.15, -0.4, -0.7]} scale={[0.35, 1, 0.55]} castShadow>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial
          color={PART_BY_ID[id].color}
          roughness={0.35}
          metalness={0.58}
          envMapIntensity={0.9}
        />
      </mesh>
    </group>
  );
}

function CylinderBody({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[size[0], size[2] ?? size[0], size[1], 48]} />
      <Surface id={id} roughness={0.84} envMapIntensity={0.65} />
    </mesh>
  );
}

function BoxBody({ id, size, kind }: { id: string; size: [number, number, number]; kind: MeshKind }) {
  const radius = kind === "box" ? 0.04 : 0;
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={size} />
      <Surface
        id={id}
        roughness={kind === "arch" ? 0.7 : 0.9}
        metalness={kind === "gate" ? 0.4 : 0.03}
      />
      {radius ? null : null}
    </mesh>
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
    case "cylinder":
      return <CylinderBody id={id} size={size} />;
    default:
      return <BoxBody id={id} size={size} kind={pose.kind} />;
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
