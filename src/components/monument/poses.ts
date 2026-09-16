import type { Vector3Tuple } from "three";
import { CORNERS, LAYER_IDS, PARTS, SIDES, type LayerId } from "@/data/parts";

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
  | "wall"
  | "post"
  | "statue"
  | "balustrade";

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
export const COL_HW = 2.28;
export const POD_HW = 2.28;
export const COL_HEIGHT = 3.55;
export const COL_Y = 3.42;
export const ATTIC_W = 3.86;
export const ATTIC_Y = 6.05;
export const SHAFT = {
  r0: 0.42,
  r1: 0.4,
  r2: 0.385,
  seg: 3.05,
  helixR: 0.51,
  helixH: 9.15,
  turns: 10.4,
};

export const CLUSTER: Record<LayerId, Vector3Tuple> = {
  plaza: [-10.4, 1.5, 5],
  podium: [-5.6, 2.4, 4.4],
  colonnade: [-0.4, 3.5, 4],
  attic: [4.8, 4.8, 3.8],
  shaft: [9.2, 7.0, 3.2],
  lookout: [13.4, 9.8, 3],
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

  p["plaza-esplanade"] = pose([0, 0.05, 0], CLUSTER.plaza, "box", { size: [11.2, 0.1, 11.2] });
  p["plaza-walk"] = pose([0, 0.012, 0], [CLUSTER.plaza[0], 0.4, CLUSTER.plaza[2] + 2.2], "box", {
    size: [13.4, 0.04, 13.4],
  });
  p["equestrian-luperon"] = pose([0, 0.62, 8.6], [CLUSTER.plaza[0] + 2.4, 1.6, CLUSTER.plaza[2] + 3.2], "statue");

  for (const side of SIDES) {
    const d = SIDE_DIR[side.id];
    const stairsRest: Vector3Tuple = [d.x * 5.35, 0.38, d.z * 5.35];
    p[`stairs-${side.id}`] = pose(stairsRest, [0, 0, 0], "stairs", { rotation: [0, d.rot, 0] });
    const landingRest: Vector3Tuple = [d.x * 3.55, 0.72, d.z * 3.55];
    p[`landing-${side.id}`] = pose(landingRest, [0, 0, 0], "box", {
      size: [4.2, 0.08, 0.9],
      rotation: [0, d.rot, 0],
    });
    const gateRest: Vector3Tuple = [d.x * 2.32, 0.72, d.z * 2.32];
    p[`gate-${side.id}`] = pose(gateRest, [0, 0, 0], "gate", { rotation: [0, d.rot, 0] });
    const wallRest: Vector3Tuple = [d.x * 1.42, COL_Y, d.z * 1.42];
    p[`wall-${side.id}`] = pose(wallRest, [0, 0, 0], "wall", {
      size: [3.7, COL_HEIGHT - 0.18, 0.16],
      rotation: [0, d.rot, 0],
    });
    const entRest: Vector3Tuple = [d.x * 2.3, 5.28, d.z * 2.3];
    p[`entablature-${side.id}`] = pose(entRest, [0, 0, 0], "box", {
      size: [4.64, 0.22, 0.4],
      rotation: [0, d.rot, 0],
    });
    const railRest: Vector3Tuple = [d.x * 0.42, 16.55, d.z * 0.42];
    p[`rail-${side.id}`] = pose(railRest, [0, 0, 0], "rail", { rotation: [0, d.rot, 0] });
    const balRest: Vector3Tuple = [d.x * 2.32, 1.78, d.z * 2.32];
    p[`balustrade-${side.id}`] = pose(balRest, [0, 0, 0], "balustrade", { rotation: [0, d.rot, 0] });

    ;[0.1, 0.3, 0.5, 0.7, 0.9].forEach((t, index) => {
      const along = -4.95 + 9.9 * t;
      const rest: Vector3Tuple =
        d.z !== 0 ? [along, 0.28, d.z * 6.22] : [d.x * 6.22, 0.28, along];
      p[`post-${side.id}-${index + 1}`] = pose(rest, [0, 0, 0], "post");
    });

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
      const rest: Vector3Tuple = [x, COL_Y, z];
      p[`column-${side.id}-${index + 1}`] = pose(rest, [0, 0, 0], "column", {
        rotation: [0, d.rot, 0],
      });
    });
  }

  for (const side of SIDES) {
    const d = SIDE_DIR[side.id];
    for (const n of [1, 2, 3] as const) {
      const along = (n - 2) * 1.12;
      const rest: Vector3Tuple =
        d.z !== 0 ? [along, ATTIC_Y, d.z * (ATTIC_W / 2 + 0.02)] : [d.x * (ATTIC_W / 2 + 0.02), ATTIC_Y, along];
      p[`arch-${side.id}-${n}`] = pose(rest, [0, 0, 0], "arch", { rotation: [0, d.rot, 0] });
    }
    const emblemRest: Vector3Tuple = [
      d.x * (ATTIC_W / 2 + 0.04),
      ATTIC_Y + 0.5,
      d.z * (ATTIC_W / 2 + 0.04),
    ];
    p[`emblem-${side.id}`] = pose(emblemRest, [0, 0, 0], "emblem", { rotation: [0, d.rot, 0] });
  }

  for (const corner of CORNERS) {
    const c = CORNER_DIR[corner.id];
    const pierRest: Vector3Tuple = [c.x * POD_HW, 0.88, c.z * POD_HW];
    p[`podium-corner-${corner.id}`] = pose(pierRest, [0, 0, 0], "box", { size: [0.42, 1.62, 0.42] });
    const colRest: Vector3Tuple = [c.x * COL_HW, COL_Y, c.z * COL_HW];
    p[`column-corner-${corner.id}`] = pose(colRest, [0, 0, 0], "column");
    const pinRest: Vector3Tuple = [c.x * 2.18, 5.56, c.z * 2.18];
    p[`pinnacle-${corner.id}`] = pose(pinRest, [0, 0, 0], "pinnacle");
  }

  p["podium-plinth"] = pose([0, 0.88, 0], [0, 0, 0], "podium", { size: [4.56, 1.62, 4.56] });
  p["podium-cornice"] = pose([0, 1.72, 0], [0, 0, 0], "box", { size: [4.72, 0.1, 4.72] });
  p["colonnade-terrace"] = pose([0, 5.42, 0], [0, 0, 0], "box", { size: [4.72, 0.14, 4.72] });
  p["attic-body"] = pose([0, ATTIC_Y, 0], [0, 0, 0], "attic", { size: [ATTIC_W, 1.18, ATTIC_W] });

  const shaft0 = 7.12 + SHAFT.seg / 2;
  p["shaft-lower"] = pose([0, shaft0, 0], [0, 0, 0], "cylinder", { size: [SHAFT.r0, SHAFT.seg, SHAFT.r0] });
  p["shaft-mid"] = pose([0, shaft0 + SHAFT.seg, 0], [0, 0, 0], "cylinder", {
    size: [SHAFT.r1, SHAFT.seg, SHAFT.r0 * 0.98],
  });
  p["shaft-upper"] = pose([0, shaft0 + SHAFT.seg * 2, 0], [0, 0, 0], "cylinder", {
    size: [SHAFT.r2, SHAFT.seg, SHAFT.r1],
  });
  p["shaft-spiral"] = pose([0, shaft0 + SHAFT.seg, 0], [0, 0, 0], "helix", {
    size: [SHAFT.helixR, SHAFT.helixH, 0.048],
  });
  p["shaft-capital"] = pose([0, 16.05, 0], [0, 0, 0], "cylinder", { size: [0.52, 0.18, 0.52] });
  p["elevator-shaft"] = pose([0, 11.0, 0], [0, 0, 0], "box", { size: [0.16, 7.6, 0.16] });

  p["observation-deck"] = pose([0, 16.38, 0], [0, 0, 0], "balcony");
  p["crown-cap"] = pose([0, 16.78, 0], [0, 0, 0], "cylinder", { size: [0.3, 0.34, 0.26] });
  p["angel-peace"] = pose([0, 17.12, 0], [0, 0, 0], "angel", { scale: [2.35, 2.35, 2.35] });

  applyCategoryLayout(p);
  return p;
}

