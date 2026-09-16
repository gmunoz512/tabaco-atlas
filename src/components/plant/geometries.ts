import * as THREE from "three";

export function createLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.2, 0.06, 0.4, 0.26, 0.46, 0.62);
  shape.bezierCurveTo(0.5, 0.98, 0.3, 1.3, 0.13, 1.54);
  shape.bezierCurveTo(0.05, 1.66, 0.016, 1.74, 0, 1.8);
  shape.bezierCurveTo(-0.016, 1.74, -0.05, 1.66, -0.13, 1.54);
  shape.bezierCurveTo(-0.3, 1.3, -0.5, 0.98, -0.46, 0.62);
  shape.bezierCurveTo(-0.4, 0.26, -0.2, 0.06, 0, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.018,
    bevelSegments: 2,
    curveSegments: 20,
  });

  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const t = THREE.MathUtils.clamp(y / 1.8, 0, 1);
    const droop = Math.sin(t * Math.PI) * 0.14 + t * t * 0.2;
    const cup = x * x * 1.6;
    position.setZ(i, z + droop + cup);
  }

  geometry.computeVertexNormals();
  return geometry;
}

export function createTaprootGeometry() {
  return new THREE.CylinderGeometry(0.048, 0.012, 0.92, 12, 4);
}

export function createStemGeometry() {
  return new THREE.CylinderGeometry(0.03, 0.058, 2.52, 14, 6);
}

export function createLateralCurves() {
  const seeds = [
    [0.12, -0.08, 0.04, 0.62, -0.42, 0.18],
    [-0.1, -0.1, 0.08, -0.55, -0.5, 0.28],
    [0.04, -0.12, -0.12, 0.18, -0.55, -0.52],
    [0.16, -0.06, -0.02, 0.68, -0.36, -0.22],
    [-0.14, -0.09, -0.06, -0.66, -0.4, -0.16],
    [0.02, -0.14, 0.14, -0.22, -0.58, 0.48],
    [0.2, -0.11, 0.12, 0.5, -0.48, 0.42],
    [-0.18, -0.07, 0.1, -0.42, -0.46, 0.5],
    [0.08, -0.16, -0.08, 0.38, -0.62, -0.18],
    [-0.06, -0.13, -0.16, -0.28, -0.54, -0.46],
  ] as const;

  return seeds.map(([x1, y1, z1, x2, y2, z2]) => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(x1 * 0.25, y1 * 0.2, z1 * 0.25),
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3((x1 + x2) * 0.55, (y1 + y2) * 0.62, (z1 + z2) * 0.55),
      new THREE.Vector3(x2, y2, z2),
    ]);
  });
}

export function createFlowerTubeGeometry() {
  return new THREE.CylinderGeometry(0.02, 0.013, 0.3, 10, 1, true);
}

export function createFlowerLimbGeometry() {
  const points = [
    new THREE.Vector2(0.018, 0),
    new THREE.Vector2(0.042, 0.018),
    new THREE.Vector2(0.062, 0.03),
    new THREE.Vector2(0.05, 0.042),
  ];
  return new THREE.LatheGeometry(points, 10);
}

export interface PartPose {
  rest: THREE.Vector3Tuple;
  explode: THREE.Vector3Tuple;
  rotation: THREE.Vector3Tuple;
  scale: THREE.Vector3Tuple;
}

export const PART_POSES: Record<string, PartPose> = {
  taproot: {
    rest: [0, -0.46, 0],
    explode: [0, -1.55, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  laterals: {
    rest: [0, -0.04, 0],
    explode: [0, -1.75, 0.12],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  stem: {
    rest: [0, 1.26, 0],
    explode: [0, 0.35, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  "leaf-basal-a": {
    rest: [0.02, 0.5, 0.02],
    explode: [-1.55, 0.2, 0.35],
    rotation: [0.95, 0.15, 2.15],
    scale: [1.18, 1.18, 1.18],
  },
  "leaf-basal-b": {
    rest: [-0.02, 0.62, -0.01],
    explode: [1.5, 0.15, -0.4],
    rotation: [1.0, 0.1, -0.85],
    scale: [1.12, 1.12, 1.12],
  },
  "leaf-mid-a": {
    rest: [0.02, 1.02, 0.01],
    explode: [-1.35, 1.05, 0.85],
    rotation: [0.82, 0.2, 2.85],
    scale: [1.02, 1.02, 1.02],
  },
  "leaf-mid-b": {
    rest: [-0.01, 1.18, 0.02],
    explode: [1.4, 1.15, 0.55],
    rotation: [0.78, -0.15, -0.2],
    scale: [0.96, 0.96, 0.96],
  },
  "leaf-mid-c": {
    rest: [0.01, 1.42, -0.02],
    explode: [0.15, 1.35, -1.45],
    rotation: [0.74, 0.25, 1.45],
    scale: [0.88, 0.88, 0.88],
  },
  "leaf-upper-a": {
    rest: [0.01, 1.86, 0.01],
    explode: [-1.05, 2.05, -0.75],
    rotation: [0.62, 0.1, 2.45],
    scale: [0.7, 0.7, 0.7],
  },
  "leaf-upper-b": {
    rest: [-0.01, 2.12, 0],
    explode: [1.05, 2.25, 0.55],
    rotation: [0.55, -0.12, -0.55],
    scale: [0.58, 0.58, 0.58],
  },
  inflorescence: {
    rest: [0, 2.58, 0],
    explode: [0, 3.55, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  flower: {
    rest: [0, 2.72, 0],
    explode: [0, 4.05, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
};

export const FLOWER_SITES: Array<{
  position: THREE.Vector3Tuple;
  rotation: THREE.Vector3Tuple;
  open: boolean;
}> = [
  { position: [0.08, 0.22, 0.04], rotation: [0.25, 0.4, 0.1], open: true },
  { position: [-0.1, 0.18, 0.08], rotation: [0.35, -0.6, -0.15], open: true },
  { position: [0.02, 0.3, -0.1], rotation: [-0.15, 0.2, 0.05], open: true },
  { position: [0.14, 0.12, -0.08], rotation: [0.45, 1.1, 0.2], open: true },
  { position: [-0.12, 0.1, -0.06], rotation: [0.5, -1.2, -0.1], open: false },
  { position: [0.04, 0.08, 0.14], rotation: [0.55, 0.15, 0.2], open: false },
];
