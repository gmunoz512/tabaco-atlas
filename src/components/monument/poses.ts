import type { Vector3Tuple } from "three";
import { CORNERS, PARTS, SIDES } from "@/data/parts";

export type MeshKind =
  | "box"
  | "cylinder"
  | "stairs"
  | "column"
  | "gate"
  | "arch"
  | "helix"
  | "balcony"
  | "angel"
  | "pinnacle"
  | "emblem"
  | "rail"
  | "figure"
  | "podium"
  | "attic";

export interface PartPose {
  rest: Vector3Tuple;
  explode: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
  kind: MeshKind;
  size?: Vector3Tuple;
}

const UNIT: Vector3Tuple = [1, 1, 1];
const ZERO: Vector3Tuple = [0, 0, 0];

const SIDE_DIR = {
  north: { x: 0, z: -1, rot: Math.PI },
  east: { x: 1, z: 0, rot: Math.PI / 2 },
  south: { x: 0, z: 1, rot: 0 },
  west: { x: -1, z: 0, rot: -Math.PI / 2 },
} as const;

const CORNER_DIR = {
  ne: { x: 1, z: -1 },
  se: { x: 1, z: 1 },
  sw: { x: -1, z: 1 },
  nw: { x: -1, z: -1 },
} as const;

/** Half-width of the square colonnade / podium. */
export const COL_HW = 2.06;
export const POD_HW = 2.06;
/** Visible column height, matching colonnade walls. */
export const COL_HEIGHT = 2.86;

function pose(
  rest: Vector3Tuple,
  explode: Vector3Tuple,
  kind: MeshKind,
  extra?: Partial<PartPose>,
): PartPose {
  return { rest, explode, rotation: ZERO, scale: UNIT, kind, ...extra };
}

