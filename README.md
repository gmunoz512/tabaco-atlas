# El Anatomy

3D architectural explorer of the **Monumento a los Héroes de la Restauración** in Santiago de los Caballeros — commonly *el Monumento*. Orbit the tower, select plaza, stairs, pedestal, columns, shaft, sculptures, and lookout, hide layers, and explode the pieces into an inventory.

The product follows a Human Atlas–style pattern (orbit, layers, search, detail card, separated inventory). It is not a clone: the geometry is procedural and the subject is Santiago’s civic tower.

**This is education about a public monument and the Restoration War (1863–1865).** It is not tourism advertising. The building opened in 1953 under a different name; after 1961 the city dedicated it to Restoration heroes.

## Explore

- Orbit, zoom, and tap a part to select it.
- Toggle layers: plaza & stairs, pedestal, columns, tower, sculptures, lookout.
- Search by English or Spanish name, hero, or architectural term.
- Separate the visible pieces to inventory them (dozens of named parts).
- Read the card: plain description and a Dominican historical note when it applies.
- Interface loads in **English** first, with an EN/ES toggle. The product name is **El Anatomy** in both languages.

## Requirements

Node.js 22 or newer. No account or API key.

```sh
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (redirects to `/tabaco-atlas/`).

```sh
npm run typecheck
npm run build
```

Static output is in `dist/`. `npm run preview` serves that folder.

## Content

The model is a simplified, credible structure (esplanade and stairs, pedestal, colonnade, stacked shaft, openings, elevator void, lookout, flag, and named sculptural groups). It is not a measured survey. Hero figures are schematic bronze forms with historical names, not portraits.

Geometry is generated in Three.js (boxes, cylinders, stacked steps). No commercial meshes.

## Deploy

Public site (GitHub Pages): [https://gmunoz512.github.io/tabaco-atlas/](https://gmunoz512.github.io/tabaco-atlas/)

`vite.config.ts` uses `base: "/tabaco-atlas/"`. The workflow `.github/workflows/pages.yml` runs `npm ci` / `npm run build`, publishes `dist/` to the `gh-pages` branch, and deploys with `actions/deploy-pages`. Pages source: GitHub Actions, or branch `gh-pages` (folder `/`).

Locally, `npm run dev` and `npm run preview` redirect `/` to `/tabaco-atlas/`.

## License

MIT. Product-pattern inspiration: [Human Atlas](https://github.com/ashemag/human-atlas) (MIT). Historical notes are educational and do not replace primary sources on the Restoration War or the building’s later rededication.
