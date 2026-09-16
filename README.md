# Monumento's Anatomy

3D architectural explorer of the **Monumento a los Héroes de la Restauración** in Santiago de los Caballeros — commonly *el Monumento*. Orbit the tower, select plaza, podium, colonnade, attic, shaft, and lookout, hide layers, and explode the pieces into an inventory.

Spanish UI name: **Anatomía del Monumento**. English default. The product is not El Anatomy and not Tabaco Atlas.

The product follows a Human Atlas–style pattern (orbit, layers, search, detail card, separated inventory). Geometry is procedural Three.js, aimed at the real silhouette: grey podium and gates, cream colonnade, attic arches, spiraled cylindrical shaft, circular balcony, and the bronze Angel of Peace.

**This is education about a public monument and the Restoration War (1863–1865).** It is not tourism advertising. The building opened in 1953 under a different name; after 1961 the city dedicated it to Restoration heroes.

## Explore

- Orbit, zoom, and tap a part to select it.
- Toggle layers: plaza & stairs, podium, colonnade, attic, shaft, lookout.
- Search by English or Spanish name, hero, or architectural term.
- Separate the visible pieces to inventory them (dozens of named parts).
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

The model is a simplified but credible structure matching the monument’s stacked silhouette (not a measured survey). The Angel of Peace and Restoration emblems are schematic, not portraits.

## Deploy

Public site (GitHub Pages): [https://gmunoz512.github.io/tabaco-atlas/](https://gmunoz512.github.io/tabaco-atlas/)

`vite.config.ts` uses `base: "/tabaco-atlas/"`. The workflow publishes `dist/` to `gh-pages`.

## License

MIT. Product-pattern inspiration: [Human Atlas](https://github.com/ashemag/human-atlas) (MIT). Historical notes are educational and do not replace primary sources.
