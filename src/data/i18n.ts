import type { Locale } from "@/data/parts";

export const COPY = {
  es: {
    appName: "El Anatomy",
    documentTitle: "El Anatomy — Monumento a los Héroes de la Restauración",
    tagline: "Atlas 3D del Monumento de Santiago",
    subtitle: "Una torre cívica, vista por partes",
    searchPlaceholder: "Buscar plaza, columna, héroe…",
    searchEmpty: "Ninguna parte coincide.",
    layers: "Capas",
    inventory: "Inventario",
    explode: "Vista explosionada",
    explodeOn: "Separar",
    explodeOff: "Juntar",
    isolate: "Aislar",
    resetView: "Centrar",
    selected: "Selección",
    tapHint: "Toca una parte del monumento o búscalo por nombre.",
    scientific: "Nombre",
    alsoCalled: "También",
    culturalNote: "Nota histórica dominicana",
    orbitHint: "Arrastra para orbitar · pellizca o rueda para zoom",
    footer:
      "El Anatomy — explorador arquitectónico educativo. No es publicidad turística ni un juicio político de una sola época.",
    language: "Idioma",
    languageEs: "Español",
    languageEn: "English",
    close: "Cerrar",
    hideLayer: "Ocultar capa",
    showLayer: "Mostrar capa",
    partsVisible: "partes visibles",
    subjectName: "El Monumento",
    subjectOfficial: "Monumento a los Héroes de la Restauración",
    architect: "Henry Gazón Bona",
    region: "Santiago de los Caballeros, República Dominicana",
    intro:
      "Modelo simplificado de la torre sobre la colina de Santiago. Gira, oculta capas y separa las piezas para inventariar plaza, pedestal, columnas, fuste, esculturas y mirador.",
    historyNote:
      "Se inauguró en 1953 como monumento a la «paz» de Trujillo. Tras 1961 la ciudad lo dedicó a quienes pelearon la Guerra de la Restauración (1863–1865) contra la anexión española.",
  },
  en: {
    appName: "El Anatomy",
    documentTitle: "El Anatomy — Monument to the Heroes of the Restoration",
    tagline: "3D atlas of Santiago’s Monument",
    subtitle: "A civic tower, seen in parts",
    searchPlaceholder: "Search plaza, column, hero…",
    searchEmpty: "No parts match.",
    layers: "Layers",
    inventory: "Inventory",
    explode: "Exploded view",
    explodeOn: "Separate",
    explodeOff: "Assemble",
    isolate: "Isolate",
    resetView: "Recenter",
    selected: "Selection",
    tapHint: "Tap a piece of the monument or search by name.",
    scientific: "Name",
    alsoCalled: "Also called",
    culturalNote: "Dominican historical note",
    orbitHint: "Drag to orbit · pinch or scroll to zoom",
    footer:
      "El Anatomy — educational architectural explorer. Not tourism advertising, and not a verdict on a single political era.",
    language: "Language",
    languageEs: "Español",
    languageEn: "English",
    close: "Close",
    hideLayer: "Hide layer",
    showLayer: "Show layer",
    partsVisible: "visible parts",
    subjectName: "El Monumento",
    subjectOfficial: "Monument to the Heroes of the Restoration",
    architect: "Henry Gazón Bona",
    region: "Santiago de los Caballeros, Dominican Republic",
    intro:
      "A simplified model of the tower on Santiago’s hill. Orbit, hide layers, and space the pieces to inventory plaza, pedestal, columns, shaft, sculptures, and lookout.",
    historyNote:
      "It opened in 1953 as a monument to Trujillo’s “peace.” After 1961 the city dedicated it to those who fought the Restoration War (1863–1865) against Spanish reannexation.",
  },
} as const;

export type Copy = (typeof COPY)[Locale];

export function t(locale: Locale): Copy {
  return COPY[locale];
}
