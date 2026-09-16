import { Html, RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { LAYERS, LAYER_IDS, PARTS } from "@/data/parts";
import { t } from "@/data/i18n";
import { useAtlas } from "@/state/atlas-store";
import {
  createAngelBodyGeometry,
  createArchGeometry,
  createHelixGeometry,
  createMarbleTexture,
  createShieldGeometry,
  createStairGeometry,
  createWingGeometry,
  helixVentPositions,
} from "@/components/monument/geometries";
import { ExhibitMaterial } from "@/components/monument/materials";
import { CLUSTER, COL_HEIGHT, PART_POSES, SHAFT } from "@/components/monument/poses";
import { SelectablePart } from "@/components/monument/SelectablePart";

function useMarble() {
  return useMemo(() => (typeof document === "undefined" ? null : createMarbleTexture()), []);
}

function StairsBody({ id }: { id: string }) {
  const geo = useMemo(() => createStairGeometry(20, 5.05, 0.038, 0.118), []);
  const marble = useMarble();
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <ExhibitMaterial id={id} finish="marble" map={marble} roughness={0.42} />
    </mesh>
  );
}

function ColumnBody({ id }: { id: string }) {
  const shaftH = COL_HEIGHT - 0.32;
  const baseY = -COL_HEIGHT / 2;
  return (
    <group>
      <mesh position={[0, baseY + 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.078, 0.082, 0.08, 48]} />
        <ExhibitMaterial id={id} roughness={0.46} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.05, shaftH, 64]} />
        <ExhibitMaterial id={id} roughness={0.4} metalness={0.1} envMapIntensity={0.85} />
      </mesh>
      <mesh position={[0, COL_HEIGHT / 2 - 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.042, 0.055, 48]} />
        <ExhibitMaterial id={id} roughness={0.42} />
      </mesh>
      <mesh position={[0, COL_HEIGHT / 2 - 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.05, 0.016, 10, 28]} />
        <ExhibitMaterial id={id} roughness={0.38} />
      </mesh>
      <mesh position={[0, COL_HEIGHT / 2 - 0.04, 0]} castShadow>
        <boxGeometry args={[0.14, 0.036, 0.14]} />
        <ExhibitMaterial id={id} finish="accent" roughness={0.32} />
      </mesh>
    </group>
  );
}

function GateBody({ id }: { id: string }) {
  const voidGeo = useMemo(() => createArchGeometry(0.82, 1.12, 0.18), []);
  const frameGeo = useMemo(() => createArchGeometry(0.98, 1.24, 0.1), []);
  const marble = useMarble();
  return (
    <group>
      {[-0.62, 0.62].map((x) => (
        <group key={x} position={[x, 0.02, 0]}>
          <mesh geometry={frameGeo} position={[0, -0.12, -0.04]} castShadow>
            <ExhibitMaterial id={id} finish="marble" map={marble} />
          </mesh>
          <mesh geometry={voidGeo} position={[0, -0.1, 0.02]}>
            <meshPhysicalMaterial color="#9eb4c6" roughness={0.12} metalness={0.35} transparent opacity={0.55} envMapIntensity={1.1} />
          </mesh>
        </group>
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
        <ExhibitMaterial id="attic-body" roughness={0.44} />
      </mesh>
      <mesh geometry={voidGeo} position={[0, 0, 0.02]}>
        <ExhibitMaterial id={id} finish="void" />
      </mesh>
    </group>
  );
}

function HelixBody({ id }: { id: string }) {
  const geo = useMemo(() => createHelixGeometry(SHAFT.helixR, SHAFT.helixH, SHAFT.turns, 0.078), []);
  const vents = useMemo(() => helixVentPositions(SHAFT.helixR, SHAFT.helixH, SHAFT.turns, 18), []);
  return (
    <group>
      <mesh geometry={geo} castShadow>
        <ExhibitMaterial id={id} roughness={0.4} metalness={0.14} offset />
      </mesh>
      {vents.map((pt, i) => (
        <mesh key={i} position={[pt.x, pt.y, pt.z]} castShadow>
          <cylinderGeometry args={[0.034, 0.034, 0.04, 16]} />
          <ExhibitMaterial id={id} finish="void" />
        </mesh>
      ))}
    </group>
  );
}

function BalconyBody({ id }: { id: string }) {
  const posts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return [Math.cos(a) * 0.5, Math.sin(a) * 0.5] as const;
      }),
    [],
  );
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.54, 0.48, 0.09, 64]} />
        <ExhibitMaterial id={id} roughness={0.44} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.5, 0.014, 12, 64]} />
        <ExhibitMaterial id={id} roughness={0.4} />
      </mesh>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.055, z]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.11, 10]} />
          <ExhibitMaterial id={id} roughness={0.4} />
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
          <ExhibitMaterial id={id} roughness={0.38} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.007, 0.007, 0.42, 12]} />
        <ExhibitMaterial id={id} roughness={0.38} />
      </mesh>
    </group>
  );
}

