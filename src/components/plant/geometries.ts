import * as THREE from "three";

export function createLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.18, 0.08, 0.36, 0.32, 0.4, 0.72);
  shape.bezierCurveTo(0.42, 1.12, 0.24, 1.48, 0.1, 1.78);
  shape.bezierCurveTo(0.04, 1.9, 0.012, 1.98, 0, 2.06);
  shape.bezierCurveTo(-0.012, 1.98, -0.04, 1.9, -0.1, 1.78);
  shape.bezierCurveTo(-0.24, 1.48, -0.42, 1.12, -0.4, 0.72);
  shape.bezierCurveTo(-0.36, 0.32, -0.18, 0.08, 0, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.008,
    bevelEnabled: false,
    curveSegments: 22,
  });

  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const t = THREE.MathUtils.clamp(y / 2.06, 0, 1);
    const droop = t * t * 0.28 + Math.sin(t * Math.PI) * 0.06;
    const cup = x * x * 0.9;
    position.setZ(i, z + droop + cup);
  }

  geometry.computeVertexNormals();
  return geometry;
}

export function createTaprootGeometry() {
  return new THREE.CylinderGeometry(0.05, 0.014, 1.05, 12, 4);
}

export function createStemGeometry() {
  return new THREE.CylinderGeometry(0.028, 0.055, 2.48, 14, 6);
}

export function createLateralCurves() {
  const seeds = [
    [0.12, -0.08, 0.04, 0.72, -0.55, 0.22],
    [-0.1, -0.1, 0.08, -0.62, -0.62, 0.32],
    [0.04, -0.12, -0.12, 0.2, -0.68, -0.58],
    [0.16, -0.06, -0.02, 0.78, -0.48, -0.26],
    [-0.14, -0.09, -0.06, -0.74, -0.52, -0.2],
    [0.02, -0.14, 0.14, -0.24, -0.7, 0.55],
    [0.2, -0.11, 0.12, 0.56, -0.58, 0.48],
    [-0.18, -0.07, 0.1, -0.48, -0.56, 0.58],
    [0.08, -0.16, -0.08, 0.42, -0.74, -0.22],
    [-0.06, -0.13, -0.16, -0.32, -0.66, -0.52],
  ] as const;

  return seeds.map(([x1, y1, z1, x2, y2, z2]) => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(x1 * 0.2, y1 * 0.15, z1 * 0.2),
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3((x1 + x2) * 0.55, (y1 + y2) * 0.62, (z1 + z2) * 0.55),
      new THREE.Vector3(x2, y2, z2),
    ]);
  });
}

export function createFlowerTubeGeometry() {
  return new THREE.CylinderGeometry(0.028, 0.018, 0.42, 12, 1);
}

export function createFlowerLimbGeometry() {
  const points = [
    new THREE.Vector2(0.026, 0),
    new THREE.Vector2(0.055, 0.022),
    new THREE.Vector2(0.082, 0.04),
    new THREE.Vector2(0.064, 0.055),
  ];
  return new THREE.LatheGeometry(points, 12);
}

export interface PartPose {
  rest: THREE.Vector3Tuple;
  explode: THREE.Vector3Tuple;
  rotation: THREE.Vector3Tuple;
  scale: THREE.Vector3Tuple;
  rotationOrder?: THREE.EulerOrder;
}

export const PART_POSES: Record<string, PartPose> = {
  taproot: {
    rest: [0, -0.52, 0],
    explode: [0, -1.7, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  laterals: {
    rest: [0, -0.06, 0],
    explode: [0, -1.9, 0.12],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  stem: {
    rest: [0, 1.24, 0],
    explode: [0, 0.28, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  "leaf-basal-a": {
    rest: [0.05, 0.5, 0.02],
    explode: [-1.75, 0.18, 0.45],
    rotation: [1.12, 0.35, 0.12],
    scale: [1.2, 1.2, 1.2],
    rotationOrder: "YXZ",
  },
  "leaf-basal-b": {
    rest: [-0.04, 0.64, -0.03],
    explode: [1.7, 0.16, -0.5],
    rotation: [1.1, 3.55, -0.1],
    scale: [1.14, 1.14, 1.14],
    rotationOrder: "YXZ",
  },
  "leaf-mid-a": {
    rest: [0.04, 1.04, 0.03],
    explode: [-1.55, 1.02, 0.95],
    rotation: [1.02, 1.55, 0.08],
    scale: [1.04, 1.04, 1.04],
    rotationOrder: "YXZ",
  },
  "leaf-mid-b": {
    rest: [-0.03, 1.22, 0.03],
    explode: [1.6, 1.14, 0.55],
    rotation: [0.98, 4.05, -0.08],
    scale: [0.96, 0.96, 0.96],
    rotationOrder: "YXZ",
  },
  "leaf-mid-c": {
    rest: [0.03, 1.46, -0.03],
    explode: [0.15, 1.34, -1.65],
    rotation: [0.92, 2.75, 0.1],
    scale: [0.88, 0.88, 0.88],
    rotationOrder: "YXZ",
  },
  "leaf-upper-a": {
    rest: [0.025, 1.88, 0.02],
    explode: [-1.2, 2.12, -0.75],
    rotation: [0.82, 5.15, 0.06],
    scale: [0.7, 0.7, 0.7],
    rotationOrder: "YXZ",
  },
  "leaf-upper-b": {
    rest: [-0.02, 2.14, 0.01],
    explode: [1.2, 2.32, 0.55],
    rotation: [0.74, 1.95, -0.05],
    scale: [0.58, 0.58, 0.58],
    rotationOrder: "YXZ",
  },
  inflorescence: {
    rest: [0, 2.58, 0],
    explode: [0, 3.65, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  flower: {
    rest: [0, 2.82, 0],
    explode: [0, 4.2, 0],
    rotation: [0, 0, 0],
    scale: [1.35, 1.35, 1.35],
  },
};

export const FLOWER_SITES: Array<{
  position: THREE.Vector3Tuple;
  rotation: THREE.Vector3Tuple;
  open: boolean;
}> = [
  { position: [0.12, 0.28, 0.05], rotation: [0.2, 0.35, 0.08], open: true },
  { position: [-0.14, 0.24, 0.1], rotation: [0.28, -0.55, -0.12], open: true },
  { position: [0.03, 0.38, -0.12], rotation: [-0.12, 0.18, 0.04], open: true },
  { position: [0.18, 0.16, -0.1], rotation: [0.38, 1.05, 0.16], open: true },
  { position: [-0.16, 0.14, -0.08], rotation: [0.42, -1.15, -0.08], open: false },
  { position: [0.06, 0.12, 0.18], rotation: [0.48, 0.12, 0.18], open: true },
  { position: [-0.08, 0.32, 0.14], rotation: [0.15, -0.3, 0.1], open: true },
];
