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
export const COL_HW = 2.08;
export const POD_HW = 2.08;
/** Visible column height, matching colonnade walls. */
export const COL_HEIGHT = 3.38;

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

  p["plaza-esplanade"] = pose([0, 0.05, 0], [0, -1.7, 0], "box", { size: [10.2, 0.1, 10.2] });
  p["plaza-walk"] = pose([0, 0.01, 0], [0, -2.2, 0], "box", { size: [12.8, 0.05, 12.8] });

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
      [d.x * 2.12, 0.5, d.z * 2.12],
      [d.x * 5.6, 0.45, d.z * 5.6],
      "gate",
      { rotation: [0, d.rot, 0] },
    );
    p[`wall-${side.id}`] = pose(
      [d.x * 1.42, 2.96, d.z * 1.42],
      [d.x * 5.4, 2.8, d.z * 5.4],
      "box",
      { size: [3.35, COL_HEIGHT - 0.18, 0.12], rotation: [0, d.rot, 0] },
    );
    p[`entablature-${side.id}`] = pose(
      [d.x * 2.1, 4.72, d.z * 2.1],
      [d.x * 5.9, 4.95, d.z * 5.9],
      "box",
      { size: [4.22, 0.18, 0.34], rotation: [0, d.rot, 0] },
    );
    p[`rail-${side.id}`] = pose(
      [d.x * 0.3, 14.02, d.z * 0.3],
      [d.x * 2.5, 15.4, d.z * 2.5],
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
        [x, 2.96, z],
        [x * 2.55, 3.1, z * 2.55],
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
        d.z !== 0 ? [along, 5.48, d.z * 1.18] : [d.x * 1.18, 5.48, along];
      p[`arch-${side.id}-${n}`] = pose(rest, [d.x * 4.1, 5.4, d.z * 4.1], "arch", {
        rotation: [0, d.rot, 0],
      });
    }
    p[`emblem-${side.id}`] = pose(
      [d.x * 1.2, 5.98, d.z * 1.2],
      [d.x * 3.9, 6.4, d.z * 3.9],
      "emblem",
      { rotation: [0, d.rot, 0] },
    );
  }

  for (const corner of CORNERS) {
    const c = CORNER_DIR[corner.id];
    p[`podium-corner-${corner.id}`] = pose(
      [c.x * POD_HW, 0.62, c.z * POD_HW],
      [c.x * 4.5, 0.4, c.z * 4.5],
      "box",
      { size: [0.34, 1.12, 0.34] },
    );
    p[`column-corner-${corner.id}`] = pose(
      [c.x * COL_HW, 2.96, c.z * COL_HW],
      [c.x * 5.3, 3.1, c.z * 5.3],
      "column",
    );
    p[`pinnacle-${corner.id}`] = pose(
      [c.x * 1.98, 5.02, c.z * 1.98],
      [c.x * 4.7, 5.5, c.z * 4.7],
      "pinnacle",
    );
  }

  p["podium-plinth"] = pose([0, 0.62, 0], [0, -0.9, 0], "podium", { size: [4.16, 1.12, 4.16] });
  p["podium-cornice"] = pose([0, 1.22, 0], [0, 0.15, 0], "box", { size: [4.32, 0.1, 4.32] });
  p["colonnade-terrace"] = pose([0, 4.86, 0], [0, 5.45, 0], "box", { size: [4.32, 0.1, 4.32] });
  p["attic-body"] = pose([0, 5.58, 0], [0, 6.2, 0], "attic", { size: [2.36, 1.16, 2.36] });

  p["shaft-lower"] = pose([0, 7.38, 0], [0, 8.1, 0], "cylinder", { size: [0.198, 2.4, 0.198] });
  p["shaft-mid"] = pose([0, 9.78, 0], [0.12, 10.6, 0], "cylinder", { size: [0.192, 2.4, 0.186] });
  p["shaft-upper"] = pose([0, 12.18, 0], [-0.1, 13.2, 0], "cylinder", { size: [0.186, 2.4, 0.18] });
  p["shaft-spiral"] = pose([0, 9.78, 0], [2.3, 9.9, 1.5], "helix", { size: [0.21, 7.2, 0.013] });
  p["shaft-capital"] = pose([0, 13.46, 0], [0, 14.9, 0], "cylinder", { size: [0.27, 0.14, 0.27] });
  p["elevator-shaft"] = pose([0, 9.4, 0], [3.0, 9.4, 2.1], "box", { size: [0.12, 6.2, 0.12] });

  p["observation-deck"] = pose([0, 13.7, 0], [0, 15.6, 0], "balcony");
  p["crown-cap"] = pose([0, 14.02, 0], [0, 16.2, 0], "cylinder", { size: [0.17, 0.24, 0.15] });
  p["angel-peace"] = pose([0, 14.52, 0], [0, 17.1, 0], "angel", { scale: [2.35, 2.35, 2.35] });

  return p;
}

export const PART_POSES: Record<string, PartPose> = buildPoses();

const missing = PARTS.filter((part) => !PART_POSES[part.id]).map((part) => part.id);
if (missing.length > 0) {
  throw new Error(`Missing monument poses: ${missing.join(", ")}`);
}