function PinnacleBody({ id }: { id: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.09, 24]} />
        <ExhibitMaterial id={id} roughness={0.44} />
      </mesh>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.036, 0.068, 0.16, 20]} />
        <ExhibitMaterial id={id} roughness={0.4} />
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
      <mesh geometry={body} position={[0, 0.18, 0]} castShadow>
        <ExhibitMaterial id={id} finish="metal" envMapIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <coneGeometry args={[0.11, 0.22, 16]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <sphereGeometry args={[0.038, 24, 18]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
      <group position={[-0.055, 0.42, 0.02]} rotation={[0.08, 0.04, 0.48]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.018, 0.8, 12]} />
          <ExhibitMaterial id={id} finish="metal" />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow>
          <sphereGeometry args={[0.024, 12, 10]} />
          <ExhibitMaterial id={id} finish="metal" />
        </mesh>
      </group>
      <group position={[0.055, 0.42, 0.02]} rotation={[0.08, -0.04, -0.48]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.018, 0.8, 12]} />
          <ExhibitMaterial id={id} finish="metal" />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow>
          <sphereGeometry args={[0.024, 12, 10]} />
          <ExhibitMaterial id={id} finish="metal" />
        </mesh>
      </group>
      <mesh geometry={wing} position={[-0.1, 0.26, -0.08]} rotation={[0.62, -1.12, 0.12]} scale={[0.72, 0.7, 1]} castShadow>
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
      <mesh
        geometry={wing}
        position={[0.1, 0.26, -0.08]}
        rotation={[0.62, Math.PI + 1.12, -0.12]}
        scale={[0.72, 0.7, 1]}
        castShadow
      >
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
    </group>
  );
}

function PodiumMass({ id, size }: { id: string; size: [number, number, number] }) {
  const marble = useMarble();
  return (
    <group>
      <RoundedBox args={size} radius={0.05} smoothness={6} castShadow receiveShadow>
        <ExhibitMaterial id={id} finish="marble" map={marble} />
      </RoundedBox>
      <mesh position={[0, size[1] / 2 + 0.012, 0]}>
        <boxGeometry args={[size[0] + 0.08, 0.02, size[2] + 0.08]} />
        <ExhibitMaterial id={id} finish="accent" roughness={0.3} />
      </mesh>
    </group>
  );
}

function AtticMass({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <group>
      <RoundedBox args={size} radius={0.05} smoothness={6} castShadow receiveShadow>
        <ExhibitMaterial id={id} roughness={0.44} />
      </RoundedBox>
      <RoundedBox
        args={[size[0] + 0.12, 0.09, size[2] + 0.12]}
        radius={0.03}
        smoothness={4}
        position={[0, size[1] / 2 + 0.02, 0]}
        castShadow
      >
        <ExhibitMaterial id={id} finish="accent" roughness={0.3} />
      </RoundedBox>
      <RoundedBox
        args={[size[0] * 0.48, 0.36, size[2] * 0.48]}
        radius={0.04}
        smoothness={5}
        position={[0, size[1] / 2 + 0.24, 0]}
        castShadow
      >
        <ExhibitMaterial id={id} roughness={0.44} />
      </RoundedBox>
    </group>
  );
}

