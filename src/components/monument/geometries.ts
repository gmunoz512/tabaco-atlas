import * as THREE from "three";

export function createArchShape(width: number, height: number) {
  const half = width / 2;
  const radius = Math.min(half, height * 0.48);
  const shape = new THREE.Shape();
  shape.moveTo(-half, 0);
  shape.lineTo(-half, height - radius);
  shape.absarc(0, height - radius, radius, Math.PI, 0, false);
  shape.lineTo(half, 0);
  shape.closePath();
  return shape;
}

export function createArchGeometry(width: number, height: number, depth: number) {
  const geo = new THREE.ExtrudeGeometry(createArchShape(width, height), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.008,
    bevelSegments: 2,
    curveSegments: 28,
  });
  geo.center();
  return geo;
}

export function createHelixCurve(radius: number, height: number, turns: number, points = 360) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const a = t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, t * height - height / 2, Math.sin(a) * radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export function createHelixGeometry(radius: number, height: number, turns: number, tube = 0.02) {
  return new THREE.TubeGeometry(createHelixCurve(radius, height, turns), 420, tube, 12, false);
}

export function createShieldGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.16);
  shape.bezierCurveTo(0.12, 0.16, 0.14, 0.05, 0.14, 0);
  shape.bezierCurveTo(0.14, -0.1, 0.045, -0.16, 0, -0.2);
  shape.bezierCurveTo(-0.045, -0.16, -0.14, -0.1, -0.14, 0);
  shape.bezierCurveTo(-0.14, 0.05, -0.12, 0.16, 0, 0.16);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3,
    curveSegments: 20,
  });
  geo.center();
  return geo;
}

export function createWingGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.1, 0.18, 0.3, 0.46, 0.08, 0.86);
  shape.bezierCurveTo(0.02, 0.74, -0.22, 0.38, -0.1, 0.05);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.01,
    bevelSegments: 3,
    curveSegments: 24,
  });
  geo.center();
  return geo;
}

export function createAngelBodyGeometry() {
  const pts = [
    new THREE.Vector2(0.012, 0),
    new THREE.Vector2(0.09, 0.02),
    new THREE.Vector2(0.078, 0.1),
    new THREE.Vector2(0.1, 0.22),
    new THREE.Vector2(0.048, 0.36),
    new THREE.Vector2(0.038, 0.46),
    new THREE.Vector2(0.05, 0.52),
    new THREE.Vector2(0.02, 0.56),
  ];
  const geo = new THREE.LatheGeometry(pts, 48);
  geo.center();
  return geo;
}

export function createStairGeometry(steps = 18, width = 3.9, rise = 0.04, run = 0.11) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  for (let i = 0; i < steps; i += 1) {
    shape.lineTo(i * run, (i + 1) * rise);
    shape.lineTo((i + 1) * run, (i + 1) * rise);
  }
  shape.lineTo(steps * run, 0);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.005,
    bevelSegments: 2,
    curveSegments: 4,
  });
  geo.rotateY(Math.PI / 2);
  geo.center();
  return geo;
}

/** Clean dusk void — vertical gradient only, no weather, no city glow. */
export function createVoidSkyTexture() {
  const w = 8;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  grd.addColorStop(0, "#07090f");
  grd.addColorStop(0.42, "#101826");
  grd.addColorStop(0.72, "#1c2740");
  grd.addColorStop(0.88, "#2a3348");
  grd.addColorStop(1, "#1a1e28");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}
