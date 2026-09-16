import * as THREE from "three";

export function createArchShape(width: number, height: number) {
  const half = width / 2;
  const radius = Math.min(half, height * 0.42);
  const shape = new THREE.Shape();
  shape.moveTo(-half, 0);
  shape.lineTo(-half, height - radius);
  shape.absarc(0, height - radius, radius, Math.PI, 0, false);
  shape.lineTo(half, 0);
  shape.closePath();
  return shape;
}

export function createArchGeometry(width: number, height: number, depth: number) {
  return new THREE.ExtrudeGeometry(createArchShape(width, height), {
    depth,
    bevelEnabled: false,
    curveSegments: 12,
  });
}

export function createHelixCurve(radius: number, height: number, turns: number, points = 140) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const a = t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, t * height - height / 2, Math.sin(a) * radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export function createHelixGeometry(radius: number, height: number, turns: number, tube = 0.032) {
  return new THREE.TubeGeometry(createHelixCurve(radius, height, turns), 160, tube, 8, false);
}