function applyCategoryLayout(p: Record<string, PartPose>) {
  const spacing: Record<LayerId, number> = {
    plaza: 1.42,
    podium: 1.28,
    colonnade: 0.82,
    attic: 1.08,
    shaft: 1.55,
    lookout: 1.32,
  };
  const colsFor: Record<LayerId, number> = {
    plaza: 4,
    podium: 3,
    colonnade: 5,
    attic: 4,
    shaft: 3,
    lookout: 3,
  };

  for (const layer of LAYER_IDS) {
    const ids = PARTS.filter((part) => part.layer === layer).map((part) => part.id);
    const cols = colsFor[layer];
    const gap = spacing[layer];
    const origin = CLUSTER[layer];
    ids.forEach((id, index) => {
      const poseNode = p[id];
      if (!poseNode) return;
      const c = index % cols;
      const r = Math.floor(index / cols);
      poseNode.explode = [
        origin[0] + (c - (cols - 1) / 2) * gap,
        origin[1] + r * gap * 0.7,
        origin[2],
      ];
    });
  }
}

export const PART_POSES: Record<string, PartPose> = buildPoses();

const missing = PARTS.filter((part) => !PART_POSES[part.id]).map((part) => part.id);
if (missing.length > 0) {
  throw new Error(`Missing monument poses: ${missing.join(", ")}`);
}
