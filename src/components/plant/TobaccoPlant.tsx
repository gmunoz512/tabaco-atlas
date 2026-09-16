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
import { SelectablePart } from "@/components/plant/SelectablePart";

function useSharedGeometries() {
  return useMemo(
    () => ({
      leaf: createLeafGeometry(),
      stem: createStemGeometry(),
      taproot: createTaprootGeometry(),
      laterals: createLateralCurves().map(
        (curve) => new THREE.TubeGeometry(curve, 18, 0.013, 7, false),
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
  side = THREE.FrontSide,
}: {
  id: string;
  roughness?: number;
  metalness?: number;
  side?: THREE.Side;
}) {
  const { selectedId } = useAtlas();
  const selected = selectedId === id;
  const color = PART_BY_ID[id].color;

  return (
    <meshStandardMaterial
      color={selected ? "#d7c07a" : color}
      roughness={roughness}
      metalness={metalness}
      emissive={selected ? "#8a6c32" : "#111111"}
      emissiveIntensity={selected ? 0.42 : 0.04}
      side={side}
    />
  );
}

function Leaf({ id, geometry }: { id: string; geometry: THREE.BufferGeometry }) {
  return (
    <SelectablePart id={id}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <PlantMaterial id={id} roughness={0.88} side={THREE.DoubleSide} />
      </mesh>
    </SelectablePart>
  );
}

export function TobaccoPlant() {
  const geo = useSharedGeometries();

  return (
    <group>
      <SelectablePart id="taproot">
        <mesh geometry={geo.taproot} castShadow>
          <PlantMaterial id="taproot" roughness={0.92} />
        </mesh>
      </SelectablePart>

      <SelectablePart id="laterals">
        {geo.laterals.map((geometry, index) => (
          <mesh key={index} geometry={geometry} castShadow>
            <PlantMaterial id="laterals" roughness={0.94} />
          </mesh>
        ))}
      </SelectablePart>

      <SelectablePart id="stem">
        <mesh geometry={geo.stem} castShadow>
          <PlantMaterial id="stem" />
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
          <cylinderGeometry args={[0.014, 0.022, 0.5, 8]} />
          <PlantMaterial id="inflorescence" />
        </mesh>
        {[
          [0.14, 0.1, 0.05, 0.7],
          [-0.12, 0.06, 0.12, -0.8],
          [0.05, 0.14, -0.14, 0.3],
          [0.18, 0.02, -0.08, 1.2],
          [-0.16, 0.08, -0.1, -1.1],
        ].map(([x, y, z, rot], index) => (
          <mesh key={index} position={[x, y, z]} rotation={[0.45, rot, 0.18]}>
            <cylinderGeometry args={[0.008, 0.012, 0.34, 6]} />
            <meshStandardMaterial color="#7d8a45" roughness={0.75} />
          </mesh>
        ))}
      </SelectablePart>

      <SelectablePart id="flower">
        {FLOWER_SITES.map((site, index) => (
          <group key={index} position={site.position} rotation={site.rotation}>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.024, 0.02, 0.08, 8]} />
              <meshStandardMaterial color="#5f7a38" roughness={0.8} />
            </mesh>
            {site.open ? (
              <>
                <mesh geometry={geo.flowerTube}>
                  <PlantMaterial id="flower" roughness={0.42} />
                </mesh>
                <mesh geometry={geo.flowerLimb} position={[0, 0.2, 0]}>
                  <meshStandardMaterial
                    color="#f3b6c0"
                    roughness={0.35}
                    emissive="#6a3038"
                    emissiveIntensity={0.18}
                  />
                </mesh>
              </>
            ) : (
              <mesh position={[0, 0.04, 0]}>
                <sphereGeometry args={[0.034, 10, 8]} />
                <meshStandardMaterial color="#d9a3ad" roughness={0.5} />
              </mesh>
            )}
          </group>
        ))}
      </SelectablePart>
    </group>
  );
}
