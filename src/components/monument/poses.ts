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
export const COL_HW = 2.0;
export const POD_HW = 2.0;
/** Visible column height, matching colonnade walls. */
export const COL_HEIGHT = 3.05;

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
      [d.x * 2.04, 0.52, d.z * 2.04],
      [d.x * 5.6, 0.45, d.z * 5.6],
      "gate",
      { rotation: [0, d.rot, 0] },
    );
    p[`wall-${side.id}`] = pose(
      [d.x * 1.58, 2.88, d.z * 1.58],
      [d.x * 5.4, 2.7, d.z * 5.4],
      "box",
      { size: [3.42, COL_HEIGHT - 0.16, 0.1], rotation: [0, d.rot, 0] },
    );
    p[`entablature-${side.id}`] = pose(
      [d.x * 2.02, 4.48, d.z * 2.02],
      [d.x * 5.9, 4.7, d.z * 5.9],
      "box",
      { size: [4.08, 0.18, 0.28], rotation: [0, d.rot, 0] },
    );
    p[`rail-${side.id}`] = pose(
      [d.x * 0.32, 12.42, d.z * 0.32],
      [d.x * 2.5, 13.8, d.z * 2.5],
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
        [x, 2.88, z],
        [x * 2.55, 3.0, z * 2.55],
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
        d.z !== 0 ? [along, 5.22, d.z * 1.2] : [d.x * 1.2, 5.22, along];
      p[`arch-${side.id}-${n}`] = pose(rest, [d.x * 4.1, 5.4, d.z * 4.1], "arch", {
        rotation: [0, d.rot, 0],
      });
    }
    p[`emblem-${side.id}`] = pose(
      [d.x * 1.22, 5.72, d.z * 1.22],
      [d.x * 3.9, 6.1, d.z * 3.9],
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
      [c.x * COL_HW, 2.88, c.z * COL_HW],
      [c.x * 5.3, 3.0, c.z * 5.3],
      "column",
    );
    p[`pinnacle-${corner.id}`] = pose(
      [c.x * 1.9, 4.78, c.z * 1.9],
      [c.x * 4.7, 5.3, c.z * 4.7],
      "pinnacle",
    );
  }

  p["podium-plinth"] = pose([0, 0.67, 0], [0, -0.9, 0], "podium", { size: [4.0, 1.22, 4.0] });
  p["podium-cornice"] = pose([0, 1.3, 0], [0, 0.15, 0], "box", { size: [4.16, 0.09, 4.16] });
  p["colonnade-terrace"] = pose([0, 4.62, 0], [0, 5.2, 0], "box", { size: [4.16, 0.09, 4.16] });
  p["attic-body"] = pose([0, 5.32, 0], [0, 5.95, 0], "attic", { size: [2.4, 1.18, 2.4] });

  p["shaft-lower"] = pose([0, 6.94, 0], [0, 7.6, 0], "cylinder", { size: [0.205, 2.05, 0.205] });
  p["shaft-mid"] = pose([0, 8.99, 0], [0.12, 9.8, 0], "cylinder", { size: [0.198, 2.05, 0.192] });
  p["shaft-upper"] = pose([0, 11.04, 0], [-0.1, 12.1, 0], "cylinder", { size: [0.192, 2.05, 0.186] });
  p["shaft-spiral"] = pose([0, 8.99, 0], [2.3, 9.1, 1.5], "helix", { size: [0.218, 6.15, 0.012] });
  p["shaft-capital"] = pose([0, 12.14, 0], [0, 13.5, 0], "cylinder", { size: [0.28, 0.12, 0.28] });
  p["elevator-shaft"] = pose([0, 8.7, 0], [3.0, 8.7, 2.1], "box", { size: [0.12, 5.4, 0.12] });

  p["observation-deck"] = pose([0, 12.34, 0], [0, 14.2, 0], "balcony");
  p["crown-cap"] = pose([0, 12.64, 0], [0, 14.8, 0], "cylinder", { size: [0.18, 0.22, 0.16] });
  p["angel-peace"] = pose([0, 13.05, 0], [0, 15.6, 0], "angel", { scale: [1.5, 1.5, 1.5] });

  return p;
}

export const PART_POSES: Record<string, PartPose> = buildPoses();

const missing = PARTS.filter((part) => !PART_POSES[part.id]).map((part) => part.id);
if (missing.length > 0) {
  throw new Error(`Missing monument poses: ${missing.join(", ")}`);
}
