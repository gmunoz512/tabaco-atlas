import { useMemo } from "react";
import * as THREE from "three";
import { useAtlas } from "@/state/atlas-store";
import { PART_BY_ID } from "@/data/parts";
import {
  createFlowerLimbGeometry,
  createFlowerTubeGeometry,
  createLateralCurves,
  createLeafGeometry,
  createStemGeometry,
  createTaprootGeometry,
  FLOWER_SITES,
} from "@/components/plant/geometries";
import { SelectablePart, SelectionGlow } from "@/components/plant/SelectablePart";

function useSharedGeometries() {
  return useMemo(
    () => ({
      leaf: createLeafGeometry(),
      stem: createStemGeometry(),
      taproot: createTaprootGeometry(),
      laterals: createLateralCurves().map(
        (curve) => new THREE.TubeGeometry(curve, 18, 0.012, 7, false),
      ),
      flowerTube: createFlowerTubeGeometry(),
      flowerLimb: createFlowerLimbGeometry(),
    }),
    [],
  );
}

function PlantMaterial({
  id,
  roughness = 0.78,
  metalness = 0.02,
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
      emissive={selected ? "#7a6230" : "#000000"}
      emissiveIntensity={selected ? 0.35 : 0}
    />
  );
}

function Leaf({ id, geometry }: { id: string; geometry: THREE.BufferGeometry }) {
  const { selectedId } = useAtlas();

  return (
    <SelectablePart id={id}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <PlantMaterial id={id} roughness={0.86} />
        <SelectionGlow active={selectedId === id} color={PART_BY_ID[id].color} />
      </mesh>
      <mesh position={[0, 0.78, 0.02]} rotation={[0.08, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.014, 1.55, 6]} />
        <meshStandardMaterial color="#4d6a2f" roughness={0.7} />
      </mesh>
    </SelectablePart>
  );
}

export function TobaccoPlant() {
  const geo = useSharedGeometries();
  const { selectedId } = useAtlas();

  return (
    <group>
      <SelectablePart id="taproot">
        <mesh geometry={geo.taproot} castShadow>
          <PlantMaterial id="taproot" roughness={0.9} />
          <SelectionGlow active={selectedId === "taproot"} color={PART_BY_ID.taproot.color} />
        </mesh>
      </SelectablePart>

      <SelectablePart id="laterals">
        {geo.laterals.map((geometry, index) => (
          <mesh key={index} geometry={geometry} castShadow>
            <PlantMaterial id="laterals" roughness={0.92} />
            {index === 0 ? (
              <SelectionGlow active={selectedId === "laterals"} color={PART_BY_ID.laterals.color} />
            ) : null}
          </mesh>
        ))}
      </SelectablePart>

      <SelectablePart id="stem">
        <mesh geometry={geo.stem} castShadow>
          <PlantMaterial id="stem" />
          <SelectionGlow active={selectedId === "stem"} color={PART_BY_ID.stem.color} />
        </mesh>
      </SelectablePart>

      <Leaf id="leaf-basal-a" geometry={geo.leaf} />
      <Leaf id="leaf-basal-b" geometry={geo.leaf} />
      <Leaf id="leaf-mid-a" geometry={geo.leaf} />
      <Leaf id="leaf-mid-b" geometry={geo.leaf} />
      <Leaf id="leaf-mid-c" geometry={geo.leaf} />
      <Leaf id="leaf-upper-a" geometry={geo.leaf} />
      <Leaf id="leaf-upper-b" geometry={geo.leaf} />

      <SelectablePart id="inflorescence">
        <mesh>
          <cylinderGeometry args={[0.012, 0.02, 0.42, 8]} />
          <PlantMaterial id="inflorescence" />
          <SelectionGlow
            active={selectedId === "inflorescence"}
            color={PART_BY_ID.inflorescence.color}
          />
        </mesh>
        {[
          [0.12, 0.08, 0.04, 0.7],
          [-0.1, 0.04, 0.1, -0.8],
          [0.04, 0.12, -0.12, 0.3],
          [0.16, 0, -0.06, 1.2],
        ].map(([x, y, z, rot], index) => (
          <mesh key={index} position={[x, y, z]} rotation={[0.4, rot, 0.2]}>
            <cylinderGeometry args={[0.007, 0.01, 0.28, 6]} />
            <meshStandardMaterial color="#7d8a45" roughness={0.75} />
          </mesh>
        ))}
      </SelectablePart>

      <SelectablePart id="flower">
        {FLOWER_SITES.map((site, index) => (
          <group key={index} position={site.position} rotation={site.rotation}>
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.018, 0.016, 0.07, 8]} />
              <meshStandardMaterial color="#5f7a38" roughness={0.8} />
            </mesh>
            {site.open ? (
              <>
                <mesh geometry={geo.flowerTube}>
                  <PlantMaterial id="flower" roughness={0.45} />
                  {index === 0 ? (
                    <SelectionGlow active={selectedId === "flower"} color={PART_BY_ID.flower.color} />
                  ) : null}
                </mesh>
                <mesh geometry={geo.flowerLimb} position={[0, 0.15, 0]}>
                  <meshStandardMaterial color="#f3cfd4" roughness={0.4} />
                </mesh>
              </>
            ) : (
              <mesh position={[0, 0.02, 0]}>
                <sphereGeometry args={[0.028, 10, 8]} />
                <meshStandardMaterial color="#d9a3ad" roughness={0.5} />
              </mesh>
            )}
          </group>
        ))}
      </SelectablePart>
    </group>
  );
}
