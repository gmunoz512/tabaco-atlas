import * as THREE from "three";

export function createArchShape(width: number, height: number) {
  const half = width / 2;
  const radius = Math.min(half, height * 0.45);
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
    curveSegments: 16,
  });
}

export function createHelixCurve(radius: number, height: number, turns: number, points = 220) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const a = t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, t * height - height / 2, Math.sin(a) * radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export function createHelixGeometry(radius: number, height: number, turns: number, tube = 0.018) {
  return new THREE.TubeGeometry(createHelixCurve(radius, height, turns), 240, tube, 7, false);
}

export function createShieldGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.15);
  shape.bezierCurveTo(0.11, 0.15, 0.13, 0.05, 0.13, 0);
  shape.bezierCurveTo(0.13, -0.09, 0.04, -0.15, 0, -0.19);
  shape.bezierCurveTo(-0.04, -0.15, -0.13, -0.09, -0.13, 0);
  shape.bezierCurveTo(-0.13, 0.05, -0.11, 0.15, 0, 0.15);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 10,
  });
}

export function createWingGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.05, 0.08, 0.1, 0.22, 0.04, 0.38);
  shape.bezierCurveTo(0.01, 0.36, -0.07, 0.2, -0.06, 0.05);
  shape.lineTo(0, 0);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.008,
    bevelSegments: 2,
    curveSegments: 12,
  });
}

let stoneMaps: { albedo: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null = null;

function noiseCanvas(size: number, contrast: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.fillStyle = "#d8d2c8";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 16000; i += 1) {
    const n = 120 + Math.random() * 110;
    const a = (0.035 + Math.random() * 0.16) * contrast;
    ctx.fillStyle = `rgba(${n},${n - 6},${n - 14},${a})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2.4, 1 + Math.random() * 2.4);
  }
  ctx.strokeStyle = `rgba(70,62,52,${0.045 * contrast})`;
  ctx.lineWidth = 1;
  for (let i = 0; i < 22; i += 1) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, Math.random() * size);
    ctx.quadraticCurveTo(
      Math.random() * size,
      Math.random() * size,
      Math.random() * size,
      Math.random() * size,
    );
    ctx.stroke();
  }
  return canvas;
}

export function getStoneMaps() {
  if (stoneMaps) return stoneMaps;
  if (typeof document === "undefined") return null;
  const albedo = new THREE.CanvasTexture(noiseCanvas(256, 1));
  albedo.wrapS = albedo.wrapT = THREE.RepeatWrapping;
  albedo.repeat.set(2.2, 2.2);
  albedo.anisotropy = 8;
  albedo.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(noiseCanvas(256, 1.8));
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(2.2, 2.2);
  bump.anisotropy = 4;
  bump.colorSpace = THREE.NoColorSpace;
  stoneMaps = { albedo, bump };
  return stoneMaps;
}
