export const LAYER_IDS = [
  "plaza",
  "pedestal",
  "columns",
  "tower",
  "sculptures",
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
    hintEs: "Explanada y accesos",
    hintEn: "Esplanade and approaches",
    swatch: "#c9c0b0",
  },
  pedestal: {
    nameEs: "Pedestal",
    nameEn: "Pedestal",
    hintEs: "Plinto y caras",
    hintEn: "Plinth and faces",
    swatch: "#ddd4c4",
  },
  columns: {
    nameEs: "Columnas",
    nameEn: "Columns",
    hintEs: "Peristilo y entablamento",
    hintEn: "Colonnade and entablature",
    swatch: "#f0e8d8",
  },
  tower: {
    nameEs: "Torre",
    nameEn: "Tower",
    hintEs: "Fuste, vanos, ascensor",
    hintEn: "Shaft, openings, elevator",
    swatch: "#e7dfd0",
  },
  sculptures: {
    nameEs: "Esculturas",
    nameEn: "Sculptures",
    hintEs: "Héroes y alegorías",
    hintEn: "Heroes and allegories",
    swatch: "#8a6a3d",
  },
  lookout: {
    nameEs: "Mirador",
    nameEn: "Lookout",
    hintEs: "Cubierta, corona, asta",
    hintEn: "Deck, crown, flagpole",
    swatch: "#9aa7b8",
  },
};

const STONE = "#e6ddd0";
const STONE_WARM = "#d8cfc0";
const STONE_DEEP = "#c4b9a8";
const MARBLE = "#f3ece1";
const BRONZE = "#8a6a3d";
const OPENING = "#3d4654";
const METAL = "#8b95a4";

const SIDES = [
  {
    id: "north",
    es: "norte",
    en: "north",
    cityEs: "hacia el Cibao interior",
    cityEn: "toward the inner Cibao",
  },
  {
    id: "east",
    es: "este",
    en: "east",
    cityEs: "hacia el centro de Santiago",
    cityEn: "toward downtown Santiago",
  },
  {
    id: "south",
    es: "sur",
    en: "south",
    cityEs: "hacia el Yaque del Norte",
    cityEn: "toward the Yaque del Norte",
  },
  {
    id: "west",
    es: "oeste",
    en: "west",
    cityEs: "hacia el atardecer del valle",
    cityEn: "toward the valley sunset",
  },
] as const;

const COMPASS_16 = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
] as const;

