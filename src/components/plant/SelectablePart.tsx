import { Html, Outlines } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { PART_BY_ID, partLabel } from "@/data/parts";
import { useAtlas } from "@/state/atlas-store";
import { PART_POSES } from "@/components/plant/geometries";

interface SelectablePartProps {
  id: string;
  children: ReactNode;
}

const GOLD = new THREE.Color("#f0d48a");

export function SelectablePart({ id, children }: SelectablePartProps) {
  const group = useRef<THREE.Group>(null);
  const { selectedId, setSelectedId, exploded, isPartVisible, locale } = useAtlas();
  const pose = PART_POSES[id];
  const part = PART_BY_ID[id];
  const selected = selectedId === id;
  const visible = isPartVisible(id);

  const rest = useMemo(() => new THREE.Vector3(...pose.rest), [pose.rest]);
  const explodedPos = useMemo(() => new THREE.Vector3(...pose.explode), [pose.explode]);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const target = exploded ? explodedPos : rest;
    node.position.lerp(target, 1 - Math.exp(-delta * 7));
    node.visible = visible;
  });

  return (
    <group
      ref={group}
      position={pose.rest}
      rotation={pose.rotation}
      scale={pose.scale}
      onPointerDown={(event) => {
        event.stopPropagation();
        pointer.current = {
          x: event.nativeEvent.clientX,
          y: event.nativeEvent.clientY,
        };
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        const dx = event.nativeEvent.clientX - pointer.current.x;
        const dy = event.nativeEvent.clientY - pointer.current.y;
        if (Math.hypot(dx, dy) < 8) {
          setSelectedId(selected ? null : id);
        }
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {children}
      {selected ? (
        <Html position={[0, 0.22, 0]} center distanceFactor={8} occlude={false}>
          <div className="pointer-events-none rounded-full border border-gold/40 bg-ink/80 px-2.5 py-1 text-[11px] whitespace-nowrap text-cream shadow-lg">
            {partLabel(part, locale)}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

export function SelectionGlow({ active, color }: { active: boolean; color: string }) {
  return (
    <Outlines
      thickness={active ? 3.2 : 0}
      color={active ? GOLD : color}
      screenspace
      opacity={active ? 1 : 0}
      transparent
    />
  );
}
