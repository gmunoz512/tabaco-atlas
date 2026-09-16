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

/** Clockwise from above so the front face reads up-and-right, matching photos. */
export function createHelixCurve(radius: number, height: number, turns: number, points = 480) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const a = -t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, t * height - height / 2, Math.sin(a) * radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export function createHelixGeometry(radius: number, height: number, turns: number, tube = 0.048) {
  return new THREE.TubeGeometry(createHelixCurve(radius, height, turns), 560, tube, 14, false);
}

export function helixVentPositions(radius: number, height: number, turns: number, count = 18) {
  const curve = createHelixCurve(radius, height, turns, count);
  return curve.getSpacedPoints(count);
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
  shape.bezierCurveTo(0.08, 0.12, 0.26, 0.28, 0.12, 0.62);
  shape.bezierCurveTo(0.04, 0.52, -0.16, 0.24, -0.08, 0.04);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.008,
    bevelSegments: 3,
    curveSegments: 24,
  });
  geo.center();
  return geo;
}

export function createAngelBodyGeometry() {
  const pts = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.07, 0.015),
    new THREE.Vector2(0.062, 0.08),
    new THREE.Vector2(0.082, 0.18),
    new THREE.Vector2(0.04, 0.32),
    new THREE.Vector2(0.032, 0.4),
    new THREE.Vector2(0.04, 0.46),
    new THREE.Vector2(0.016, 0.5),
  ];
  const geo = new THREE.LatheGeometry(pts, 48);
  geo.center();
  return geo;
}

export function createStairGeometry(steps = 20, width = 5.1, rise = 0.038, run = 0.12) {
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

export function createDaySkyTexture() {
  const w = 8;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  grd.addColorStop(0, "#4f86c6");
  grd.addColorStop(0.38, "#7eadd8");
  grd.addColorStop(0.72, "#c5def0");
  grd.addColorStop(0.9, "#e7f1f8");
  grd.addColorStop(1, "#f3f6f4");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, h * 0.2, w, 22);
  ctx.globalAlpha = 0.1;
  ctx.fillRect(0, h * 0.32, w, 12);
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export function createMarbleTexture() {
  const s = 512;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#e6e1d8";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 28; i += 1) {
    ctx.strokeStyle = `rgba(108, 108, 116, ${0.1 + (i % 5) * 0.035})`;
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    let x = (i * 47) % s;
    let y = 0;
    ctx.moveTo(x, y);
    for (let k = 0; k < 8; k += 1) {
      x += 40 + ((i * 13 + k * 17) % 50);
      y += s / 8;
      ctx.lineTo(x % s, y);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.2, 2.2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
