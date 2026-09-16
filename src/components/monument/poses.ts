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
  | "attic"
  | "wall";

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
export const COL_HW = 2.18;
export const POD_HW = 2.18;
/** Visible column height, matching colonnade walls. */
export const COL_HEIGHT = 3.62;
export const COL_Y = 3.28;
export const ATTIC_W = 3.74;
export const ATTIC_Y = 5.92;
export const SHAFT = {
  r0: 0.4,
  r1: 0.385,
  r2: 0.37,
  seg: 2.88,
  helixR: 0.428,
  helixH: 8.64,
};

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

  p["plaza-esplanade"] = pose([0, 0.06, 0], [0, -1.7, 0], "box", { size: [9.4, 0.12, 9.4] });
  p["plaza-walk"] = pose([0, 0.015, 0], [0, -2.2, 0], "box", { size: [11.6, 0.05, 11.6] });

  for (const side of SIDES) {
    const d = SIDE_DIR[side.id];
    p[`stairs-${side.id}`] = pose(
      [d.x * 4.7, 0.32, d.z * 4.7],
      [d.x * 9.0, -0.25, d.z * 9.0],
      "stairs",
      { rotation: [0, d.rot, 0] },
    );
    p[`landing-${side.id}`] = pose(
      [d.x * 3.38, 0.64, d.z * 3.38],
      [d.x * 7.0, 0.15, d.z * 7.0],
      "box",
      { size: [3.2, 0.08, 0.85], rotation: [0, d.rot, 0] },
    );
    p[`gate-${side.id}`] = pose(
      [d.x * 2.22, 0.58, d.z * 2.22],
      [d.x * 5.6, 0.45, d.z * 5.6],
      "gate",
      { rotation: [0, d.rot, 0] },
    );
    p[`wall-${side.id}`] = pose(
      [d.x * 1.38, COL_Y, d.z * 1.38],
      [d.x * 5.4, 2.8, d.z * 5.4],
      "wall",
      { size: [3.52, COL_HEIGHT - 0.16, 0.14], rotation: [0, d.rot, 0] },
    );
    p[`entablature-${side.id}`] = pose(
      [d.x * 2.2, 5.14, d.z * 2.2],
      [d.x * 5.9, 5.2, d.z * 5.9],
      "box",
      { size: [4.44, 0.2, 0.38], rotation: [0, d.rot, 0] },
    );
    p[`rail-${side.id}`] = pose(
      [d.x * 0.38, 16.18, d.z * 0.38],
      [d.x * 2.5, 17.6, d.z * 2.5],
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
        [x, COL_Y, z],
        [x * 2.55, 3.4, z * 2.55],
        "column",
        { rotation: [0, d.rot, 0] },
      );
    });
  }

  for (const side of SIDES) {
    const d = SIDE_DIR[side.id];
    for (const n of [1, 2, 3] as const) {
      const along = (n - 2) * 1.08;
      const rest: Vector3Tuple =
        d.z !== 0 ? [along, ATTIC_Y, d.z * (ATTIC_W / 2 + 0.02)] : [d.x * (ATTIC_W / 2 + 0.02), ATTIC_Y, along];
      p[`arch-${side.id}-${n}`] = pose(rest, [d.x * 4.1, 5.8, d.z * 4.1], "arch", {
        rotation: [0, d.rot, 0],
      });
    }
    p[`emblem-${side.id}`] = pose(
      [d.x * (ATTIC_W / 2 + 0.04), ATTIC_Y + 0.48, d.z * (ATTIC_W / 2 + 0.04)],
      [d.x * 3.9, 6.8, d.z * 3.9],
      "emblem",
      { rotation: [0, d.rot, 0] },
    );
  }

  for (const corner of CORNERS) {
    const c = CORNER_DIR[corner.id];
    p[`podium-corner-${corner.id}`] = pose(
      [c.x * POD_HW, 0.72, c.z * POD_HW],
      [c.x * 4.5, 0.4, c.z * 4.5],
      "box",
      { size: [0.38, 1.32, 0.38] },
    );
    p[`column-corner-${corner.id}`] = pose(
      [c.x * COL_HW, COL_Y, c.z * COL_HW],
      [c.x * 5.3, 3.4, c.z * 5.3],
      "column",
    );
    p[`pinnacle-${corner.id}`] = pose(
      [c.x * 2.08, 5.42, c.z * 2.08],
      [c.x * 4.7, 5.9, c.z * 4.7],
      "pinnacle",
    );
  }

  p["podium-plinth"] = pose([0, 0.72, 0], [0, -0.9, 0], "podium", { size: [4.36, 1.32, 4.36] });
  p["podium-cornice"] = pose([0, 1.4, 0], [0, 0.15, 0], "box", { size: [4.52, 0.1, 4.52] });
  p["colonnade-terrace"] = pose([0, 5.28, 0], [0, 5.85, 0], "box", { size: [4.52, 0.12, 4.52] });
  p["attic-body"] = pose([0, ATTIC_Y, 0], [0, 6.6, 0], "attic", { size: [ATTIC_W, 1.2, ATTIC_W] });

  const shaft0 = 7.0 + SHAFT.seg / 2;
  p["shaft-lower"] = pose([0, shaft0, 0], [0, 8.5, 0], "cylinder", { size: [SHAFT.r0, SHAFT.seg, SHAFT.r0] });
  p["shaft-mid"] = pose([0, shaft0 + SHAFT.seg, 0], [0.12, 11.4, 0], "cylinder", {
    size: [SHAFT.r1, SHAFT.seg, SHAFT.r0 * 0.98],
  });
  p["shaft-upper"] = pose([0, shaft0 + SHAFT.seg * 2, 0], [-0.1, 14.2, 0], "cylinder", {
    size: [SHAFT.r2, SHAFT.seg, SHAFT.r1],
  });
  p["shaft-spiral"] = pose([0, shaft0 + SHAFT.seg, 0], [2.3, 11.0, 1.5], "helix", {
    size: [SHAFT.helixR, SHAFT.helixH, 0.016],
  });
  p["shaft-capital"] = pose([0, 15.52, 0], [0, 17.0, 0], "cylinder", { size: [0.5, 0.16, 0.5] });
  p["elevator-shaft"] = pose([0, 10.6, 0], [3.0, 10.6, 2.1], "box", { size: [0.16, 7.2, 0.16] });

  p["observation-deck"] = pose([0, 15.82, 0], [0, 17.7, 0], "balcony");
  p["crown-cap"] = pose([0, 16.18, 0], [0, 18.3, 0], "cylinder", { size: [0.28, 0.32, 0.24] });
  p["angel-peace"] = pose([0, 16.62, 0], [0, 19.4, 0], "angel", { scale: [2.85, 2.85, 2.85] });

  return p;
}

export const PART_POSES: Record<string, PartPose> = buildPoses();

const missing = PARTS.filter((part) => !PART_POSES[part.id]).map((part) => part.id);
if (missing.length > 0) {
  throw new Error(`Missing monument poses: ${missing.join(", ")}`);
}
