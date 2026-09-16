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

export function createHelixCurve(radius: number, height: number, turns: number, points = 260) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const a = t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, t * height - height / 2, Math.sin(a) * radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export function createHelixGeometry(radius: number, height: number, turns: number, tube = 0.018) {
  return new THREE.TubeGeometry(createHelixCurve(radius, height, turns), 320, tube, 8, false);
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
  shape.bezierCurveTo(0.12, 0.16, 0.28, 0.42, 0.1, 0.78);
  shape.bezierCurveTo(0.02, 0.7, -0.2, 0.36, -0.12, 0.06);
  shape.lineTo(0, 0);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.012,
    bevelSegments: 2,
    curveSegments: 16,
  });
}

function hash2(ix: number, iy: number) {
  let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function valueNoise(x: number, y: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const n00 = hash2(x0, y0);
  const n10 = hash2(x0 + 1, y0);
  const n01 = hash2(x0, y0 + 1);
  const n11 = hash2(x0 + 1, y0 + 1);
  return n00 * (1 - sx) * (1 - sy) + n10 * sx * (1 - sy) + n01 * (1 - sx) * sy + n11 * sx * sy;
}

function fbm(x: number, y: number, octaves = 5) {
  let v = 0;
  let a = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i += 1) {
    v += a * valueNoise(x * f, y * f);
    a *= 0.5;
    f *= 2.05;
  }
  return v;
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function mix3(a: [number, number, number], b: [number, number, number], t: number) {
  const k = Math.min(1, Math.max(0, t));
  return lerpColor(a, b, k);
}

/** Equirectangular dusk sky: storm left, peach horizon, layered clouds. */
export function createDuskSkyTexture() {
  const w = 1536;
  const h = 768;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(w, h);
  const data = img.data;

  const zenith: [number, number, number] = [28, 42, 72];
  const high: [number, number, number] = [72, 96, 132];
  const mid: [number, number, number] = [186, 168, 168];
  const peach: [number, number, number] = [255, 176, 110];
  const gold: [number, number, number] = [255, 140, 68];
  const nadir: [number, number, number] = [92, 70, 52];

  for (let y = 0; y < h; y += 1) {
    const v = y / (h - 1);
    const elev = 1 - v;
    for (let x = 0; x < w; x += 1) {
      const u = x / (w - 1);
      const sunset = Math.min(1, Math.max(0, (u - 0.42) / 0.5));
      let col: [number, number, number];
      if (elev > 0.62) col = mix3(high, zenith, (elev - 0.62) / 0.38);
      else if (elev > 0.38) col = mix3(mid, high, (elev - 0.38) / 0.24);
      else if (elev > 0.18) col = mix3(peach, mid, (elev - 0.18) / 0.2);
      else col = mix3(nadir, gold, elev / 0.18);

      col = mix3(col, mix3(col, peach, 0.55), sunset * Math.max(0, 1.05 - elev * 1.4));

      const n1 = fbm(u * 5.2 + 1.4, elev * 8.1, 5);
      const n2 = fbm(u * 2.6 - 3.2, elev * 4.2 + 6, 4);
      const n3 = fbm(u * 12 + 7, elev * 14, 3);
      const upper = Math.min(1, Math.max(0, (elev - 0.16) / 0.7));
      let cloud = Math.min(1, Math.max(0, (n1 * 0.7 + n2 * 0.3 - 0.34) / 0.36));
      cloud *= 0.4 + upper * 0.75;
      const stormBand = Math.min(1, Math.max(0, 1 - Math.abs(u - 0.68) * 2.4));
      const duskCloud: [number, number, number] = n3 > 0.5 ? [255, 210, 170] : [255, 152, 88];
      const stormCloud: [number, number, number] = n3 > 0.45 ? [62, 74, 96] : [22, 28, 44];
      const cloudCol = mix3(duskCloud, stormCloud, Math.max(stormBand, 1 - sunset) * 0.9);
      col = mix3(col, cloudCol, cloud * 0.88);

      const sunU = 0.8;
      const sunV = 0.58;
      const sunD = Math.hypot((u - sunU) * 1.6, (v - sunV) * 2.2);
      const glow = Math.min(1, Math.max(0, 1 - sunD * 2.2));
      col = mix3(col, [255, 186, 110], glow * 0.62);

      const i = (y * w + x) * 4;
      data[i] = col[0];
      data[i + 1] = col[1];
      data[i + 2] = col[2];
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const blob = (x: number, y: number, rw: number, rh: number, color: string) => {
    const grd = ctx.createRadialGradient(x, y, 6, x, y, Math.max(rw, rh));
    grd.addColorStop(0, color);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  for (let i = 0; i < 22; i += 1) {
    blob(620 + i * 36, 70 + (i % 6) * 30, 170, 50, "rgba(18,24,40,0.62)");
  }
  for (let i = 0; i < 16; i += 1) {
    blob(20 + i * 48, 210 + (i % 4) * 28, 150, 40, "rgba(255,176,110,0.4)");
  }
  for (let i = 0; i < 12; i += 1) {
    blob(400 + i * 70, 40 + (i % 3) * 18, 130, 32, "rgba(236,240,248,0.28)");
  }
  blob(1080, 160, 300, 110, "rgba(16,22,38,0.5)");
  blob(200, 380, 280, 90, "rgba(255,148,72,0.4)");

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createCloudSpriteTexture(kind: "storm" | "sunset" | "soft") {
  const s = 512;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(s, s);
  const data = img.data;
  const tint: [number, number, number] =
    kind === "storm" ? [42, 50, 68] : kind === "sunset" ? [255, 176, 128] : [236, 228, 220];
  for (let y = 0; y < s; y += 1) {
    for (let x = 0; x < s; x += 1) {
      const u = (x / (s - 1) - 0.5) * 2;
      const v = (y / (s - 1) - 0.5) * 2;
      const lobe =
        Math.exp(-((u + 0.15) ** 2) / 0.55 - (v + 0.05) ** 2 / 0.22) +
        Math.exp(-((u - 0.35) ** 2) / 0.32 - (v - 0.08) ** 2 / 0.16) * 0.85 +
        Math.exp(-((u + 0.45) ** 2) / 0.28 - (v - 0.12) ** 2 / 0.14) * 0.7 +
        Math.exp(-(u ** 2) / 0.9 - (v + 0.18) ** 2 / 0.28) * 0.6;
      const n = fbm(x * 0.02, y * 0.025 + (kind === "storm" ? 4 : 1), 4);
      const a = Math.min(1, Math.max(0, lobe * (0.55 + n * 0.7) - 0.12));
      const i = (y * s + x) * 4;
      data[i] = tint[0];
      data[i + 1] = tint[1];
      data[i + 2] = tint[2];
      data[i + 3] = Math.floor(a * (kind === "storm" ? 210 : 190));
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createGrassTexture() {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#6f9248";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 9000; i += 1) {
    const g = 70 + Math.random() * 90;
    ctx.fillStyle = `rgba(${40 + Math.random() * 40},${g},${30 + Math.random() * 30},${0.18 + Math.random() * 0.35})`;
    ctx.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 2, 2 + Math.random() * 4);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 18);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createAsphaltTexture() {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#3a3938";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 12000; i += 1) {
    const n = 40 + Math.random() * 50;
    ctx.fillStyle = `rgba(${n},${n - 2},${n - 4},${0.12 + Math.random() * 0.28})`;
    ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createFacadeTexture() {
  const s = 64;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "#1c1820";
  for (let y = 6; y < 58; y += 14) {
    for (let x = 7; x < 58; x += 13) {
      ctx.fillRect(x, y, 5, 7);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

let stoneMaps: { albedo: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null = null;

function noiseCanvas(size: number, contrast: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.fillStyle = "#e8e1d4";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 18000; i += 1) {
    const n = 150 + Math.random() * 90;
    const a = (0.03 + Math.random() * 0.14) * contrast;
    ctx.fillStyle = `rgba(${n},${n - 5},${n - 12},${a})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2.2, 1 + Math.random() * 2.2);
  }
  return canvas;
}

export function getStoneMaps() {
  if (stoneMaps) return stoneMaps;
  if (typeof document === "undefined") return null;
  const albedo = new THREE.CanvasTexture(noiseCanvas(256, 1));
  albedo.wrapS = albedo.wrapT = THREE.RepeatWrapping;
  albedo.repeat.set(2.4, 2.4);
  albedo.anisotropy = 8;
  albedo.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(noiseCanvas(256, 1.8));
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(2.4, 2.4);
  bump.colorSpace = THREE.NoColorSpace;
  stoneMaps = { albedo, bump };
  return stoneMaps;
}
