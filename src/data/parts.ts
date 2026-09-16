export const LAYER_IDS = [
  "plaza",
  "podium",
  "colonnade",
  "attic",
  "shaft",
  "lookout",
] as const;

export type LayerId = (typeof LAYER_IDS)[number];
export type Locale = "es" | "en";

export interface AtlasPart {
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
  plaza: {
    nameEs: "Plaza y gradas",
    nameEn: "Plaza & stairs",
    hintEs: "Explanada de piedra clara",
    hintEn: "Light stone esplanade",
    swatch: "#d8d0c4",
  },
  podium: {
    nameEs: "Podio",
    nameEn: "Podium",
    hintEs: "Zócalo gris y portones",
    hintEn: "Grey base and gates",
    swatch: "#8a8580",
  },
  colonnade: {
    nameEs: "Columnata",
    nameEn: "Colonnade",
    hintEs: "Columnas crema y terraza",
    hintEn: "Cream columns and terrace",
    swatch: "#efe4cc",
  },
  attic: {
    nameEs: "Ático",
    nameEn: "Attic",
    hintEs: "Arcos y escudos",
    hintEn: "Arches and shields",
    swatch: "#e4d7bc",
  },
  shaft: {
    nameEs: "Fuste",
    nameEn: "Shaft",
    hintEs: "Cilindro y espiral",
    hintEn: "Cylinder and spiral",
    swatch: "#f0e6d2",
  },
  lookout: {
    nameEs: "Mirador",
    nameEn: "Lookout",
    hintEs: "Balcón y Ángel de la Paz",
    hintEn: "Balcony and Angel of Peace",
    swatch: "#b4532a",
  },
};

export const CREAM = "#f0e6d2";
export const CREAM_HI = "#f7f1e4";
export const CREAM_DEEP = "#c6b394";
export const STONE_PLAZA = "#ebe4d8";
export const GREY_PODIUM = "#e4ddd0";
export const GREY_DEEP = "#d2cbbd";
export const BRONZE = "#a14b2c";
export const BRONZE_DARK = "#7c341c";
export const ARCH_VOID = "#5a221c";
export const GATE_METAL = "#2a2622";
export const RAIL = "#c9c2b4";

export const SIDES = [
  { id: "north", es: "norte", en: "north" },
  { id: "east", es: "este", en: "east" },
  { id: "south", es: "sur", en: "south" },
  { id: "west", es: "oeste", en: "west" },
] as const;

export const CORNERS = [
  { id: "ne", es: "noreste", en: "northeast" },
  { id: "se", es: "sureste", en: "southeast" },
  { id: "sw", es: "suroeste", en: "southwest" },
  { id: "nw", es: "noroeste", en: "northwest" },
] as const;