function sideParts(): AtlasPart[] {
  const stairs: AtlasPart[] = SIDES.map((side) => ({
    id: `stairs-${side.id}`,
    layer: "plaza",
    nameEs: `Gradas ${side.es}`,
    nameEn: `${capitalize(side.en)} stairs`,
    scientific: `Escalinata ${side.es}`,
    descriptionEs: `Tramo de gradas en el ${side.es} de la explanada. Suben desde el borde de la colina hasta el descanso del pedestal.`,
    descriptionEn: `A stair flight on the ${side.en} of the esplanade, climbing from the hill edge to the pedestal landing.`,
    culturalEs:
      side.id === "east"
        ? "El acceso este es el más ceremonial: la ciudad ve la torre primero desde abajo, como un eje cívico, no como un objeto privado."
        : `Estas gradas ${side.es} ${side.cityEs}. El monumento se lee distinto según por dónde se suba.`,
    culturalEn:
      side.id === "east"
        ? "The east approach is the ceremonial one: the city meets the tower from below, as a civic axis rather than a private object."
        : `The ${side.en} flight ${side.cityEn}. Which way you climb changes how the monument is read.`,
    aliases: ["stairs", "gradas", "escalinata", "steps", side.en, side.es],
    color: STONE_WARM,
  }));

  const landings: AtlasPart[] = SIDES.map((side) => ({
    id: `landing-${side.id}`,
    layer: "plaza",
    nameEs: `Descanso ${side.es}`,
    nameEn: `${capitalize(side.en)} landing`,
    scientific: `Descanso ${side.es}`,
    descriptionEs: `Meseta corta al pie del pedestal, ${side.es}. Rompe la pendiente de las gradas antes de entrar al plinto.`,
    descriptionEn: `A short terrace at the foot of the pedestal on the ${side.en}, breaking the stair pitch before the plinth.`,
    aliases: ["landing", "descanso", "terrace", side.en, side.es],
    color: STONE,
  }));

  const faces: AtlasPart[] = SIDES.map((side) => ({
    id: `pedestal-face-${side.id}`,
    layer: "pedestal",
    nameEs: `Cara ${side.es} del pedestal`,
    nameEn: `Pedestal ${side.en} face`,
    scientific: `Frons ${side.es}`,
    descriptionEs: `Paño vertical del pedestal hacia el ${side.es}. Superficie de piedra para relieve, inscripción o sombra.`,
    descriptionEn: `The pedestal’s ${side.en} vertical face — stone for relief, inscription, or shade.`,
    culturalEs:
      side.id === "south"
        ? "Las caras del pedestal son el zócalo donde la ciudad coloca ofrendas el 16 de agosto, día de la Restauración."
        : undefined,
    culturalEn:
      side.id === "south"
        ? "The pedestal faces are the plinth where the city lays wreaths on 16 August, Restoration Day."
        : undefined,
    aliases: ["face", "cara", "pedestal", side.en, side.es],
    color: MARBLE,
  }));

  const entablature: AtlasPart[] = SIDES.map((side) => ({
    id: `entablature-${side.id}`,
    layer: "columns",
    nameEs: `Entablamento ${side.es}`,
    nameEn: `${capitalize(side.en)} entablature`,
    scientific: `Entablatura ${side.es}`,
    descriptionEs: `Tramo del entablamento que cierra el anillo de columnas por el ${side.es}. Transmite carga al fuste.`,
    descriptionEn: `Entablature span closing the column ring on the ${side.en}. It carries load into the shaft.`,
    aliases: ["entablature", "entablamento", "cornisa", side.en, side.es],
    color: MARBLE,
  }));

  const windowsMid: AtlasPart[] = SIDES.map((side) => ({
    id: `window-mid-${side.id}`,
    layer: "tower",
    nameEs: `Vano medio ${side.es}`,
    nameEn: `Mid ${side.en} opening`,
    scientific: `Fenestra media ${side.es}`,
    descriptionEs: `Abertura a media altura en la cara ${side.es} del fuste. Luz y sombra para el hueco interior.`,
    descriptionEn: `A mid-height opening on the shaft’s ${side.en} face — light and shadow for the interior void.`,
    aliases: ["window", "vano", "opening", "fenestra", side.en, side.es],
    color: OPENING,
  }));

  const windowsHigh: AtlasPart[] = SIDES.map((side) => ({
    id: `window-high-${side.id}`,
    layer: "tower",
    nameEs: `Vano alto ${side.es}`,
    nameEn: `Upper ${side.en} opening`,
    scientific: `Fenestra alta ${side.es}`,
    descriptionEs: `Abertura cercana al mirador en la cara ${side.es}. Marca el último tercio de la torre.`,
    descriptionEn: `An opening near the lookout on the ${side.en} face, marking the tower’s upper third.`,
    aliases: ["window", "vano", "opening", "lookout", side.en, side.es],
    color: OPENING,
  }));

  const rails: AtlasPart[] = SIDES.map((side) => ({
    id: `rail-${side.id}`,
    layer: "lookout",
    nameEs: `Baranda ${side.es}`,
    nameEn: `${capitalize(side.en)} railing`,
    scientific: `Cancellum ${side.es}`,
    descriptionEs: `Tramo de baranda del mirador hacia el ${side.es}. Protege el borde de la cubierta de observación.`,
    descriptionEn: `Lookout railing on the ${side.en} edge, guarding the observation deck.`,
    culturalEs:
      side.id === "east"
        ? "Desde esta baranda se lee Santiago: tejados, el Yaque y el valle. El mirador es civismo, no un palco privado."
        : undefined,
    culturalEn:
      side.id === "east"
        ? "From this rail Santiago reads as roofs, the Yaque, and the valley. The lookout is civic, not a private box."
        : undefined,
    aliases: ["rail", "railing", "baranda", "mirador", side.en, side.es],
    color: METAL,
  }));

  return [...stairs, ...landings, ...faces, ...entablature, ...windowsMid, ...windowsHigh, ...rails];
}

