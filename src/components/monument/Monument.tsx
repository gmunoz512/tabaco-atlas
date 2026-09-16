import { PARTS, PART_BY_ID } from "@/data/parts";
import { useAtlas } from "@/state/atlas-store";
import { PART_POSES, type MeshKind } from "@/components/monument/poses";
import { SelectablePart } from "@/components/monument/SelectablePart";

function StoneMaterial({
  id,
  roughness = 0.72,
  metalness = 0.04,
}: {
  id: string;
  roughness?: number;
  metalness?: number;
}) {
  const { selectedId } = useAtlas();
  const selected = selectedId === id;
  const color = PART_BY_ID[id].color;

  return (
    <meshStandardMaterial
      color={selected ? "#d7c07a" : color}
      roughness={roughness}
      metalness={metalness}
      emissive={selected ? "#8a6c32" : "#141414"}
      emissiveIntensity={selected ? 0.38 : 0.03}
    />
  );
}

function StairsBody({ id }: { id: string }) {
  return (
    <group>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh
          key={index}
          position={[0, index * 0.075 - 0.22, 0.55 - index * 0.175]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[2.15, 0.075, 0.22]} />
          <StoneMaterial id={id} roughness={0.86} />
        </mesh>
      ))}
    </group>
  );
}

function ColumnBody({ id }: { id: string }) {
  return (
    <group>
      <mesh position={[0, -0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.12, 0.3]} />
        <StoneMaterial id={id} roughness={0.7} />
      </mesh>
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.11, 1.32, 12]} />
        <StoneMaterial id={id} roughness={0.58} metalness={0.06} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.26, 0.1, 0.26]} />
        <StoneMaterial id={id} roughness={0.62} />
      </mesh>
    </group>
  );
}

function FigureBody({ id }: { id: string }) {
  return (
    <group>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.18, 8]} />
        <StoneMaterial id={id} roughness={0.45} metalness={0.28} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.09, 0.34, 8]} />
        <StoneMaterial id={id} roughness={0.42} metalness={0.3} />
      </mesh>
      <mesh position={[-0.16, 0.34, 0]} rotation={[0, 0, 0.45]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.3, 6]} />
        <StoneMaterial id={id} roughness={0.45} metalness={0.28} />
      </mesh>
      <mesh position={[0.16, 0.34, 0]} rotation={[0, 0, -0.45]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.3, 6]} />
        <StoneMaterial id={id} roughness={0.45} metalness={0.28} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <sphereGeometry args={[0.09, 12, 10]} />
        <StoneMaterial id={id} roughness={0.4} metalness={0.32} />
      </mesh>
    </group>
  );
}

function LanternBody({ id }: { id: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.18, 8]} />
        <StoneMaterial id={id} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.28, 8]} />
        <StoneMaterial id={id} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <coneGeometry args={[0.18, 0.16, 8]} />
        <StoneMaterial id={id} roughness={0.52} />
      </mesh>
    </group>
  );
}

function FlagpoleBody({ id }: { id: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.028, 0.034, 1.55, 8]} />
        <StoneMaterial id={id} metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0.22, 0.42, 0]} castShadow>
        <boxGeometry args={[0.42, 0.26, 0.02]} />
        <meshStandardMaterial color="#002d62" roughness={0.55} />
      </mesh>
      <mesh position={[0.22, 0.42, 0.006]}>
        <boxGeometry args={[0.08, 0.26, 0.01]} />
        <meshStandardMaterial color="#fafafa" roughness={0.6} />
      </mesh>
      <mesh position={[0.34, 0.48, 0.006]}>
        <boxGeometry args={[0.16, 0.12, 0.01]} />
        <meshStandardMaterial color="#ce1126" roughness={0.55} />
      </mesh>
    </group>
  );
}

function BoxBody({
  id,
  size,
  kind,
}: {
  id: string;
  size: [number, number, number];
  kind: MeshKind;
}) {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={size} />
      <StoneMaterial
        id={id}
        roughness={kind === "window" ? 0.4 : 0.74}
        metalness={kind === "window" ? 0.12 : 0.04}
      />
    </mesh>
  );
}

function PartBody({ id }: { id: string }) {
  const pose = PART_POSES[id];
  switch (pose.kind) {
    case "stairs":
      return <StairsBody id={id} />;
    case "column":
      return <ColumnBody id={id} />;
    case "figure":
      return <FigureBody id={id} />;
    case "lantern":
      return <LanternBody id={id} />;
    case "flagpole":
      return <FlagpoleBody id={id} />;
    case "window":
      return <BoxBody id={id} size={pose.size ?? [0.3, 0.4, 0.1]} kind="window" />;
    default:
      return <BoxBody id={id} size={pose.size ?? [1, 1, 1]} kind="box" />;
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
