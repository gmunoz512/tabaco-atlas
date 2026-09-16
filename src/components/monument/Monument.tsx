import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { PARTS } from "@/data/parts";
import { useAtlas } from "@/state/atlas-store";
import {
  createAngelBodyGeometry,
  createArchGeometry,
  createHelixGeometry,
  createShieldGeometry,
  createStairGeometry,
  createWingGeometry,
} from "@/components/monument/geometries";
import { ExhibitMaterial, StaticStone } from "@/components/monument/materials";
import { ATTIC_W, COL_HEIGHT, COL_HW, COL_Y, PART_POSES, SHAFT } from "@/components/monument/poses";
import { SelectablePart } from "@/components/monument/SelectablePart";

function StairsBody({ id }: { id: string }) {
  const geo = useMemo(() => createStairGeometry(18, 3.85, 0.042, 0.112), []);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <ExhibitMaterial id={id} roughness={0.55} />
    </mesh>
  );
}

function ColumnBody({ id }: { id: string }) {
  const shaftH = COL_HEIGHT - 0.28;
  const baseY = -COL_HEIGHT / 2;
  return (
    <group>
      <mesh position={[0, baseY + 0.036, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.074, 0.072, 48]} />
        <ExhibitMaterial id={id} roughness={0.5} metalness={0.14} />
      </mesh>
      <mesh position={[0, baseY + 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.062, 0.042, 48]} />
        <ExhibitMaterial id={id} finish="accent" roughness={0.3} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.036, 0.046, shaftH, 64]} />
        <ExhibitMaterial id={id} roughness={0.42} metalness={0.12} envMapIntensity={0.8} />
      </mesh>
      <mesh position={[0, COL_HEIGHT / 2 - 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.056, 0.04, 0.05, 48]} />
        <ExhibitMaterial id={id} roughness={0.46} />
      </mesh>
      <mesh position={[0, COL_HEIGHT / 2 - 0.052, 0]} castShadow>
        <cylinderGeometry args={[0.066, 0.066, 0.046, 32]} />
        <ExhibitMaterial id={id} finish="accent" roughness={0.28} metalness={0.5} />
      </mesh>
    </group>
  );
}

function GateBody({ id }: { id: string }) {
  const voidGeo = useMemo(() => createArchGeometry(0.78, 0.88, 0.16), []);
  const frameGeo = useMemo(() => createArchGeometry(0.92, 0.98, 0.08), []);
  return (
    <group>
      {[-0.7, 0, 0.7].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh geometry={frameGeo} position={[0, -0.08, -0.04]} castShadow>
            <ExhibitMaterial id="podium-plinth" roughness={0.5} />
          </mesh>
          <mesh geometry={voidGeo} position={[0, -0.06, 0.01]}>
            <ExhibitMaterial id={id} finish="void" />
          </mesh>
        </group>
      ))}
      {[-0.22, -0.11, 0, 0.11, 0.22].map((x) => (
        <mesh key={x} position={[x, -0.08, 0.06]} castShadow>
          <boxGeometry args={[0.014, 0.62, 0.014]} />
          <ExhibitMaterial id={id} finish="metal" roughness={0.22} />
        </mesh>
      ))}
      {[-0.14, 0.06].map((y) => (
        <mesh key={y} position={[0, y, 0.065]} castShadow>
          <boxGeometry args={[0.5, 0.012, 0.012]} />
          <ExhibitMaterial id={id} finish="metal" roughness={0.22} />
        </mesh>
      ))}
    </group>
  );
}

function ArchBody({ id }: { id: string }) {
  const voidGeo = useMemo(() => createArchGeometry(0.42, 0.52, 0.14), []);
  const frameGeo = useMemo(() => createArchGeometry(0.52, 0.62, 0.05), []);
  return (
    <group>
      <mesh geometry={frameGeo} position={[0, -0.02, -0.02]} castShadow>
        <ExhibitMaterial id="attic-body" roughness={0.46} />
      </mesh>
      <mesh geometry={voidGeo} position={[0, 0, 0.02]}>
        <ExhibitMaterial id={id} finish="void" />
      </mesh>
    </group>
  );
}

function HelixBody({ id }: { id: string }) {
  const geo = useMemo(() => createHelixGeometry(SHAFT.helixR, SHAFT.helixH, 2.7, 0.018), []);
  return (
    <mesh geometry={geo} castShadow>
      <ExhibitMaterial id={id} roughness={0.4} metalness={0.16} offset />
    </mesh>
  );
}

function BalconyBody({ id }: { id: string }) {
  const posts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return [Math.cos(a) * 0.46, Math.sin(a) * 0.46] as const;
      }),
    [],
  );
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.46, 0.08, 64]} />
        <ExhibitMaterial id={id} roughness={0.46} />
      </mesh>
      <mesh position={[0, 0.055, 0]}>
        <torusGeometry args={[0.47, 0.012, 12, 64]} />
        <ExhibitMaterial id={id} finish="metal" roughness={0.22} />
      </mesh>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.1, 10]} />
          <ExhibitMaterial id={id} finish="metal" />
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
          <cylinderGeometry args={[0.007, 0.007, 0.14, 12]} />
          <ExhibitMaterial id={id} finish="metal" />
        </mesh>
      ))}
      <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.007, 0.007, 0.42, 12]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
    </group>
  );
}

function PinnacleBody({ id }: { id: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.088, 0.11, 0.09, 24]} />
        <ExhibitMaterial id={id} roughness={0.46} />
      </mesh>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.036, 0.068, 0.16, 20]} />
        <ExhibitMaterial id={id} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.26, 0]} castShadow>
        <sphereGeometry args={[0.04, 24, 16]} />
        <ExhibitMaterial id={id} finish="accent" />
      </mesh>
    </group>
  );
}