function cap(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function generated(): AtlasPart[] {
  const stairs: AtlasPart[] = SIDES.map((side) => ({
    id: `stairs-${side.id}`,
    layer: "plaza",
    nameEs: `Gradas ${side.es}`,
    nameEn: `${cap(side.en)} stairs`,
    scientific: `Escalinata ${side.es}`,
    descriptionEs: `Tramo de gradas de piedra clara en el ${side.es}, subiendo la colina hasta la explanada del podio.`,
    descriptionEn: `Light-stone stair flight on the ${side.en}, climbing the hill to the podium terrace.`,
    culturalEs:
      side.id === "east"
        ? "El acceso este es el más abierto hacia la ciudad: Santiago ve primero las gradas, luego el fuste."
        : undefined,
    culturalEn:
      side.id === "east"
        ? "The east flight is the most open to the city: Santiago meets the stairs first, then the shaft."
        : undefined,
    aliases: ["stairs", "gradas", "escalinata", side.en, side.es],
    color: STONE_PLAZA,
  }));

  const landings: AtlasPart[] = SIDES.map((side) => ({
    id: `landing-${side.id}`,
    layer: "plaza",
    nameEs: `Descanso ${side.es}`,
    nameEn: `${cap(side.en)} landing`,
    scientific: `Descanso ${side.es}`,
    descriptionEs: `Meseta corta al pie del podio, ${side.es}.`,
    descriptionEn: `A short landing at the podium foot on the ${side.en}.`,
    aliases: ["landing", "descanso", side.en, side.es],
    color: STONE_PLAZA,
  }));

  const gates: AtlasPart[] = SIDES.map((side) => ({
    id: `gate-${side.id}`,
    layer: "podium",
    nameEs: `Portón ${side.es}`,
    nameEn: `${cap(side.en)} gate`,
    scientific: `Portal ${side.es}`,
    descriptionEs: `Gran arco en el zócalo gris, ${side.es}, con hoja metálica oscura y hueco profundo.`,
    descriptionEn: `A large arched doorway in the grey podium on the ${side.en}, with a dark metal leaf and a deep void.`,
    culturalEs:
      side.id === "south"
        ? "Los portones marcan el ingreso al interior: museo, murales y el ascensor hacia el mirador."
        : undefined,
    culturalEn:
      side.id === "south"
        ? "The gates mark entry to the interior: museum rooms, murals, and the elevator toward the lookout."
        : undefined,
    aliases: ["gate", "portón", "portal", "door", "arco", side.en, side.es],
    color: GATE_METAL,
  }));

  const podiumCorners: AtlasPart[] = CORNERS.map((corner) => ({
    id: `podium-corner-${corner.id}`,
    layer: "podium",
    nameEs: `Esquina ${corner.es} del podio`,
    nameEn: `${cap(corner.en)} podium pier`,
    scientific: `Angulus ${corner.id.toUpperCase()}`,
    descriptionEs: `Machón de esquina del zócalo gris, ${corner.es}. Afirma el cuadrado de la base.`,
    descriptionEn: `Grey podium corner pier, ${corner.en}. It holds the square of the base.`,
    aliases: ["corner", "esquina", "pier", corner.id, corner.en, corner.es],
    color: GREY_DEEP,
  }));

  const walls: AtlasPart[] = SIDES.map((side) => ({
    id: `wall-${side.id}`,
    layer: "colonnade",
    nameEs: `Muro ${side.es} de la columnata`,
    nameEn: `${cap(side.en)} colonnade wall`,
    scientific: `Paries ${side.es}`,
    descriptionEs: `Paño crema detrás de las columnas, cara ${side.es}. Da cuerpo al prisma cuadrado.`,
    descriptionEn: `Cream wall behind the columns on the ${side.en} face. It gives the square prism its body.`,
    aliases: ["wall", "muro", "colonnade", side.en, side.es],
    color: CREAM_DEEP,
  }));

  const entablature: AtlasPart[] = SIDES.map((side) => ({
    id: `entablature-${side.id}`,
    layer: "colonnade",
    nameEs: `Entablamento ${side.es}`,
    nameEn: `${cap(side.en)} entablature`,
    scientific: `Entablatura ${side.es}`,
    descriptionEs: `Faja que corona las columnas en el ${side.es} y sostiene la terraza.`,
    descriptionEn: `The band that crowns the ${side.en} columns and carries the terrace.`,
    aliases: ["entablature", "entablamento", side.en, side.es],
    color: CREAM_HI,
  }));

  const pinnacles: AtlasPart[] = CORNERS.map((corner) => ({
    id: `pinnacle-${corner.id}`,
    layer: "colonnade",
    nameEs: `Pináculo ${corner.es}`,
    nameEn: `${cap(corner.en)} pinnacle`,
    scientific: `Pinaculum ${corner.id.toUpperCase()}`,
    descriptionEs: `Remate de esquina sobre la terraza de la columnata, ${corner.es}.`,
    descriptionEn: `A corner finial on the colonnade terrace, ${corner.en}.`,
    aliases: ["pinnacle", "pináculo", "finial", corner.id, corner.en],
    color: CREAM_HI,
  }));

  const columnCorners: AtlasPart[] = CORNERS.map((corner) => ({
    id: `column-corner-${corner.id}`,
    layer: "colonnade",
    nameEs: `Columna de esquina ${corner.es}`,
    nameEn: `${cap(corner.en)} corner column`,
    scientific: `Columna anguli ${corner.id.toUpperCase()}`,
    descriptionEs: `Fuste de esquina de la columnata crema, ${corner.es}. Más grueso a la vista que los intermedios.`,
    descriptionEn: `Cream colonnade corner shaft, ${corner.en}. It reads heavier than the intermediates.`,
    aliases: ["column", "columna", "corner", corner.id, corner.en],
    color: CREAM_HI,
  }));

  const columnMids: AtlasPart[] = SIDES.flatMap((side) =>
    [1, 2, 3, 4].map((n) => ({
      id: `column-${side.id}-${n}`,
      layer: "colonnade" as const,
      nameEs: `Columna ${side.es} ${n}`,
      nameEn: `${cap(side.en)} column ${n}`,
      scientific: `Columna ${side.es} ${n}`,
      descriptionEs: `Fuste ${n} en la cara ${side.es} de la columnata. Orden alto, capitel sencillo, piedra crema.`,
      descriptionEn: `Shaft ${n} on the ${side.en} colonnade face. A tall order, plain capital, cream stone.`,
      culturalEs:
        n === 1 && side.id === "east"
          ? "La columnata da al prisma un ritmo de templo cívico, no de obelisco desnudo."
          : undefined,
      culturalEn:
        n === 1 && side.id === "east"
          ? "The colonnade gives the prism a civic-temple rhythm, not a bare obelisk."
          : undefined,
      aliases: ["column", "columna", side.en, side.es, String(n)],
      color: CREAM_HI,
    })),
  );

  const arches: AtlasPart[] = SIDES.flatMap((side) =>
    [1, 2, 3].map((n) => ({
      id: `arch-${side.id}-${n}`,
      layer: "attic" as const,
      nameEs: `Arco del ático ${side.es} ${n}`,
      nameEn: `Attic arch ${side.en} ${n}`,
      scientific: `Arcus ${side.es} ${n}`,
      descriptionEs: `Vano arqueado en el ático, cara ${side.es}. El hueco se lee rojo oscuro, como en las fotos del edificio.`,
      descriptionEn: `An arched opening in the attic, ${side.en} face. The void reads dark red, as in photographs of the building.`,
      aliases: ["arch", "arco", "attic", "ático", "window", side.en, side.es],
      color: ARCH_VOID,
    })),
  );

  const emblems: AtlasPart[] = [
    {
      id: "emblem-north",
      layer: "attic",
      nameEs: "Escudo norte — Luperón",
      nameEn: "North shield — Luperón",
      scientific: "Insigne septentrionale",
      descriptionEs: "Emblema sobre el ático norte. Recuerda a Gregorio Luperón en la cara más alta del prisma.",
      descriptionEn: "Emblem on the north attic. It recalls Gregorio Luperón on the high face of the prism.",
      culturalEs: "Luperón fue el jefe militar más visible de la Restauración y luego presidente.",
      culturalEn: "Luperón was the Restoration’s most visible military leader and later president.",
      aliases: ["shield", "escudo", "luperon", "luperón", "emblem"],
      color: BRONZE,
    },
    {
      id: "emblem-east",
      layer: "attic",
      nameEs: "Escudo este — Capotillo",
      nameEn: "East shield — Capotillo",
      scientific: "Insigne orientale",
      descriptionEs: "Emblema este. Nombra el Grito de Capotillo (16 de agosto de 1863).",
      descriptionEn: "East emblem. It names the Cry of Capotillo (16 August 1863).",
      culturalEs: "Un alzamiento pequeño en la frontera norte encendió dos años de guerra.",
      culturalEn: "A small rising on the northern border lit two years of war.",
      aliases: ["shield", "capotillo", "rodriguez", "emblem"],
      color: BRONZE,
    },
    {
      id: "emblem-south",
      layer: "attic",
      nameEs: "Escudo sur — Santiago en armas",
      nameEn: "South shield — Santiago in arms",
      scientific: "Insigne australe",
      descriptionEs: "Emblema sur. Santiago no fue telón: fue teatro de la Restauración.",
      descriptionEn: "South emblem. Santiago was not a backdrop; it was a Restoration theater.",
      aliases: ["shield", "santiago", "polanco", "emblem"],
      color: BRONZE,
    },
    {
      id: "emblem-west",
      layer: "attic",
      nameEs: "Escudo oeste — la República",
      nameEn: "West shield — the Republic",
      scientific: "Insigne occidentale",
      descriptionEs: "Emblema oeste. La Restauración peleó y también gobernó.",
      descriptionEn: "West emblem. The Restoration fought and also governed.",
      aliases: ["shield", "republic", "salcedo", "emblem"],
      color: BRONZE,
    },
  ];

  const rails: AtlasPart[] = SIDES.map((side) => ({
    id: `rail-${side.id}`,
    layer: "lookout",
    nameEs: `Baranda ${side.es}`,
    nameEn: `${cap(side.en)} balcony rail`,
    scientific: `Cancellum ${side.es}`,
    descriptionEs: `Tramo de baranda del balcón circular, ${side.es}.`,
    descriptionEn: `A segment of the circular balcony railing, ${side.en}.`,
    aliases: ["rail", "baranda", "balcony", "mirador", side.en, side.es],
    color: RAIL,
  }));

  return [
    ...stairs,
    ...landings,
    ...gates,
    ...podiumCorners,
    ...walls,
    ...entablature,
    ...pinnacles,
    ...columnCorners,
    ...columnMids,
    ...arches,
    ...emblems,
    ...rails,
  ];
}

const CORE: AtlasPart[] = [
  {
    id: "plaza-esplanade",
    layer: "plaza",
    nameEs: "Explanada",
    nameEn: "Esplanade",
    scientific: "Platea",
    descriptionEs: "Plataforma de piedra clara sobre la colina. Piso cívico antes del podio.",
    descriptionEn: "A light-stone platform on the hill. The civic floor before the podium.",
    culturalEs: "La colina ya era un alto de Santiago; el monumento la convierte en escenario público.",
    culturalEn: "The hill was already a high point of Santiago; the monument turns it into a public stage.",
    aliases: ["plaza", "explanada", "esplanade"],
    color: STONE_PLAZA,
  },
  {
    id: "plaza-walk",
    layer: "plaza",
    nameEs: "Paseo perimetral",
    nameEn: "Outer walk",
    scientific: "Ambulatio",
    descriptionEs: "Franja que rodea la explanada, un poco más baja y grisácea.",
    descriptionEn: "A slightly lower, greyer band around the esplanade.",
    aliases: ["walk", "paseo", "ring"],
    color: "#c4bdb2",
  },
  {
    id: "podium-plinth",
    layer: "podium",
    nameEs: "Zócalo gris",
    nameEn: "Grey podium",
    scientific: "Podium",
    descriptionEs: "Cuerpo inferior de piedra más oscura. Contrasta con la columnata crema de encima.",
    descriptionEn: "The lower mass in darker stone. It contrasts with the cream colonnade above.",
    culturalEs: "El zócalo ancla el prisma: el homenaje empieza en el suelo, no en el cielo.",
    culturalEn: "The podium anchors the prism: remembrance starts on the ground, not in the sky.",
    aliases: ["podium", "zócalo", "plinth", "grey", "base"],
    color: GREY_PODIUM,
  },
  {
    id: "podium-cornice",
    layer: "podium",
    nameEs: "Cornisa del zócalo",
    nameEn: "Podium cornice",
    scientific: "Corona podii",
    descriptionEs: "Filete que separa el gris del crema y recibe las bases de las columnas.",
    descriptionEn: "A belt that splits grey from cream and receives the column bases.",
    aliases: ["cornice", "cornisa", "belt"],
    color: GREY_DEEP,
  },
  {
    id: "colonnade-terrace",
    layer: "colonnade",
    nameEs: "Terraza de la columnata",
    nameEn: "Colonnade terrace",
    scientific: "Solarium",
    descriptionEs: "Cubierta plana sobre las columnas, con pináculos en las esquinas.",
    descriptionEn: "The flat roof over the columns, with pinnacles at the corners.",
    aliases: ["terrace", "terraza", "roof", "deck"],
    color: CREAM,
  },
  {
    id: "attic-body",
    layer: "attic",
    nameEs: "Cuerpo del ático",
    nameEn: "Attic body",
    scientific: "Atticum",
    descriptionEs: "Prisma menor, retranqueado, entre la terraza y el fuste cilíndrico. Lleva arcos rojizos.",
    descriptionEn: "A smaller, set-back prism between the terrace and the cylindrical shaft. It carries the red arches.",
    aliases: ["attic", "ático", "setback"],
    color: CREAM_DEEP,
  },
  {
    id: "shaft-lower",
    layer: "shaft",
    nameEs: "Fuste inferior",
    nameEn: "Lower shaft",
    scientific: "Scapus inferior",
    descriptionEs: "Tramo bajo del cilindro crema. Empieza la espiral que envuelve la torre.",
    descriptionEn: "Lower length of the cream cylinder. The wrapping spiral starts here.",
    aliases: ["shaft", "fuste", "cylinder", "tower"],
    color: CREAM_HI,
  },
  {
    id: "shaft-mid",
    layer: "shaft",
    nameEs: "Fuste medio",
    nameEn: "Middle shaft",
    scientific: "Scapus medius",
    descriptionEs: "Tramo central del cilindro. La helice se lee mejor a contraluz.",
    descriptionEn: "Middle length of the cylinder. The helix reads best against the light.",
    aliases: ["shaft", "fuste", "mid"],
    color: CREAM_HI,
  },
  {
    id: "shaft-upper",
    layer: "shaft",
    nameEs: "Fuste superior",
    nameEn: "Upper shaft",
    scientific: "Scapus superior",
    descriptionEs: "Tramo alto, ya cerca del balcón de observación.",
    descriptionEn: "Upper length, already near the observation balcony.",
    aliases: ["shaft", "fuste", "upper"],
    color: CREAM_HI,
  },
  {
    id: "shaft-spiral",
    layer: "shaft",
    nameEs: "Espiral del fuste",
    nameEn: "Shaft spiral",
    scientific: "Helix",
    descriptionEs: "Banda helicoidal que envuelve el cilindro. Es el detalle que distingue la silueta real.",
    descriptionEn: "A helical band wrapping the cylinder. It is the detail that distinguishes the real silhouette.",
    culturalEs: "Henry Gazón Bona usó esa cinta para que el fuste no fuera un tubo liso a distancia.",
    culturalEn: "Henry Gazón Bona used that ribbon so the shaft would not read as a plain tube at a distance.",
    aliases: ["spiral", "helix", "fluting", "espiral", "banda"],
    color: CREAM_DEEP,
  },
  {
    id: "shaft-capital",
    layer: "shaft",
    nameEs: "Collarín bajo el mirador",
    nameEn: "Lookout collar",
    scientific: "Collare",
    descriptionEs: "Anillo que ensancha el cilindro justo bajo el balcón.",
    descriptionEn: "A ring that widens the cylinder just under the balcony.",
    aliases: ["collar", "capital", "ring", "collarín"],
    color: CREAM,
  },
  {
    id: "elevator-shaft",
    layer: "shaft",
    nameEs: "Hueco del ascensor",
    nameEn: "Elevator shaft",
    scientific: "Puteus elevatoris",
    descriptionEs: "Vacío interior. En el edificio real convive con murales de Vela Zanetti.",
    descriptionEn: "The interior void. In the real building it shares the core with Vela Zanetti’s murals.",
    culturalEs: "El recorrido pedagógico del edificio no es solo la vista: es subir por dentro.",
    culturalEn: "The building’s teaching path is not only the view: it is the climb inside.",
    aliases: ["elevator", "ascensor", "interior", "vela zanetti"],
    color: "#5a5550",
  },
  {
    id: "observation-deck",
    layer: "lookout",
    nameEs: "Balcón de observación",
    nameEn: "Observation balcony",
    scientific: "Specula",
    descriptionEs: "Anillo circular cerca de la cima, más ancho que el fuste, con baranda.",
    descriptionEn: "A circular ring near the top, wider than the shaft, with a railing.",
    culturalEs: "Desde aquí Santiago se vuelve mapa: río, tejados y cerros.",
    culturalEn: "From here Santiago becomes a map: river, roofs, and hills.",
    aliases: ["balcony", "deck", "mirador", "lookout", "specula"],
    color: CREAM,
  },
  {
    id: "crown-cap",
    layer: "lookout",
    nameEs: "Capitel de coronación",
    nameEn: "Crowning cap",
    scientific: "Tholus",
    descriptionEs: "Remate cilíndrico sobre el balcón, peana del ángel.",
    descriptionEn: "A cylindrical cap above the balcony, the angel’s pedestal.",
    aliases: ["crown", "cap", "tholus", "peana"],
    color: CREAM_HI,
  },
  {
    id: "angel-peace",
    layer: "lookout",
    nameEs: "Ángel de la Paz",
    nameEn: "Angel of Peace",
    scientific: "Angelus Pacis",
    descriptionEs:
      "Estatua de bronce rojizo en la cima, alas y brazos alzados. Es la figura que cierra la vertical del monumento.",
    descriptionEn:
      "A reddish bronze statue at the summit, wings and arms raised. It is the figure that closes the monument’s vertical.",
    culturalEs:
      "El ángel se pensó como Victoria/Paz en el proyecto original. Hoy se lee sobre un edificio rededicado a la Restauración, no a un dictador.",
    culturalEn:
      "The angel was conceived as Victory/Peace in the original project. Today it is read on a building rededicated to the Restoration, not to a dictator.",
    aliases: ["angel", "ángel", "peace", "paz", "statue", "victoria", "bronze"],
    color: BRONZE,
  },
];

export const PARTS: AtlasPart[] = [...CORE, ...generated()];

export const PART_BY_ID = Object.fromEntries(PARTS.map((part) => [part.id, part])) as Record<
  string,
  AtlasPart
>;

export function partLabel(part: AtlasPart, locale: Locale) {
  return locale === "es" ? part.nameEs : part.nameEn;
}

export function partDescription(part: AtlasPart, locale: Locale) {
  return locale === "es" ? part.descriptionEs : part.descriptionEn;
}

export function partCultural(part: AtlasPart, locale: Locale) {
  return locale === "es" ? part.culturalEs : part.culturalEn;
}
