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

export function createHelixCurve(radius: number, height: number, turns: number, points = 240) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const a = t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, t * height - height / 2, Math.sin(a) * radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export function createHelixGeometry(radius: number, height: number, turns: number, tube = 0.018) {
  return new THREE.TubeGeometry(createHelixCurve(radius, height, turns), 280, tube, 7, false);
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
  shape.bezierCurveTo(0.08, 0.1, 0.16, 0.28, 0.06, 0.5);
  shape.bezierCurveTo(0.0, 0.46, -0.12, 0.24, -0.08, 0.04);
  shape.lineTo(0, 0);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.022,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.01,
    bevelSegments: 2,
    curveSegments: 14,
  });
}

export function createDuskSkyTexture() {
  const w = 2048;
  const h = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, h, 0, 0);
  g.addColorStop(0, "#c47a3a");
  g.addColorStop(0.12, "#e8a15a");
  g.addColorStop(0.22, "#f3c48a");
  g.addColorStop(0.34, "#d7c3b0");
  g.addColorStop(0.5, "#8aa3c0");
  g.addColorStop(0.7, "#4d6488");
  g.addColorStop(1, "#24344f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const blob = (x: number, y: number, rw: number, rh: number, color: string) => {
    const grd = ctx.createRadialGradient(x, y, 4, x, y, Math.max(rw, rh));
    grd.addColorStop(0, color);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  for (let i = 0; i < 18; i += 1) {
    blob(80 + i * 55, 220 + (i % 5) * 28, 140, 42, "rgba(38,48,68,0.55)");
  }
  for (let i = 0; i < 14; i += 1) {
    blob(980 + i * 70, 280 + (i % 4) * 36, 160, 36, "rgba(255,210,160,0.28)");
  }
  for (let i = 0; i < 10; i += 1) {
    blob(400 + i * 90, 160, 180, 30, "rgba(230,236,245,0.22)");
  }
  blob(w * 0.78, h * 0.72, 220, 90, "rgba(255,170,80,0.35)");

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

let stoneMaps: { albedo: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null = null;

function noiseCanvas(size: number, contrast: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.fillStyle = "#e6dfd4";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 16000; i += 1) {
    const n = 140 + Math.random() * 100;
    const a = (0.035 + Math.random() * 0.16) * contrast;
    ctx.fillStyle = `rgba(${n},${n - 6},${n - 14},${a})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2.4, 1 + Math.random() * 2.4);
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
  bump.colorSpace = THREE.NoColorSpace;
  stoneMaps = { albedo, bump };
  return stoneMaps;
}