function EmblemBody({ id }: { id: string }) {
  const geo = useMemo(() => createShieldGeometry(), []);
  return (
    <mesh geometry={geo} castShadow>
      <ExhibitMaterial id={id} finish="metal" envMapIntensity={1.2} />
    </mesh>
  );
}

function AngelBody({ id }: { id: string }) {
  const body = useMemo(() => createAngelBodyGeometry(), []);
  const wing = useMemo(() => createWingGeometry(), []);
  return (
    <group>
      <mesh geometry={body} position={[0, 0.28, 0]} castShadow>
        <ExhibitMaterial id={id} finish="metal" envMapIntensity={1.35} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <sphereGeometry args={[0.042, 24, 18]} />
        <ExhibitMaterial id={id} finish="metal" envMapIntensity={1.25} />
      </mesh>
      <mesh position={[-0.05, 0.72, 0.04]} rotation={[0.18, 0, 0.48]} castShadow>
        <cylinderGeometry args={[0.01, 0.016, 0.42, 12]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
      <mesh position={[0.05, 0.72, 0.04]} rotation={[0.18, 0, -0.48]} castShadow>
        <cylinderGeometry args={[0.01, 0.016, 0.42, 12]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
      <mesh geometry={wing} position={[-0.08, 0.38, -0.04]} rotation={[0.32, -0.58, 0.52]} scale={[1.2, 1.15, 1]} castShadow>
        <ExhibitMaterial id={id} finish="metal" envMapIntensity={1.3} />
      </mesh>
      <mesh
        geometry={wing}
        position={[0.08, 0.38, -0.04]}
        rotation={[0.32, Math.PI + 0.58, -0.52]}
        scale={[1.2, 1.15, 1]}
        castShadow
      >
        <ExhibitMaterial id={id} finish="metal" envMapIntensity={1.3} />
      </mesh>
    </group>
  );
}

function PodiumMass({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <group>
      <RoundedBox args={size} radius={0.06} smoothness={6} castShadow receiveShadow>
        <ExhibitMaterial id={id} roughness={0.52} />
      </RoundedBox>
      <mesh position={[0, size[1] / 2 + 0.012, 0]}>
        <boxGeometry args={[size[0] + 0.08, 0.018, size[2] + 0.08]} />
        <ExhibitMaterial id={id} finish="accent" roughness={0.28} />
      </mesh>
    </group>
  );
}

function AtticMass({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <group>
      <RoundedBox args={size} radius={0.05} smoothness={6} castShadow receiveShadow>
        <ExhibitMaterial id={id} roughness={0.46} />
      </RoundedBox>
      <RoundedBox
        args={[size[0] + 0.1, 0.08, size[2] + 0.1]}
        radius={0.03}
        smoothness={4}
        position={[0, size[1] / 2 + 0.02, 0]}
        castShadow
      >
        <ExhibitMaterial id={id} finish="accent" roughness={0.3} />
      </RoundedBox>
      <RoundedBox
        args={[size[0] * 0.5, 0.38, size[2] * 0.5]}
        radius={0.04}
        smoothness={5}
        position={[0, size[1] / 2 + 0.26, 0]}
        castShadow
      >
        <ExhibitMaterial id={id} roughness={0.46} />
      </RoundedBox>
    </group>
  );
}

function WallBody({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <group>
      <RoundedBox args={size} radius={0.025} smoothness={4} castShadow receiveShadow>
        <ExhibitMaterial id={id} roughness={0.48} />
      </RoundedBox>
      {[-1.15, -0.38, 0.38, 1.15].map((x) => (
        <mesh key={x} position={[x, 0.02, size[2] / 2 + 0.01]}>
          <boxGeometry args={[0.11, size[1] * 0.42, 0.02]} />
          <ExhibitMaterial id={id} finish="void" />
        </mesh>
      ))}
    </group>
  );
}

function CylinderBody({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[size[0], size[2] ?? size[0], size[1], 96]} />
      <ExhibitMaterial id={id} roughness={0.42} envMapIntensity={0.7} />
    </mesh>
  );
}

function BoxBody({ id, size }: { id: string; size: [number, number, number] }) {
  const minDim = Math.min(size[0], size[1], size[2]);
  const radius = Math.min(0.04, minDim * 0.18);
  return (
    <RoundedBox args={size} radius={radius} smoothness={5} castShadow receiveShadow>
      <ExhibitMaterial id={id} roughness={0.5} />
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
  const { explode, layers } = useAtlas();
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
  if (explode > 0.12 || !layers.colonnade) return null;
  return (
    <group>
      {pts.map((p, i) => (
        <group key={i} position={[p.x, COL_Y, p.z]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.046, COL_HEIGHT - 0.28, 48]} />
            <StaticStone />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FillerArches() {
  const { explode, layers } = useAtlas();
  const voidGeo = useMemo(() => createArchGeometry(0.42, 0.52, 0.14), []);
  if (explode > 0.12 || !layers.attic) return null;
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
          <mesh
            key={`${fi}-${ai}`}
            geometry={voidGeo}
            position={f.z !== 0 ? [a, 5.92, f.z * (ATTIC_W / 2 + 0.02)] : [f.x * (ATTIC_W / 2 + 0.02), 5.92, a]}
            rotation={[0, f.rot, 0]}
          >
            <meshPhysicalMaterial color="#151c28" roughness={0.88} metalness={0.08} emissive="#0a1018" emissiveIntensity={0.2} />
          </mesh>
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
