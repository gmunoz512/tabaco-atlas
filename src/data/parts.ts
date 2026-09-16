export const LAYER_IDS = ["roots", "stem", "leaves", "flower"] as const;

export type LayerId = (typeof LAYER_IDS)[number];
export type Locale = "es" | "en";

export interface PlantPart {
  id: string;
  layer: LayerId;
  nameEs: string;
  nameEn: string;
  scientific: string;
  descriptionEs: string;
  descriptionEn: string;
  culturalEs?: string;
  culturalEn?: string;
  aliases: string[];
  color: string;
}

export const LAYERS: Record<
  LayerId,
  { nameEs: string; nameEn: string; hintEs: string; hintEn: string; swatch: string }
> = {
  roots: {
    nameEs: "Raíces",
    nameEn: "Roots",
    hintEs: "Anclaje y absorción",
    hintEn: "Anchorage and uptake",
    swatch: "#b08968",
  },
  stem: {
    nameEs: "Tallo",
    nameEn: "Stem",
    hintEs: "Eje y transporte",
    hintEn: "Axis and transport",
    swatch: "#6f7d3d",
  },
  leaves: {
    nameEs: "Hojas",
    nameEn: "Leaves",
    hintEs: "Fotosíntesis",
    hintEn: "Photosynthesis",
    swatch: "#5d8a3a",
  },
  flower: {
    nameEs: "Flor",
    nameEn: "Flower",
    hintEs: "Reproducción",
    hintEn: "Reproduction",
    swatch: "#e8b4bc",
  },
};

