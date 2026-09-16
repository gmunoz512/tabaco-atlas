import type { Locale } from "@/data/parts";

export const COPY = {
  es: {
    appName: "Tabaco Atlas",
    tagline: "Explorador botánico de Nicotiana",
    subtitle: "Planta del Caribe, vista por partes",
    searchPlaceholder: "Buscar hoja, raíz, flor…",
    searchEmpty: "Ninguna parte coincide.",
    layers: "Capas",
    inventory: "Inventario",
    explode: "Vista explosionada",
    explodeOn: "Separar",
    explodeOff: "Juntar",
    isolate: "Aislar",
    resetView: "Centrar",
    selected: "Selección",
    tapHint: "Toca una parte de la planta o búscalo por nombre.",
    scientific: "Nombre científico",
    alsoCalled: "También",
    culturalNote: "Nota dominicana / caribeña",
    orbitHint: "Arrastra para orbitar · pellizca o rueda para zoom",
    footer:
      "Explorador botánico educativo. No es consejo médico ni agronómico, ni publicidad de tabaco.",
    language: "Idioma",
    languageEs: "Español",
    languageEn: "English",
    close: "Cerrar",
    hideLayer: "Ocultar capa",
    showLayer: "Mostrar capa",
    partsVisible: "partes visibles",
    plantName: "Tabaco",
    plantScientific: "Nicotiana tabacum L.",
    family: "Solanaceae",
    region: "Valle del Cibao, República Dominicana",
    intro:
      "Modelo simplificado de la planta de tabaco como se conoce en el Caribe. Gira, oculta capas y separa las piezas para inventariarlas.",
    tainoNote:
      "Los taínos de las Antillas Mayores conocían esta planta mucho antes de la colonia. Aquí se estudia la botánica y el paisaje cultural, no el consumo.",
  },
  en: {
    appName: "Tabaco Atlas",
    tagline: "Botanical explorer of Nicotiana",
    subtitle: "A Caribbean plant, seen in parts",
    searchPlaceholder: "Search leaf, root, flower…",
    searchEmpty: "No parts match.",
    layers: "Layers",
    inventory: "Inventory",
    explode: "Exploded view",
    explodeOn: "Separate",
    explodeOff: "Assemble",
    isolate: "Isolate",
    resetView: "Recenter",
    selected: "Selection",
    tapHint: "Tap a plant part or search by name.",
    scientific: "Scientific name",
    alsoCalled: "Also called",
    culturalNote: "Dominican / Caribbean note",
    orbitHint: "Drag to orbit · pinch or scroll to zoom",
    footer:
      "Educational botanical explorer. Not medical or agricultural advice, and not tobacco advertising.",
    language: "Language",
    languageEs: "Español",
    languageEn: "English",
    close: "Close",
    hideLayer: "Hide layer",
    showLayer: "Show layer",
    partsVisible: "visible parts",
    plantName: "Tobacco plant",
    plantScientific: "Nicotiana tabacum L.",
    family: "Solanaceae",
    region: "Cibao Valley, Dominican Republic",
    intro:
      "A simplified model of the tobacco plant as known in the Caribbean. Orbit, hide layers, and space the pieces to inventory them.",
    tainoNote:
      "Taíno communities of the Greater Antilles knew this plant long before colonization. This atlas studies botany and cultural landscape, not consumption.",
  },
} as const;

export type Copy = (typeof COPY)[Locale];

export function t(locale: Locale): Copy {
  return COPY[locale];
}
