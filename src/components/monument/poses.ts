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

/** Hero-photo stacking: marble podium → cream colonnade → attic → tall spiral shaft → lantern/angel. */
export const COL_HW = 2.48;
export const POD_HW = 2.48;
export const POD_H = 2.08;
export const COL_HEIGHT = 4.32;
export const COL_Y = POD_H + COL_HEIGHT / 2;
export const ATTIC_W = 4.14;
export const ATTIC_H = 1.42;
export const TERRACE_Y = POD_H + COL_HEIGHT + 0.08;
export const ATTIC_Y = TERRACE_Y + 0.14 + ATTIC_H / 2;
export const SHAFT_BASE = ATTIC_Y + ATTIC_H / 2 + 0.16;
export const SHAFT = {
  r0: 0.56,
  r1: 0.54,
  r2: 0.52,
  seg: 3.92,
  helixR: 0.635,
  helixH: 11.76,
  turns: 12.4,
};
export const LOOKOUT_Y = SHAFT_BASE + SHAFT.seg * 3 + 0.22;
export const ANGEL_Y = LOOKOUT_Y + 0.72;

export const CLUSTER: Record<LayerId, Vector3Tuple> = {
  plaza: [-10.4, 1.5, 5],
  podium: [-5.6, 2.4, 4.4],
  colonnade: [-0.4, 3.8, 4],
  attic: [4.8, 5.4, 3.8],
  shaft: [9.2, 8.2, 3.2],
  lookout: [13.4, 11.4, 3],
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

  p["plaza-esplanade"] = pose([0, 0.05, 0], CLUSTER.plaza, "box", { size: [11.6, 0.1, 11.6] });
  p["plaza-walk"] = pose([0, 0.012, 0], [CLUSTER.plaza[0], 0.4, CLUSTER.plaza[2] + 2.2], "box", {
    size: [14.2, 0.04, 14.2],
  });
  p["equestrian-luperon"] = pose([0, 1.22, 11.65], [CLUSTER.plaza[0] + 2.4, 1.8, CLUSTER.plaza[2] + 3.4], "statue", {
    scale: [1.62, 1.62, 1.62],
  });

  for (const side of SIDES) {
    const d = SIDE_DIR[side.id];
    const stairsRest: Vector3Tuple = [d.x * 5.55, 0.42, d.z * 5.55];
    p[`stairs-${side.id}`] = pose(stairsRest, [0, 0, 0], "stairs", { rotation: [0, d.rot, 0] });
    const landingRest: Vector3Tuple = [d.x * 3.72, 0.84, d.z * 3.72];
    p[`landing-${side.id}`] = pose(landingRest, [0, 0, 0], "box", {
      size: [4.5, 0.08, 0.95],
      rotation: [0, d.rot, 0],
    });
    const gateRest: Vector3Tuple = [d.x * 2.52, 0.86, d.z * 2.52];
    p[`gate-${side.id}`] = pose(gateRest, [0, 0, 0], "gate", { rotation: [0, d.rot, 0] });
    const wallRest: Vector3Tuple = [d.x * 1.52, COL_Y, d.z * 1.52];
    p[`wall-${side.id}`] = pose(wallRest, [0, 0, 0], "wall", {
      size: [4.05, COL_HEIGHT - 0.22, 0.18],
      rotation: [0, d.rot, 0],
    });
    const entRest: Vector3Tuple = [d.x * 2.5, TERRACE_Y - 0.12, d.z * 2.5];
    p[`entablature-${side.id}`] = pose(entRest, [0, 0, 0], "box", {
      size: [5.02, 0.24, 0.42],
      rotation: [0, d.rot, 0],
    });
    const railRest: Vector3Tuple = [d.x * 0.48, LOOKOUT_Y + 0.16, d.z * 0.48];
    p[`rail-${side.id}`] = pose(railRest, [0, 0, 0], "rail", { rotation: [0, d.rot, 0] });
    const balRest: Vector3Tuple = [d.x * 2.52, POD_H + 0.08, d.z * 2.52];
    p[`balustrade-${side.id}`] = pose(balRest, [0, 0, 0], "balustrade", { rotation: [0, d.rot, 0] });

    ;[0.08, 0.24, 0.38, 0.62, 0.84].forEach((t, index) => {
      const along = -5.15 + 10.3 * t;
      const rest: Vector3Tuple =
        d.z !== 0 ? [along, 0.28, d.z * 6.55] : [d.x * 6.55, 0.28, along];
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
      const along = (n - 2) * 1.18;
      const rest: Vector3Tuple =
        d.z !== 0 ? [along, ATTIC_Y, d.z * (ATTIC_W / 2 + 0.02)] : [d.x * (ATTIC_W / 2 + 0.02), ATTIC_Y, along];
      p[`arch-${side.id}-${n}`] = pose(rest, [0, 0, 0], "arch", { rotation: [0, d.rot, 0] });
    }
    const emblemRest: Vector3Tuple = [
      d.x * (ATTIC_W / 2 + 0.04),
      ATTIC_Y + 0.42,
      d.z * (ATTIC_W / 2 + 0.04),
    ];
    p[`emblem-${side.id}`] = pose(emblemRest, [0, 0, 0], "emblem", { rotation: [0, d.rot, 0] });
  }

  for (const corner of CORNERS) {
    const c = CORNER_DIR[corner.id];
    const pierRest: Vector3Tuple = [c.x * POD_HW, POD_H / 2, c.z * POD_HW];
    p[`podium-corner-${corner.id}`] = pose(pierRest, [0, 0, 0], "box", { size: [0.46, POD_H, 0.46] });
    const colRest: Vector3Tuple = [c.x * COL_HW, COL_Y, c.z * COL_HW];
    p[`column-corner-${corner.id}`] = pose(colRest, [0, 0, 0], "column");
    const pinRest: Vector3Tuple = [c.x * 2.36, TERRACE_Y + 0.18, c.z * 2.36];
    p[`pinnacle-${corner.id}`] = pose(pinRest, [0, 0, 0], "pinnacle");
  }

  p["podium-plinth"] = pose([0, POD_H / 2, 0], [0, 0, 0], "podium", { size: [4.96, POD_H, 4.96] });
  p["podium-cornice"] = pose([0, POD_H + 0.04, 0], [0, 0, 0], "box", { size: [5.12, 0.1, 5.12] });
  p["colonnade-terrace"] = pose([0, TERRACE_Y, 0], [0, 0, 0], "box", { size: [5.12, 0.16, 5.12] });
  p["attic-body"] = pose([0, ATTIC_Y, 0], [0, 0, 0], "attic", { size: [ATTIC_W, ATTIC_H, ATTIC_W] });

  const shaft0 = SHAFT_BASE + SHAFT.seg / 2;
  p["shaft-lower"] = pose([0, shaft0, 0], [0, 0, 0], "cylinder", { size: [SHAFT.r0, SHAFT.seg, SHAFT.r0] });
  p["shaft-mid"] = pose([0, shaft0 + SHAFT.seg, 0], [0, 0, 0], "cylinder", {
    size: [SHAFT.r1, SHAFT.seg, SHAFT.r0 * 0.98],
  });
  p["shaft-upper"] = pose([0, shaft0 + SHAFT.seg * 2, 0], [0, 0, 0], "cylinder", {
    size: [SHAFT.r2, SHAFT.seg, SHAFT.r1],
  });
  p["shaft-spiral"] = pose([0, SHAFT_BASE + SHAFT.helixH / 2, 0], [0, 0, 0], "helix", {
    size: [SHAFT.helixR, SHAFT.helixH, 0.08],
  });
  p["shaft-capital"] = pose([0, LOOKOUT_Y - 0.28, 0], [0, 0, 0], "cylinder", { size: [0.66, 0.22, 0.66] });
  p["elevator-shaft"] = pose([0, SHAFT_BASE + SHAFT.helixH / 2, 0], [0, 0, 0], "box", { size: [0.18, 9.4, 0.18] });

  p["observation-deck"] = pose([0, LOOKOUT_Y, 0], [0, 0, 0], "balcony");
  p["crown-cap"] = pose([0, LOOKOUT_Y + 0.42, 0], [0, 0, 0], "cylinder", { size: [0.34, 0.38, 0.3] });
  p["angel-peace"] = pose([0, ANGEL_Y, 0], [0, 0, 0], "angel", { scale: [1.92, 1.92, 1.92] });

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
