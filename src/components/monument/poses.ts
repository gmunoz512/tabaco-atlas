import type { Vector3Tuple } from "three";
import { PARTS } from "@/data/parts";

export type MeshKind = "box" | "stairs" | "column" | "figure" | "lantern" | "flagpole" | "window";

export interface PartPose {
  rest: Vector3Tuple;
  explode: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
  kind: MeshKind;
  size?: Vector3Tuple;
}

const SIDES = [
  { id: "north", x: 0, z: -1, rot: Math.PI },
  { id: "east", x: 1, z: 0, rot: Math.PI / 2 },
  { id: "south", x: 0, z: 1, rot: 0 },
  { id: "west", x: -1, z: 0, rot: -Math.PI / 2 },
] as const;

const CORNERS = [
  { id: "ne", x: 1, z: -1 },
  { id: "se", x: 1, z: 1 },
  { id: "sw", x: -1, z: 1 },
  { id: "nw", x: -1, z: -1 },
] as const;

const UNIT: Vector3Tuple = [1, 1, 1];
const ZERO: Vector3Tuple = [0, 0, 0];

function pose(
  rest: Vector3Tuple,
  explode: Vector3Tuple,
  kind: MeshKind,
  extra?: Partial<PartPose>,
): PartPose {
  return {
    rest,
    explode,
    rotation: ZERO,
    scale: UNIT,
    kind,
    ...extra,
  };
}

function buildPoses(): Record<string, PartPose> {
  const p: Record<string, PartPose> = {};

  p["plaza-esplanade"] = pose([0, 0.07, 0], [0, -1.85, 0], "box", { size: [7.6, 0.14, 7.6] });
  p["plaza-walk"] = pose([0, 0.02, 0], [0, -2.35, 0], "box", { size: [9.6, 0.08, 9.6] });

  for (const side of SIDES) {
    p[`stairs-${side.id}`] = pose(
      [side.x * 4.35, 0.28, side.z * 4.35],
      [side.x * 8.4, -0.4, side.z * 8.4],
      "stairs",
      { rotation: [0, side.rot, 0] },
    );
    p[`landing-${side.id}`] = pose(
      [side.x * 2.95, 0.58, side.z * 2.95],
      [side.x * 6.6, 0.2, side.z * 6.6],
      "box",
      { size: [2.15, 0.1, 0.7], rotation: [0, side.rot, 0] },
    );
    p[`pedestal-face-${side.id}`] = pose(
      [side.x * 1.72, 0.98, side.z * 1.72],
      [side.x * 5.4, 0.7, side.z * 5.4],
      "box",
      { size: [2.35, 0.72, 0.16], rotation: [0, side.rot, 0] },
    );
    p[`entablature-${side.id}`] = pose(
      [side.x * 1.88, 2.22, side.z * 1.88],
      [side.x * 5.8, 2.5, side.z * 5.8],
      "box",
      { size: [2.55, 0.22, 0.42], rotation: [0, side.rot, 0] },
    );
    p[`window-mid-${side.id}`] = pose(
      [side.x * 0.62, 4.95, side.z * 0.62],
      [side.x * 4.2, 5.1, side.z * 4.2],
      "window",
      { size: [0.32, 0.48, 0.1], rotation: [0, side.rot, 0] },
    );
    p[`window-high-${side.id}`] = pose(
      [side.x * 0.56, 6.45, side.z * 0.56],
      [side.x * 4.0, 6.9, side.z * 4.0],
      "window",
      { size: [0.28, 0.42, 0.1], rotation: [0, side.rot, 0] },
    );
    p[`rail-${side.id}`] = pose(
      [side.x * 0.74, 8.28, side.z * 0.74],
      [side.x * 3.2, 9.4, side.z * 3.2],
      "box",
      { size: [1.42, 0.2, 0.07], rotation: [0, side.rot, 0] },
    );
  }

  for (const corner of CORNERS) {
    p[`pedestal-corner-${corner.id}`] = pose(
      [corner.x * 1.58, 1.02, corner.z * 1.58],
      [corner.x * 4.8, 0.55, corner.z * 4.8],
      "box",
      { size: [0.4, 1.08, 0.4] },
    );
  }

  p["pedestal-plinth"] = pose([0, 0.62, 0], [0, -0.85, 0], "box", { size: [3.45, 0.55, 3.45] });
  p["pedestal-cornice"] = pose([0, 1.42, 0], [0, 0.15, 0], "box", { size: [3.7, 0.16, 3.7] });

  const colR = 1.9;
  const colY = 1.78;
  for (let i = 0; i < 16; i += 1) {
    const a = -Math.PI / 2 + (i / 16) * Math.PI * 2;
    const x = Math.cos(a) * colR;
    const z = Math.sin(a) * colR;
    const pad = String(i + 1).padStart(2, "0");
    p[`column-${pad}`] = pose(
      [x, colY, z],
      [Math.cos(a) * (colR + 4.1), colY + 0.55, Math.sin(a) * (colR + 4.1)],
      "column",
    );
  }

  p["shaft-drum"] = pose([0, 2.52, 0], [0, 2.9, 0], "box", { size: [2.55, 0.42, 2.55] });
  p["shaft-lower"] = pose([0, 3.48, 0], [-0.15, 4.35, 0], "box", { size: [1.32, 1.52, 1.32] });
  p["shaft-mid"] = pose([0, 4.98, 0], [0.2, 6.2, 0], "box", { size: [1.2, 1.5, 1.2] });
  p["shaft-upper"] = pose([0, 6.48, 0], [-0.12, 8.05, 0], "box", { size: [1.08, 1.5, 1.08] });
  p["shaft-neck"] = pose([0, 7.55, 0], [0.1, 9.35, 0], "box", { size: [0.98, 0.68, 0.98] });
  p["elevator-shaft"] = pose([0, 4.85, 0], [2.8, 4.85, 2.4], "box", { size: [0.24, 5.35, 0.24] });

  p["observation-deck"] = pose([0, 8.02, 0], [0, 10.2, 0], "box", { size: [1.62, 0.12, 1.62] });
  p["crown-lantern"] = pose([0, 8.58, 0], [0, 11.1, 0], "lantern");
  p["flagpole"] = pose([0, 9.45, 0], [0, 12.4, 0], "flagpole");

  const figures: Array<{ id: string; a: number }> = [
    { id: "figure-luperon", a: -Math.PI / 2 },
    { id: "figure-rodriguez", a: -Math.PI / 4 },
    { id: "figure-polanco", a: 0 },
    { id: "figure-salcedo", a: Math.PI / 4 },
    { id: "figure-moncion", a: Math.PI / 2 },
    { id: "figure-pimentel", a: (3 * Math.PI) / 4 },
    { id: "figure-victory", a: Math.PI },
    { id: "figure-pueblo", a: (-3 * Math.PI) / 4 },
  ];
  const figR = 3.22;
  for (const figure of figures) {
    const x = Math.cos(figure.a) * figR;
    const z = Math.sin(figure.a) * figR;
    p[figure.id] = pose(
      [x, 0.52, z],
      [Math.cos(figure.a) * 7.2, 0.35, Math.sin(figure.a) * 7.2],
      "figure",
      { rotation: [0, -figure.a + Math.PI, 0] },
    );
  }

  return p;
}

export const PART_POSES: Record<string, PartPose> = buildPoses();

const missing = PARTS.filter((part) => !PART_POSES[part.id]).map((part) => part.id);
if (missing.length > 0) {
  throw new Error(`Missing monument poses: ${missing.join(", ")}`);
}
