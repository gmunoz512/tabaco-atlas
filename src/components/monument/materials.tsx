import { PART_BY_ID } from "@/data/parts";
import { useAtlas } from "@/state/atlas-store";

import type { Texture } from "three";

export type Finish = "stone" | "metal" | "void" | "accent" | "marble";

const SELECTED = "#e4c38a";

export function ExhibitMaterial({
  id,
  finish = "stone",
  roughness,
  metalness,
  envMapIntensity,
  map,
  offset = false,
}: {
  id: string;
  finish?: Finish;
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  map?: Texture | null;
  offset?: boolean;
}) {
  const { selectedId } = useAtlas();
  const selected = selectedId === id;
  const base = PART_BY_ID[id].color;
  const color = selected ? SELECTED : base;

  if (finish === "metal") {
    return (
      <meshPhysicalMaterial
        color={color}
        roughness={selected ? 0.18 : (roughness ?? 0.24)}
        metalness={selected ? 0.92 : (metalness ?? 0.82)}
        envMapIntensity={envMapIntensity ?? 1.15}
        clearcoat={0.35}
        clearcoatRoughness={0.28}
        emissive={selected ? "#8a6230" : "#2a1810"}
        emissiveIntensity={selected ? 0.28 : 0.08}
        polygonOffset={offset}
        polygonOffsetFactor={offset ? -1 : 0}
      />
    );
  }

  if (finish === "void") {
    return (
      <meshPhysicalMaterial
        color={selected ? "#3a4658" : "#151c28"}
        roughness={0.9}
        metalness={0.08}
        envMapIntensity={0.2}
        emissive={selected ? "#6a4a20" : "#0a1018"}
        emissiveIntensity={selected ? 0.18 : 0.22}
        polygonOffset={offset}
        polygonOffsetFactor={offset ? -1 : 0}
      />
    );
  }

  if (finish === "marble") {
    return (
      <meshPhysicalMaterial
        color={color}
        map={map ?? undefined}
        roughness={selected ? 0.28 : (roughness ?? 0.36)}
        metalness={selected ? 0.16 : (metalness ?? 0.08)}
        envMapIntensity={envMapIntensity ?? 0.85}
        clearcoat={0.34}
        clearcoatRoughness={0.28}
        emissive={selected ? "#6a4e24" : "#000000"}
        emissiveIntensity={selected ? 0.18 : 0}
        polygonOffset={offset}
        polygonOffsetFactor={offset ? -1 : 0}
      />
    );
  }

  if (finish === "accent") {
    return (
      <meshPhysicalMaterial
        color={color}
        roughness={selected ? 0.22 : (roughness ?? 0.32)}
        metalness={selected ? 0.7 : (metalness ?? 0.55)}
        envMapIntensity={envMapIntensity ?? 0.95}
        emissive={selected ? "#7a5a28" : "#3a2a18"}
        emissiveIntensity={selected ? 0.32 : 0.16}
        polygonOffset={offset}
        polygonOffsetFactor={offset ? -1 : 0}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      color={color}
      roughness={selected ? 0.32 : (roughness ?? 0.48)}
      metalness={selected ? 0.18 : (metalness ?? 0.1)}
      envMapIntensity={envMapIntensity ?? 0.72}
      clearcoat={0.22}
      clearcoatRoughness={0.42}
      sheen={0.28}
      sheenColor="#f4efe6"
      sheenRoughness={0.55}
      emissive={selected ? "#6a4e24" : "#000000"}
      emissiveIntensity={selected ? 0.2 : 0}
      polygonOffset={offset}
      polygonOffsetFactor={offset ? -1 : 0}
    />
  );
}

export function StaticStone({ color = "#f2eee6" }: { color?: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.5}
      metalness={0.1}
      envMapIntensity={0.68}
      clearcoat={0.18}
      clearcoatRoughness={0.46}
      sheen={0.22}
      sheenColor="#f7f3ec"
      sheenRoughness={0.6}
    />
  );
}
