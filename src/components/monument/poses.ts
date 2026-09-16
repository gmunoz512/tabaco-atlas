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
  | "figure";

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

const COL_HW = 2.18;
const POD_HW = 2.18;

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

  p["plaza-esplanade"] = pose([0, 0.05, 0], [0, -1.7, 0], "box", { size: [10.4, 0.1, 10.4] });
  p["plaza-walk"] = pose([0, 0.01, 0], [0, -2.2, 0], "box", { size: [12.6, 0.06, 12.6] });

  for (const side of SIDES) {
    const d = SIDE_DIR[side.id];
    p[`stairs-${side.id}`] = pose(
      [d.x * 5.15, 0.32, d.z * 5.15],
      [d.x * 9.2, -0.25, d.z * 9.2],
      "stairs",
      { rotation: [0, d.rot, 0] },
    );
    p[`landing-${side.id}`] = pose(
      [d.x * 3.55, 0.64, d.z * 3.55],
      [d.x * 7.1, 0.15, d.z * 7.1],
      "box",
      { size: [2.4, 0.08, 0.85], rotation: [0, d.rot, 0] },
    );
    p[`gate-${side.id}`] = pose(
      [d.x * 2.22, 0.62, d.z * 2.22],
      [d.x * 5.8, 0.5, d.z * 5.8],
      "gate",
      { rotation: [0, d.rot, 0] },
    );
    p[`wall-${side.id}`] = pose(
      [d.x * 2.02, 2.5, d.z * 2.02],
      [d.x * 5.5, 2.4, d.z * 5.5],
      "box",
      { size: [3.95, 2.12, 0.18], rotation: [0, d.rot, 0] },
    );
    p[`entablature-${side.id}`] = pose(
      [d.x * 2.2, 3.64, d.z * 2.2],
      [d.x * 6.0, 3.9, d.z * 6.0],
      "box",
      { size: [4.4, 0.22, 0.38], rotation: [0, d.rot, 0] },
    );
    p[`rail-${side.id}`] = pose(
      [d.x * 0.62, 10.12, d.z * 0.62],
      [d.x * 2.6, 11.6, d.z * 2.6],
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
        [x, 2.52, z],
        [x * 2.55, 2.7, z * 2.55],
        "column",
        { rotation: [0, d.rot, 0] },
      );
    });
  }

  // Fix attic arch positions more carefully
  for (const side of SIDES) {
    const d = SIDE_DIR[side.id];
    for (const n of [1, 2, 3] as const) {
      const along = (n - 2) * 0.62;
      const rest: Vector3Tuple =
        d.z !== 0
          ? [along, 4.42, d.z * 1.3]
          : [d.x * 1.3, 4.42, along];
      p[`arch-${side.id}-${n}`] = pose(rest, [d.x * 4.2, 4.7, d.z * 4.2], "arch", {
        rotation: [0, d.rot, 0],
      });
    }
    p[`emblem-${side.id}`] = pose(
      [d.x * 1.32, 5.02, d.z * 1.32],
      [d.x * 4.0, 5.4, d.z * 4.0],
      "emblem",
      { rotation: [0, d.rot, 0] },
    );
  }

  for (const corner of CORNERS) {
    const c = CORNER_DIR[corner.id];
    p[`podium-corner-${corner.id}`] = pose(
      [c.x * POD_HW, 0.76, c.z * POD_HW],
      [c.x * 4.6, 0.5, c.z * 4.6],
      "box",
      { size: [0.42, 1.28, 0.42] },
    );
    p[`column-corner-${corner.id}`] = pose(
      [c.x * COL_HW, 2.52, c.z * COL_HW],
      [c.x * 5.4, 2.7, c.z * 5.4],
      "column",
    );
    p[`pinnacle-${corner.id}`] = pose(
      [c.x * 2.05, 4.08, c.z * 2.05],
      [c.x * 4.8, 4.6, c.z * 4.8],
      "pinnacle",
    );
  }

  p["podium-plinth"] = pose([0, 0.76, 0], [0, -0.9, 0], "box", { size: [4.32, 1.28, 4.32] });
  p["podium-cornice"] = pose([0, 1.44, 0], [0, 0.2, 0], "box", { size: [4.48, 0.12, 4.48] });
  p["colonnade-terrace"] = pose([0, 3.8, 0], [0, 4.35, 0], "box", { size: [4.5, 0.12, 4.5] });
  p["attic-body"] = pose([0, 4.52, 0], [0, 5.1, 0], "box", { size: [2.62, 1.22, 2.62] });

  p["shaft-lower"] = pose([0, 5.75, 0], [0, 6.3, 0], "cylinder", { size: [0.47, 1.72, 0.47] });
  p["shaft-mid"] = pose([0, 7.47, 0], [0.15, 8.3, 0], "cylinder", { size: [0.46, 1.72, 0.46] });
  p["shaft-upper"] = pose([0, 9.19, 0], [-0.12, 10.3, 0], "cylinder", { size: [0.45, 1.72, 0.45] });
  p["shaft-spiral"] = pose([0, 7.47, 0], [2.4, 7.5, 1.6], "helix", { size: [0.49, 5.05, 0.028] });
  p["shaft-capital"] = pose([0, 10.12, 0], [0, 11.5, 0], "cylinder", { size: [0.55, 0.2, 0.55] });
  p["elevator-shaft"] = pose([0, 6.6, 0], [3.1, 6.6, 2.2], "box", { size: [0.2, 4.8, 0.2] });

  p["observation-deck"] = pose([0, 10.38, 0], [0, 12.1, 0], "balcony");
  p["crown-cap"] = pose([0, 10.72, 0], [0, 12.7, 0], "cylinder", { size: [0.32, 0.28, 0.32] });
  p["angel-peace"] = pose([0, 11.22, 0], [0, 13.6, 0], "angel");

  return p;
}

export const PART_POSES: Record<string, PartPose> = buildPoses();

const missing = PARTS.filter((part) => !PART_POSES[part.id]).map((part) => part.id);
if (missing.length > 0) {
  throw new Error(`Missing monument poses: ${missing.join(", ")}`);
}