export const PARTS: PlantPart[] = [
  {
    id: "taproot",
    layer: "roots",
    nameEs: "Raíz principal",
    nameEn: "Taproot",
    scientific: "Radix primaria",
    descriptionEs:
      "Raíz pivotante que baja en el suelo y da poco sostén a una planta tan alta. Desde ella nacen decenas de raíces secundarias, como una cabellera.",
    descriptionEn:
      "A downward taproot that offers limited support for such a tall herb. Secondary roots fan out from it in a fibrous fringe.",
    culturalEs:
      "En el Cibao se prepara la tierra con esmero antes de transplantar: la raíz ancla mal si el suelo queda compacto o encharcado.",
    culturalEn:
      "In the Cibao, growers loosen the bed before transplanting: this root anchors poorly in compacted or waterlogged soil.",
    aliases: ["raiz", "raíz", "pivotante", "radix", "root", "taproot"],
    color: "#8d6a4a",
  },
  {
    id: "laterals",
    layer: "roots",
    nameEs: "Raíces laterales",
    nameEn: "Lateral roots",
    scientific: "Radices laterales",
    descriptionEs:
      "Red fibrosa que explora los primeros centímetros de suelo. Absorbe agua y minerales, pero sostiene poco el volumen aéreo de Nicotiana.",
    descriptionEn:
      "A fibrous net that explores the topsoil. It takes up water and minerals, but barely props up the bulky shoot of Nicotiana.",
    culturalEs:
      "Los semilleros dominicanos —tradicionales al sol o en bandejas flotantes— se cuidan para que este sistema salga denso antes del transplante.",
    culturalEn:
      "Dominican seedbeds — open-soil or floating trays — are tended so this system is dense before the plant reaches the field.",
    aliases: ["fibrosas", "secundarias", "cabellera", "lateral", "fibrous"],
    color: "#a98467",
  },
  {
    id: "stem",
    layer: "stem",
    nameEs: "Tallo",
    nameEn: "Stem",
    scientific: "Caulis",
    descriptionEs:
      "Eje herbáceo, velloso y un poco pegajoso, de 1 a 3 m. Los pelos glandulares cubren el tallo; las hojas nacen de forma alterna y a menudo abrazan el nudo.",
    descriptionEn:
      "A herbaceous, hairy, slightly sticky axis 1–3 m tall. Glandular hairs coat the stem; leaves arise alternately and often clasp the node.",
    culturalEs:
      "En finca se suele «despuntar» el tallo para que la planta no gaste savia en semilla y las hojas terminen de llenarse. Aquí lo dejamos entero para estudiar la flor.",
    culturalEn:
      "On farms the stem is often topped so energy stays in the leaves instead of seed. This model keeps the tip so the flower can be studied.",
    aliases: ["tallo", "caulis", "stem", "eje", "despunte"],
    color: "#6b7a3c",
  },
  {
    id: "leaf-basal-a",
    layer: "leaves",
    nameEs: "Hoja bajera",
    nameEn: "Basal leaf",
    scientific: "Folium basale",
    descriptionEs:
      "Hojas inferiores, las más grandes y las primeras en madurar. Lámina ovada o elíptica, borde ondulado, base que recorre el tallo.",
    descriptionEn:
      "The lowest leaves: largest, and the first to mature. The blade is ovate to elliptic, with a wavy edge and a base that runs down the stem.",
    culturalEs:
      "Campesinos del valle las llaman bajeras. Se cortan primero, de abajo hacia arriba, en una cosecha escalonada que puede durar semanas.",
    culturalEn:
      "Valley growers call these bajeras. They are primed first, from the bottom up, in a harvest that can last several weeks.",
    aliases: ["bajera", "basal", "folium", "hoja inferior", "volado bajo"],
    color: "#4f7a32",
  },
  {
    id: "leaf-basal-b",
    layer: "leaves",
    nameEs: "Hoja bajera opuesta",
    nameEn: "Opposite basal leaf",
    scientific: "Folium basale",
    descriptionEs:
      "Pareja de la hoja bajera. En la planta viva las hojas no son opuestas: siguen una espiral, pero aquí se separan para poder señalarlas.",
    descriptionEn:
      "Counterpart of the basal leaf. Living plants are not opposite-leaved — they spiral — but the pair is spaced here so each can be named.",
    aliases: ["bajera", "basal", "hoja", "leaf"],
    color: "#547f35",
  },
  {
    id: "leaf-mid-a",
    layer: "leaves",
    nameEs: "Hoja media (seco)",
    nameEn: "Middle leaf (seco)",
    scientific: "Folium medium",
    descriptionEs:
      "Hojas del tercio medio: aún anchas, más firmes que las bajeras. Reciben más sol y suelen tener una textura intermedia.",
    descriptionEn:
      "Leaves of the middle third: still broad, firmer than the bajeras. They take more sun and usually have an in-between texture.",
    culturalEs:
      "En el habla agrícola dominicana el «seco» o «viso» nombra esta altura de la planta, no una marca. Es un dato de morfología y de cosecha.",
    culturalEn:
      "In Dominican farm speech, seco or viso names this height on the plant — a morphological and harvest term, not a brand.",
    aliases: ["seco", "viso", "media", "middle", "folium medium"],
    color: "#5d8a3a",
  },
  {
    id: "leaf-mid-b",
    layer: "leaves",
    nameEs: "Hoja media (viso)",
    nameEn: "Middle leaf (viso)",
    scientific: "Folium medium",
    descriptionEs:
      "Otra hoja del tercio medio. La lámina sigue siendo grande —hasta 50 cm en campo— y se estrecha poco a poco hacia el ápice de la planta.",
    descriptionEn:
      "Another mid-stem leaf. The blade is still large — up to 50 cm in the field — and narrows gradually toward the plant tip.",
    aliases: ["viso", "seco", "media", "middle"],
    color: "#628f3d",
  },
  {
    id: "leaf-mid-c",
    layer: "leaves",
    nameEs: "Hoja media alta",
    nameEn: "Upper-middle leaf",
    scientific: "Folium medium",
    descriptionEs:
      "Transición entre el tercio medio y el superior. Más erecta, con menos sombra de las hojas de abajo.",
    descriptionEn:
      "A transition between the middle and upper thirds. More upright, with less shade from the leaves below.",
    aliases: ["media alta", "upper middle", "hoja"],
    color: "#679444",
  },
  {
    id: "leaf-upper-a",
    layer: "leaves",
    nameEs: "Hoja superior (ligero)",
    nameEn: "Upper leaf (ligero)",
    scientific: "Folium superius",
    descriptionEs:
      "Hojas del ápice vegetativo: más pequeñas, más expuestas al sol y al viento. Maduran al final de la cosecha.",
    descriptionEn:
      "Leaves of the vegetative tip: smaller, more exposed to sun and wind. They mature last.",
    culturalEs:
      "«Ligero» o «volado» describe esta posición en la planta. En el paisaje del Yaque del Norte esas hojas altas marcan el final del ciclo de corte.",
    culturalEn:
      "Ligero or volado describes this position on the plant. In the Yaque del Norte landscape those high leaves mark the end of the priming cycle.",
    aliases: ["ligero", "volado", "superior", "upper", "apex"],
    color: "#6f9c4b",
  },
  {
    id: "leaf-upper-b",
    layer: "leaves",
    nameEs: "Hoja apical",
    nameEn: "Apical leaf",
    scientific: "Folium apicale",
    descriptionEs:
      "Últimas láminas bajo la inflorescencia. Sésiles o casi sésiles, más lanceoladas que las bajeras.",
    descriptionEn:
      "The last blades under the inflorescence. Sessile or nearly so, more lanceolate than the basal leaves.",
    aliases: ["apical", "ligero", "corona", "tip leaf"],
    color: "#78a554",
  },
  {
    id: "inflorescence",
    layer: "flower",
    nameEs: "Inflorescencia",
    nameEn: "Inflorescence",
    scientific: "Inflorescentia (panicula)",
    descriptionEs:
      "Panoja terminal ramificada. En cada rama se abren flores tubulares hermafroditas; más tarde, cápsulas con miles de semillas minúsculas.",
    descriptionEn:
      "A branched terminal panicle. Each branch bears tubular bisexual flowers, later capsules with thousands of tiny seeds.",
    culturalEs:
      "Si la planta no se despunta, esta panoja es la que guarda la semilla criolla —piloto, olor, san vicente y otras líneas del valle.",
    culturalEn:
      "If the plant is not topped, this panicle holds criollo seed — piloto, olor, san vicente and other valley lines.",
    aliases: ["panoja", "panicle", "inflorescencia", "racimo", "semilla"],
    color: "#8f9a4a",
  },
  {
    id: "flower",
    layer: "flower",
    nameEs: "Flor",
    nameEn: "Flower",
    scientific: "Flos (corolla tubulosa)",
    descriptionEs:
      "Corola gamopétala, tubo largo y limbo de cinco lóbulos, rosa, blanco o rojizo. El cáliz es tubular y más corto que el tubo.",
    descriptionEn:
      "A fused corolla with a long tube and a five-lobed limb, pink, white, or reddish. The calyx is tubular and shorter than the tube.",
    culturalEs:
      "En la isla las flores de Nicotiana se ven al atardecer; polinizadores nocturnos y colibríes visitan el tubo. No es un adorno de producto: es la reproducción de la planta.",
    culturalEn:
      "On the island the flowers open toward evening; moths and hummingbirds visit the tube. This is the plant’s reproduction, not product decoration.",
    aliases: ["flor", "corola", "flos", "flower", "tubular", "rosa"],
    color: "#f0b7c0",
  },
];

export const PART_BY_ID = Object.fromEntries(PARTS.map((part) => [part.id, part])) as Record<
  string,
  PlantPart
>;

export function partLabel(part: PlantPart, locale: Locale) {
  return locale === "es" ? part.nameEs : part.nameEn;
}

export function partDescription(part: PlantPart, locale: Locale) {
  return locale === "es" ? part.descriptionEs : part.descriptionEn;
}

export function partCultural(part: PlantPart, locale: Locale) {
  return locale === "es" ? part.culturalEs : part.culturalEn;
}