function buildPoses(): Record<string, PartPose> {
  const p: Record<string, PartPose> = {};

  p["plaza-esplanade"] = pose([0, 0.04, 0], [0, -1.7, 0], "box", { size: [9.6, 0.08, 9.6] });
  p["plaza-walk"] = pose([0, 0.005, 0], [0, -2.2, 0], "box", { size: [12.2, 0.05, 12.2] });

  for (const side of SIDES) {
    const d = SIDE_DIR[side.id];
    p[`stairs-${side.id}`] = pose(
      [d.x * 4.95, 0.28, d.z * 4.95],
      [d.x * 9.0, -0.25, d.z * 9.0],
      "stairs",
      { rotation: [0, d.rot, 0] },
    );
    p[`landing-${side.id}`] = pose(
      [d.x * 3.42, 0.58, d.z * 3.42],
      [d.x * 7.0, 0.15, d.z * 7.0],
      "box",
      { size: [2.7, 0.07, 0.78], rotation: [0, d.rot, 0] },
    );
    p[`gate-${side.id}`] = pose(
      [d.x * 2.1, 0.52, d.z * 2.1],
      [d.x * 5.6, 0.45, d.z * 5.6],
      "gate",
      { rotation: [0, d.rot, 0] },
    );
    p[`wall-${side.id}`] = pose(
      [d.x * 1.68, 2.78, d.z * 1.68],
      [d.x * 5.4, 2.6, d.z * 5.4],
      "box",
      { size: [3.55, COL_HEIGHT - 0.12, 0.12], rotation: [0, d.rot, 0] },
    );
    p[`entablature-${side.id}`] = pose(
      [d.x * 2.08, 4.28, d.z * 2.08],
      [d.x * 5.9, 4.5, d.z * 5.9],
      "box",
      { size: [4.22, 0.2, 0.32], rotation: [0, d.rot, 0] },
    );
    p[`rail-${side.id}`] = pose(
      [d.x * 0.38, 11.42, d.z * 0.38],
      [d.x * 2.5, 12.8, d.z * 2.5],
      "rail",
      { rotation: [0, d.rot, 0] },
    );

    const midTs = [0.2, 0.4, 0.6, 0.8];
    midTs.forEach((t, index) => {
      let x = 0;
      let z = 0;
      if (side.id === "south") {
        x = -COL_HW + 2 * COL_HW * t;
        z = COL_HW;
      } else if (side.id === "north") {
        x = COL_HW - 2 * COL_HW * t;
        z = -COL_HW;
      } else if (side.id === "east") {
        x = COL_HW;
        z = COL_HW - 2 * COL_HW * t;
      } else {
        x = -COL_HW;
        z = -COL_HW + 2 * COL_HW * t;
      }
      p[`column-${side.id}-${index + 1}`] = pose(
        [x, 2.78, z],
        [x * 2.55, 2.9, z * 2.55],
        "column",
        { rotation: [0, d.rot, 0] },
      );
    });
  }

  for (const side of SIDES) {
    const d = SIDE_DIR[side.id];
    for (const n of [1, 2, 3] as const) {
      const along = (n - 2) * 0.58;
      const rest: Vector3Tuple =
        d.z !== 0 ? [along, 5.12, d.z * 1.26] : [d.x * 1.26, 5.12, along];
      p[`arch-${side.id}-${n}`] = pose(rest, [d.x * 4.1, 5.4, d.z * 4.1], "arch", {
        rotation: [0, d.rot, 0],
      });
    }
    p[`emblem-${side.id}`] = pose(
      [d.x * 1.28, 5.68, d.z * 1.28],
      [d.x * 3.9, 6.0, d.z * 3.9],
      "emblem",
      { rotation: [0, d.rot, 0] },
    );
  }

  for (const corner of CORNERS) {
    const c = CORNER_DIR[corner.id];
    p[`podium-corner-${corner.id}`] = pose(
      [c.x * POD_HW, 0.67, c.z * POD_HW],
      [c.x * 4.5, 0.4, c.z * 4.5],
      "box",
      { size: [0.36, 1.22, 0.36] },
    );
    p[`column-corner-${corner.id}`] = pose(
      [c.x * COL_HW, 2.78, c.z * COL_HW],
      [c.x * 5.3, 2.9, c.z * 5.3],
      "column",
    );
    p[`pinnacle-${corner.id}`] = pose(
      [c.x * 1.96, 4.58, c.z * 1.96],
      [c.x * 4.7, 5.1, c.z * 4.7],
      "pinnacle",
    );
  }

  p["podium-plinth"] = pose([0, 0.67, 0], [0, -0.9, 0], "podium", { size: [4.12, 1.22, 4.12] });
  p["podium-cornice"] = pose([0, 1.3, 0], [0, 0.15, 0], "box", { size: [4.28, 0.1, 4.28] });
  p["colonnade-terrace"] = pose([0, 4.42, 0], [0, 5.0, 0], "box", { size: [4.28, 0.1, 4.28] });
  p["attic-body"] = pose([0, 5.22, 0], [0, 5.85, 0], "attic", { size: [2.52, 1.32, 2.52] });

  p["shaft-lower"] = pose([0, 6.78, 0], [0, 7.4, 0], "cylinder", { size: [0.255, 1.7, 0.255] });
  p["shaft-mid"] = pose([0, 8.48, 0], [0.14, 9.4, 0], "cylinder", { size: [0.248, 1.7, 0.242] });
  p["shaft-upper"] = pose([0, 10.18, 0], [-0.1, 11.3, 0], "cylinder", { size: [0.242, 1.7, 0.236] });
  p["shaft-spiral"] = pose([0, 8.48, 0], [2.3, 8.5, 1.5], "helix", { size: [0.27, 5.1, 0.015] });
  p["shaft-capital"] = pose([0, 11.1, 0], [0, 12.5, 0], "cylinder", { size: [0.34, 0.13, 0.34] });
  p["elevator-shaft"] = pose([0, 8.0, 0], [3.0, 8.0, 2.1], "box", { size: [0.15, 4.6, 0.15] });

  p["observation-deck"] = pose([0, 11.3, 0], [0, 13.1, 0], "balcony");
  p["crown-cap"] = pose([0, 11.62, 0], [0, 13.7, 0], "cylinder", { size: [0.22, 0.24, 0.2] });
  p["angel-peace"] = pose([0, 12.1, 0], [0, 14.8, 0], "angel", { scale: [1.78, 1.78, 1.78] });

  return p;
}

export const PART_POSES: Record<string, PartPose> = buildPoses();

const missing = PARTS.filter((part) => !PART_POSES[part.id]).map((part) => part.id);
if (missing.length > 0) {
  throw new Error(`Missing monument poses: ${missing.join(", ")}`);
}
