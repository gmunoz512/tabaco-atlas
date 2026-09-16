# El Anatomy

Explorador botánico 3D de *Nicotiana tabacum* (tabaco), pensado para un público dominicano y caribeño. Orbita la planta, selecciona raíces, tallo, hojas y flor, oculta capas y separa las piezas en una vista explosionada.

El producto sigue el patrón de un atlas humano exploratorio (órbita, capas, búsqueda, ficha y inventario separado). No es un clon: la geometría es procedural y el tema es la planta de tabaco, no la anatomía humana.

**Esto es educación sobre la planta.** No es consejo médico ni agronómico, ni publicidad de cigarros o de fumar.

## Explorar

- Orbita, zoom y toca una parte para seleccionarla.
- Alterna capas: raíces, tallo, hojas, flor.
- Busca por nombre común (ES/EN) o científico.
- Separa las piezas visibles para inventariarlas.
- Lee la ficha: nombre, descripción llana y nota cultural dominicana/caribeña cuando aplica.
- Interfaz en español primero, con conmutador ES/EN. El nombre del producto es **El Anatomy** en ambos idiomas.

## Requisitos

Node.js 22 o superior. No hace falta cuenta ni clave de API.

```sh
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

```sh
npm run typecheck
npm run build
```

La salida estática queda en `dist/`. `npm run preview` sirve esa carpeta.

## Contenido

El modelo es una planta simplificada, creíble en estructura (raíz pivotante y laterales, tallo velloso, hojas ovadas en espiral, panoja de flores tubulares), no un herbario a escala. Los nombres agrícolas del valle del Cibao (*bajera*, *seco/viso*, *ligero*) se usan como vocabulario de altura en la planta, no como grados de producto.

La geometría se genera en Three.js (primitivas y curvas). No se incluyen mallas comerciales.

## Despliegue

Proyecto Vite. En Vercel, el `vercel.json` ya apunta a `npm ci`, `npm run build` y `dist/`.

## Licencia

MIT. Inspiración de patrón de producto: [Human Atlas](https://github.com/ashemag/human-atlas) (MIT). Las notas culturales son educativas y no sustituyen fuentes históricas o agronómicas primarias.
