import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { PART_BY_ID } from "@/data/parts";
import { useAtlas } from "@/state/atlas-store";
import { PART_POSES } from "@/components/monument/poses";

interface SelectablePartProps {
  id: string;
  children: ReactNode;
}

export function SelectablePart({ id, children }: SelectablePartProps) {
  const group = useRef<THREE.Group>(null);
  const { selectedId, setSelectedId, exploded, isPartVisible } = useAtlas();
  const pose = PART_POSES[id];
  const selected = selectedId === id;
  const visible = isPartVisible(id);

  const rest = useMemo(() => new THREE.Vector3(...pose.rest), [pose.rest]);
  const explodedPos = useMemo(() => new THREE.Vector3(...pose.explode), [pose.explode]);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const target = exploded ? explodedPos : rest;
    node.position.lerp(target, 1 - Math.exp(-delta * 6.2));
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
    </group>
  );
}

export function partColor(id: string, selected: boolean) {
  return selected ? "#d7c07a" : PART_BY_ID[id].color;
}