function WallBody({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <group>
      <RoundedBox args={size} radius={0.025} smoothness={4} castShadow receiveShadow>
        <ExhibitMaterial id={id} roughness={0.46} />
      </RoundedBox>
      {[-1.2, -0.4, 0.4, 1.2].flatMap((x) =>
        [0.55, -0.55].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, size[2] / 2 + 0.01]}>
            <boxGeometry args={[0.42, 0.55, 0.03]} />
            <ExhibitMaterial id={id} finish="void" />
          </mesh>
        )),
      )}
    </group>
  );
}

function CylinderBody({ id, size }: { id: string; size: [number, number, number] }) {
  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[size[0], size[2] ?? size[0], size[1], 96]} />
      <ExhibitMaterial id={id} roughness={0.4} envMapIntensity={0.75} />
    </mesh>
  );
}

function BoxBody({ id, size }: { id: string; size: [number, number, number] }) {
  const minDim = Math.min(size[0], size[1], size[2]);
  const radius = Math.min(0.04, minDim * 0.18);
  const marble = useMarble();
  const podiumish = id.startsWith("podium") || id.startsWith("landing");
  return (
    <RoundedBox args={size} radius={radius} smoothness={5} castShadow receiveShadow>
      <ExhibitMaterial id={id} finish={podiumish ? "marble" : "stone"} map={podiumish ? marble : null} roughness={0.46} />
    </RoundedBox>
  );
}

function PostBody({ id }: { id: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.58, 0.2]} />
        <ExhibitMaterial id={id} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[0.24, 0.07, 0.24]} />
        <ExhibitMaterial id={id} finish="accent" roughness={0.32} />
      </mesh>
    </group>
  );
}

function BalustradeBody({ id }: { id: string }) {
  return (
    <group>
      {[-1.4, -0.7, 0, 0.7, 1.4].map((x) => (
        <mesh key={x} position={[x, 0.08, 0]} castShadow>
          <boxGeometry args={[0.08, 0.28, 0.08]} />
          <ExhibitMaterial id={id} roughness={0.42} />
        </mesh>
      ))}
      <mesh position={[0, 0.24, 0]} castShadow>
        <boxGeometry args={[3.1, 0.05, 0.1]} />
        <ExhibitMaterial id={id} roughness={0.4} />
      </mesh>
    </group>
  );
}

function StatueBody({ id }: { id: string }) {
  return (
    <group>
      <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.7, 0.55]} />
        <ExhibitMaterial id="plaza-esplanade" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.55, 0.22, 0.22]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
      {[-0.16, 0.16].flatMap((x) =>
        [-0.08, 0.08].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.02, z]} castShadow>
            <boxGeometry args={[0.07, 0.32, 0.07]} />
            <ExhibitMaterial id={id} finish="metal" />
          </mesh>
        )),
      )}
      <mesh position={[0.28, 0.28, 0]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.32, 0.12, 0.12]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
      <mesh position={[0.42, 0.32, 0]} castShadow>
        <boxGeometry args={[0.16, 0.1, 0.1]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
      <mesh position={[0.02, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.32, 12]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
      <mesh position={[0.02, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.055, 12, 10]} />
        <ExhibitMaterial id={id} finish="metal" />
      </mesh>
    </group>
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
    case "post":
      return <PostBody id={id} />;
    case "balustrade":
      return <BalustradeBody id={id} />;
    case "statue":
      return <StatueBody id={id} />;
    default:
      return <BoxBody id={id} size={size} />;
  }
}

function LayerLabels() {
  const { explode, locale } = useAtlas();
  const copy = t(locale);
  if (explode < 0.42) return null;
  return (
    <group>
      {LAYER_IDS.map((id) => {
        const origin = CLUSTER[id];
        const layer = LAYERS[id];
        return (
          <Html
            key={id}
            position={[origin[0], origin[1] + 6.6, origin[2]]}
            center
            distanceFactor={22}
            style={{ pointerEvents: "none" }}
          >
            <div className="rounded-full border border-zinc-400/35 bg-white/88 px-3 py-1 font-sans text-[11px] tracking-wide whitespace-nowrap text-zinc-800 uppercase shadow-sm">
              {locale === "es" ? layer.nameEs : layer.nameEn}
              <span className="ml-2 text-[10px] text-zinc-500">{copy.inventory}</span>
            </div>
          </Html>
        );
      })}
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
      <LayerLabels />
    </group>
  );
}