function columnParts(): AtlasPart[] {
  const notesEs = [
    "El peristilo da a la torre un basamento clásico, como un templo cívico más que un obelisco desnudo.",
    "Dieciséis columnas marcan un ritmo. Contarlas es entender que el monumento es un anillo, no solo un palo.",
    "Cada fuste del anillo recibe luz distinta; el mármol blanco de Santiago se vuelve gris o oro según la hora.",
    "El anillo recuerda que la Restauración se peleó en círculo: varios frentes, no un solo héroe.",
  ];
  const notesEn = [
    "The peristyle gives the tower a classical base — a civic temple more than a bare obelisk.",
    "Sixteen columns set a beat. Counting them shows the monument is a ring, not only a stick.",
    "Each shaft takes a different light; Santiago’s pale stone turns gray or gold by the hour.",
    "The ring is a reminder that the Restoration was fought on several fronts, not by one hero.",
  ];

  return COMPASS_16.map((bearing, index) => {
    const n = index + 1;
    const pad = String(n).padStart(2, "0");
    return {
      id: `column-${pad}`,
      layer: "columns" as const,
      nameEs: `Columna ${pad} (${bearing})`,
      nameEn: `Column ${pad} (${bearing})`,
      scientific: `Columna peristyle ${pad}`,
      descriptionEs: `Fuste ${n} del anillo de dieciséis columnas. Orienta hacia ${bearing}, en el tambor que ciñe la base de la torre.`,
      descriptionEn: `Shaft ${n} of the sixteen-column ring, bearing ${bearing}, on the drum that belts the tower base.`,
      culturalEs: notesEs[index % notesEs.length],
      culturalEn: notesEn[index % notesEn.length],
      aliases: ["column", "columna", "peristilo", "colonnade", bearing, String(n)],
      color: MARBLE,
    };
  });
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const CORE_PARTS: AtlasPart[] = [
  {
    id: "plaza-esplanade",
    layer: "plaza",
    nameEs: "Explanada",
    nameEn: "Esplanade",
    scientific: "Platea",
    descriptionEs:
      "Plataforma ancha sobre la colina. Es el piso cívico del conjunto: gente, ofrendas y sombra antes de subir.",
    descriptionEn:
      "The broad platform on the hill. It is the civic floor of the ensemble: people, wreaths, and shade before the climb.",
    culturalEs:
      "La colina ya era un alto de Santiago. Poner aquí un monumento convierte un cerro en un escenario público.",
    culturalEn:
      "The hill was already a high point of Santiago. Placing a monument here turns a ridge into a public stage.",
    aliases: ["plaza", "explanada", "esplanade", "platea", "colina"],
    color: STONE_WARM,
  },
  {
    id: "plaza-walk",
    layer: "plaza",
    nameEs: "Paseo perimetral",
    nameEn: "Outer walk",
    scientific: "Ambulatio",
    descriptionEs: "Franja que ciñe la explanada. Recorrido para rodear el pedestal sin subir las gradas principales.",
    descriptionEn: "A band around the esplanade — a path to circle the pedestal without climbing the main stairs.",
    aliases: ["walk", "paseo", "perimeter", "ring"],
    color: STONE_DEEP,
  },
  {
    id: "pedestal-plinth",
    layer: "pedestal",
    nameEs: "Plinto",
    nameEn: "Plinth",
    scientific: "Plinthus",
    descriptionEs: "Macizo inferior del pedestal. Asienta el anillo de columnas y reparte el peso del fuste.",
    descriptionEn: "The pedestal’s lower mass. It seats the column ring and spreads the shaft’s weight.",
    culturalEs:
      "Sin este zócalo la torre sería un palo. El plinto dice que el homenaje necesita suelo, no solo altura.",
    culturalEn:
      "Without this block the tower would be a stick. The plinth says remembrance needs ground, not only height.",
    aliases: ["plinth", "plinto", "zócalo", "base"],
    color: STONE,
  },
  {
    id: "pedestal-corner-ne",
    layer: "pedestal",
    nameEs: "Esquina noreste",
    nameEn: "Northeast pier",
    scientific: "Angulus NE",
    descriptionEs: "Machón de esquina noreste del pedestal. Arriostra las dos caras y marca el giro del plinto.",
    descriptionEn: "Northeast corner pier of the pedestal. It braces two faces and turns the plinth.",
    aliases: ["corner", "esquina", "pier", "ne", "noreste"],
    color: STONE,
  },
  {
    id: "pedestal-corner-se",
    layer: "pedestal",
    nameEs: "Esquina sureste",
    nameEn: "Southeast pier",
    scientific: "Angulus SE",
    descriptionEs: "Machón sureste. Recibe sombra corta al mediodía y mira hacia el valle abierto.",
    descriptionEn: "Southeast pier. It takes short noon shade and looks toward the open valley.",
    aliases: ["corner", "esquina", "pier", "se", "sureste"],
    color: STONE,
  },
  {
    id: "pedestal-corner-sw",
    layer: "pedestal",
    nameEs: "Esquina suroeste",
    nameEn: "Southwest pier",
    scientific: "Angulus SW",
    descriptionEs: "Machón suroeste, el más bañado por el sol de la tarde santiaguera.",
    descriptionEn: "Southwest pier, the one most washed by Santiago’s afternoon sun.",
    aliases: ["corner", "esquina", "pier", "sw", "suroeste"],
    color: STONE,
  },
  {
    id: "pedestal-corner-nw",
    layer: "pedestal",
    nameEs: "Esquina noroeste",
    nameEn: "Northwest pier",
    scientific: "Angulus NW",
    descriptionEs: "Machón noroeste. Cierra el cuadrado del pedestal hacia el interior del Cibao.",
    descriptionEn: "Northwest pier. It closes the pedestal square toward the inner Cibao.",
    aliases: ["corner", "esquina", "pier", "nw", "noroeste"],
    color: STONE,
  },
  {
    id: "pedestal-cornice",
    layer: "pedestal",
    nameEs: "Cornisa del pedestal",
    nameEn: "Pedestal cornice",
    scientific: "Corona pedestalis",
    descriptionEs: "Moldura que remata el pedestal y recibe el tambor de columnas. Línea de sombra horizontal.",
    descriptionEn: "The molding that caps the pedestal and receives the column drum. A horizontal shade line.",
    aliases: ["cornice", "cornisa", "moldura"],
    color: MARBLE,
  },
  {
    id: "shaft-drum",
    layer: "tower",
    nameEs: "Tambor de la torre",
    nameEn: "Tower drum",
    scientific: "Tympanum / podium",
    descriptionEs: "Cuerpo bajo que nace del entablamento y lanza el fuste. Más ancho que los tramos de arriba.",
    descriptionEn: "The low body that rises from the entablature and launches the shaft. Wider than the storeys above.",
    aliases: ["drum", "tambor", "podium", "base tower"],
    color: MARBLE,
  },
  {
    id: "shaft-lower",
    layer: "tower",
    nameEs: "Fuste inferior",
    nameEn: "Lower shaft",
    scientific: "Scapus inferior",
    descriptionEs: "Primer tramo alto de la torre. Empieza a estrecharse y marca la vertical que se ve desde la ciudad.",
    descriptionEn: "The first tall storey. It begins to taper and sets the vertical seen from the city.",
    culturalEs:
      "Henry Gazón Bona pensó una torre blanca que se leyera a distancia. El fuste es esa firma en el cielo de Santiago.",
    culturalEn:
      "Henry Gazón Bona wanted a white tower readable at a distance. The shaft is that signature on Santiago’s sky.",
    aliases: ["shaft", "fuste", "tower", "torre"],
    color: MARBLE,
  },
  {
    id: "shaft-mid",
    layer: "tower",
    nameEs: "Fuste medio",
    nameEn: "Middle shaft",
    scientific: "Scapus medius",
    descriptionEs: "Tramo central, aún prismático. Aquí el hueco interior y el ascensor ganan proporción.",
    descriptionEn: "The middle storey, still prismatic. The interior void and elevator take their proportion here.",
    aliases: ["shaft", "fuste", "mid"],
    color: "#efe8dc",
  },
  {
    id: "shaft-upper",
    layer: "tower",
    nameEs: "Fuste superior",
    nameEn: "Upper shaft",
    scientific: "Scapus superior",
    descriptionEs: "Último cuerpo largo antes del cuello. Los vanos altos perforan este tramo.",
    descriptionEn: "The last long body before the neck. The high openings punch this storey.",
    aliases: ["shaft", "fuste", "upper"],
    color: MARBLE,
  },
  {
    id: "shaft-neck",
    layer: "tower",
    nameEs: "Cuello de la torre",
    nameEn: "Tower neck",
    scientific: "Collum",
    descriptionEs: "Estrechamiento bajo el mirador. Prepara la cubierta de observación.",
    descriptionEn: "The narrowing under the lookout. It prepares the observation deck.",
    aliases: ["neck", "cuello", "collar"],
    color: "#ebe4d8",
  },
  {
    id: "elevator-shaft",
    layer: "tower",
    nameEs: "Hueco del ascensor",
    nameEn: "Elevator shaft",
    scientific: "Puteus elevatoris",
    descriptionEs:
      "Vacío vertical interior. Sube visitantes al mirador; en el edificio real convive con murales de Vela Zanetti.",
    descriptionEn:
      "The interior vertical void. It lifts visitors to the lookout; in the real building it shares the core with Vela Zanetti’s murals.",
    culturalEs:
      "Los murales de Vela Zanetti (no modelados aquí) narran trabajo y pueblo. El hueco no es solo máquina: es el recorrido pedagógico del edificio.",
    culturalEn:
      "Vela Zanetti’s murals (not modeled here) speak of labor and people. The shaft is not only a machine: it is the building’s teaching path.",
    aliases: ["elevator", "ascensor", "shaft", "interior", "vela zanetti"],
    color: "#5c6572",
  },
  {
    id: "observation-deck",
    layer: "lookout",
    nameEs: "Cubierta de observación",
    nameEn: "Observation deck",
    scientific: "Specula",
    descriptionEs: "Piso del mirador. Desde aquí Santiago se vuelve mapa: río, tejados y el anillo de cerros.",
    descriptionEn: "The lookout floor. From here Santiago becomes a map: river, roofs, and the ring of hills.",
    culturalEs:
      "Subir es un gesto cívico repetido en escuelas y visitas. El mirador enseña la ciudad, no un panorama de postal.",
    culturalEn:
      "The climb is a civic habit of school groups and visits. The deck teaches the city, not a postcard panorama.",
    aliases: ["deck", "mirador", "lookout", "observation", "specula"],
    color: STONE,
  },
  {
    id: "crown-lantern",
    layer: "lookout",
    nameEs: "Linterna / corona",
    nameEn: "Lantern crown",
    scientific: "Tholus",
    descriptionEs: "Remate sobre el mirador. Cierra la vertical y recibe el asta.",
    descriptionEn: "The cap above the lookout. It closes the vertical and receives the flagpole.",
    aliases: ["crown", "lantern", "linterna", "corona", "tholus"],
    color: MARBLE,
  },
  {
    id: "flagpole",
    layer: "lookout",
    nameEs: "Asta y bandera",
    nameEn: "Flagpole and flag",
    scientific: "Hasta vexilli",
    descriptionEs: "Asta en el eje. La bandera dominicana marca que el homenaje es republicano, no dinástico.",
    descriptionEn: "A pole on axis. The Dominican flag marks the tribute as republican, not dynastic.",
    culturalEs:
      "Después de 1961 el nombre y la bandera reorientan un edificio nacido bajo la dictadura. El asta es esa corrección visible.",
    culturalEn:
      "After 1961 the name and the flag reorient a building born under dictatorship. The pole is that visible correction.",
    aliases: ["flag", "bandera", "asta", "flagpole", "tricolor"],
    color: METAL,
  },
  {
    id: "figure-luperon",
    layer: "sculptures",
    nameEs: "Gregorio Luperón",
    nameEn: "Gregorio Luperón",
    scientific: "General de la Restauración",
    descriptionEs:
      "Figura simplificada del general puertoplateño. Luperón fue el jefe militar más visible de la guerra y luego presidente.",
    descriptionEn:
      "A simplified figure of the Puerto Plata general. Luperón was the war’s most visible military leader and later president.",
    culturalEs:
      "No es un santo de bronce: fue un político con contradicciones. El monumento lo coloca como eje de una guerra colectiva.",
    culturalEn:
      "Not a bronze saint: he was a politician with contradictions. The monument sets him as an axis of a collective war.",
    aliases: ["luperon", "luperón", "gregorio", "general", "puerto plata"],
    color: BRONZE,
  },
  {
    id: "figure-rodriguez",
    layer: "sculptures",
    nameEs: "Santiago Rodríguez",
    nameEn: "Santiago Rodríguez",
    scientific: "Grito de Capotillo, 16 ago 1863",
    descriptionEs:
      "Figura del militar que encabezó el alzamiento en Capotillo. Ese grito abre la Guerra de la Restauración.",
    descriptionEn:
      "Figure of the officer who led the rising at Capotillo. That cry opens the Restoration War.",
    culturalEs:
      "El 16 de agosto es feriado nacional porque un grupo pequeño en la frontera norte encendió una guerra de dos años.",
    culturalEn:
      "16 August is a national holiday because a small group on the northern border lit a two-year war.",
    aliases: ["santiago rodriguez", "rodríguez", "capotillo", "grito"],
    color: BRONZE,
  },
  {
    id: "figure-polanco",
    layer: "sculptures",
    nameEs: "Gaspar Polanco",
    nameEn: "Gaspar Polanco",
    scientific: "General restaurador",
    descriptionEs:
      "Figura de Polanco, general del Cibao. Participó en la toma y defensa de Santiago durante la guerra.",
    descriptionEn:
      "Figure of Polanco, a Cibao general. He took part in the seizure and defense of Santiago during the war.",
    culturalEs:
      "Santiago no fue telón de fondo: fue teatro de combate. Polanco ancla el monumento a esa ciudad concreta.",
    culturalEn:
      "Santiago was not a backdrop; it was a combat theater. Polanco anchors the monument to that city.",
    aliases: ["polanco", "gaspar", "general", "cibao"],
    color: BRONZE,
  },
  {
    id: "figure-salcedo",
    layer: "sculptures",
    nameEs: "José Antonio Salcedo",
    nameEn: "José Antonio Salcedo",
    scientific: "Presidente restaurador",
    descriptionEs:
      "Figura de Salcedo, primer presidente del gobierno restaurador. Encarnó la pretensión de un Estado, no solo una guerrilla.",
    descriptionEn:
      "Figure of Salcedo, first president of the Restoration government. He stood for a claim to a state, not only a guerrilla.",
    culturalEs:
      "La Restauración peleó y también gobernó. Salcedo recuerda que había diplomacia y administración en medio del fusil.",
    culturalEn:
      "The Restoration fought and also governed. Salcedo recalls diplomacy and administration beside the rifle.",
    aliases: ["salcedo", "josé antonio", "presidente", "restaurador"],
    color: BRONZE,
  },
  {
    id: "figure-moncion",
    layer: "sculptures",
    nameEs: "Benito Monción",
    nameEn: "Benito Monción",
    scientific: "General del norte",
    descriptionEs:
      "Figura de Monción, general de las campañas del norte. Su nombre quedó en pueblos y memoria fronteriza.",
    descriptionEn:
      "Figure of Monción, a general of the northern campaigns. His name remains in towns and border memory.",
    aliases: ["moncion", "monción", "benito", "norte"],
    color: BRONZE,
  },
  {
    id: "figure-pimentel",
    layer: "sculptures",
    nameEs: "Pedro Antonio Pimentel",
    nameEn: "Pedro Antonio Pimentel",
    scientific: "Presidente restaurador",
    descriptionEs:
      "Figura de Pimentel, militar y presidente breve de la Restauración, ligado al Cibao.",
    descriptionEn:
      "Figure of Pimentel, a soldier and brief Restoration president, tied to the Cibao.",
    aliases: ["pimentel", "pedro antonio", "presidente"],
    color: BRONZE,
  },
  {
    id: "figure-victory",
    layer: "sculptures",
    nameEs: "Victoria (alegoría)",
    nameEn: "Victory (allegory)",
    scientific: "Victoria restituta",
    descriptionEs:
      "Cuerpo alegórico, no un retrato. Representa el triunfo de 1865, cuando España abandonó la anexión.",
    descriptionEn:
      "An allegorical body, not a portrait. It stands for the 1865 outcome, when Spain abandoned reannexation.",
    culturalEs:
      "Las alegorías pueden borrar nombres de gente común. Aquí se lee junto a las figuras de oficiales, no en su lugar.",
    culturalEn:
      "Allegory can erase ordinary names. Here it is read beside officer figures, not instead of them.",
    aliases: ["victory", "victoria", "alegoría", "allegory", "1865"],
    color: BRONZE,
  },
  {
    id: "figure-pueblo",
    layer: "sculptures",
    nameEs: "El pueblo en armas",
    nameEn: "The people in arms",
    scientific: "Plebs armata",
    descriptionEs:
      "Figura anónima: campesinos, mujeres de retaguardia, milicianos sin retrato. La guerra no fue solo de generales.",
    descriptionEn:
      "An anonymous figure: peasants, women in the rear, militias without portraits. The war was not only generals.",
    culturalEs:
      "Un monumento de héroes peca si olvida al común. Esta pieza nombra esa ausencia a propósito.",
    culturalEn:
      "A heroes’ monument fails if it forgets ordinary people. This piece names that absence on purpose.",
    aliases: ["pueblo", "people", "militia", "campesino", "anonymous"],
    color: BRONZE,
  },
];

export const PARTS: AtlasPart[] = [...CORE_PARTS, ...sideParts(), ...columnParts()];

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
