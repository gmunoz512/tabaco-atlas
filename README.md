# Monumento's Anatomy

3D architectural explorer of the **Monumento a los Héroes de la Restauración** in Santiago de los Caballeros — commonly *el Monumento*. Orbit the tower, select plaza, podium, colonnade, attic, shaft, and lookout, hide layers, and explode the pieces into an inventory.

Spanish UI name: **Anatomía del Monumento**. English default.

The product follows a Human Atlas–style *interaction* pattern (orbit, layers, search, detail card, exploded inventory). Geometry is procedural Three.js in a clean exhibit style: matte cream stone, soft metal accents, and a dark void — not photogrammetry, not a weathered scan, and not a human body atlas.

**This is education about a public monument and the Restoration War (1863–1865).** It is not tourism advertising. The building opened in 1953 under a different name; after 1961 the city dedicated it to Restoration heroes.

## Explore

- Orbit, zoom, and tap a part to select it.
- Toggle layers: plaza & stairs, podium, colonnade, attic, shaft, lookout.
- Search by English or Spanish name, hero, or architectural term. Press `/` to focus search.
- Separate the visible pieces with a slider (dozens of named parts).
- Read the card: plain description and a Dominican historical note when it applies.
- Interface loads in **English** first, with an EN/ES toggle.

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

The model is a simplified, idealized silhouette of the monument (not a measured survey). The Angel of Peace and Restoration emblems are schematic civic marks, not portraits.

## Deploy

Public site (GitHub Pages): [https://gmunoz512.github.io/tabaco-atlas/](https://gmunoz512.github.io/tabaco-atlas/)

`vite.config.ts` uses `base: "/tabaco-atlas/"`. The workflow publishes `dist/` to `gh-pages`.

## License

MIT. Product-pattern inspiration: [Human Atlas](https://github.com/ashemag/human-atlas) (MIT). Historical notes are educational and do not replace primary sources.
