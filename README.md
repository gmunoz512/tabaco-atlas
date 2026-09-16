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
- Interface loads in English first, with an EN/ES toggle. The product name is **El Anatomy** in both languages. Dominican / Caribbean notes stay in the English detail copy.

## Requisitos

Node.js 22 o superior. No hace falta cuenta ni clave de API.

```sh
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) (redirige a `/tabaco-atlas/`).

```sh
npm run typecheck
npm run build
```

La salida estática queda en `dist/`. `npm run preview` sirve esa carpeta.

## Contenido

El modelo es una planta simplificada, creíble en estructura (raíz pivotante y laterales, tallo velloso, hojas ovadas en espiral, panoja de flores tubulares), no un herbario a escala. Los nombres agrícolas del valle del Cibao (*bajera*, *seco/viso*, *ligero*) se usan como vocabulario de altura en la planta, no como grados de producto.

La geometría se genera en Three.js (primitivas y curvas). No se incluyen mallas comerciales.

## Despliegue

Sitio público (GitHub Pages): [https://gmunoz512.github.io/tabaco-atlas/](https://gmunoz512.github.io/tabaco-atlas/)

`vite.config.ts` usa `base: "/tabaco-atlas/"`. El workflow `.github/workflows/pages.yml` ejecuta `npm ci` / `npm run build`, publica `dist/` en la rama `gh-pages` y despliega con `actions/deploy-pages`. Fuente de Pages: GitHub Actions, o la rama `gh-pages` (carpeta `/`). Si GitHub aún no tiene Pages activado en el repositorio, actívalo una vez en Settings → Pages.

En local, `npm run dev` y `npm run preview` redirigen `/` a `/tabaco-atlas/`. `vercel.json` sigue sirviendo `dist/` si se usa Vercel.

## Licencia

MIT. Inspiración de patrón de producto: [Human Atlas](https://github.com/ashemag/human-atlas) (MIT). Las notas culturales son educativas y no sustituyen fuentes históricas o agronómicas primarias.
