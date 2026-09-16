import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useAtlas } from "@/state/atlas-store";
import { PART_POSES } from "@/components/monument/poses";

interface SelectablePartProps {
  id: string;
  children: ReactNode;
}

export function SelectablePart({ id, children }: SelectablePartProps) {
  const group = useRef<THREE.Group>(null);
  const { selectedId, setSelectedId, explode, isPartVisible } = useAtlas();
  const pose = PART_POSES[id];
  const selected = selectedId === id;
  const visible = isPartVisible(id);

  const rest = useMemo(() => new THREE.Vector3(...pose.rest), [pose.rest]);
  const explodedPos = useMemo(() => new THREE.Vector3(...pose.explode), [pose.explode]);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    target.lerpVectors(rest, explodedPos, explode);
    node.position.lerp(target, 1 - Math.exp(-delta * 4.4));
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
