import { useLayoutEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const BASE = import.meta.env.BASE_URL;

function prep(map: THREE.Texture, repeat: number, srgb: boolean) {
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeat, repeat);
  map.anisotropy = 8;
  map.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  map.needsUpdate = true;
  return map;
}

export function useSceneTextures() {
  const maps = useTexture({
    stoneMap: `${BASE}tex/stone_diff.jpg`,
    stoneNor: `${BASE}tex/stone_nor.jpg`,
    stoneRough: `${BASE}tex/stone_rough.jpg`,
    grassMap: `${BASE}tex/grass_diff.jpg`,
    grassNor: `${BASE}tex/grass_nor.jpg`,
    grassRough: `${BASE}tex/grass_rough.jpg`,
    asphaltMap: `${BASE}tex/asphalt_diff.jpg`,
    asphaltNor: `${BASE}tex/asphalt_nor.jpg`,
    asphaltRough: `${BASE}tex/asphalt_rough.jpg`,
  });

  useLayoutEffect(() => {
    prep(maps.stoneMap, 2.4, true);
    prep(maps.stoneNor, 2.4, false);
    prep(maps.stoneRough, 2.4, false);
    prep(maps.grassMap, 22, true);
    prep(maps.grassNor, 22, false);
    prep(maps.grassRough, 22, false);
    prep(maps.asphaltMap, 8, true);
    prep(maps.asphaltNor, 8, false);
    prep(maps.asphaltRough, 8, false);
  }, [maps]);

  return maps;
}

export const HDRI_PATH = `${BASE}env/dusk.hdr`;
