import { normalizeQuery } from "@/lib/utils";
import type { AtlasPart } from "@/data/parts";

export function partMatchesQuery(part: AtlasPart, query: string) {
  const needle = normalizeQuery(query);
  if (!needle) return true;

  const haystack = [
    part.nameEs,
    part.nameEn,
    part.scientific,
    part.layer,
    ...part.aliases,
  ]
    .map(normalizeQuery)
    .join(" ");

  return haystack.includes(needle);
}

export function rankSearchResults(parts: AtlasPart[], query: string) {
  const needle = normalizeQuery(query);
  if (!needle) return parts;

  return parts
    .filter((part) => partMatchesQuery(part, needle))
    .sort((a, b) => score(a, needle) - score(b, needle));
}

function score(part: AtlasPart, needle: string) {
  const names = [part.nameEs, part.nameEn, part.scientific, ...part.aliases].map(
    normalizeQuery,
  );
  if (names.some((name) => name === needle)) return 0;
  if (names.some((name) => name.startsWith(needle))) return 1;
  return 2;
}
