import { Search } from "lucide-react";
import { LAYERS, partLabel } from "@/data/parts";
import { t } from "@/data/i18n";
import { Input } from "@/components/ui/input";
import { useAtlas } from "@/state/atlas-store";

export function SearchPanel() {
  const { locale, query, setQuery, searchResults, setSelectedId, selectedId, layers } = useAtlas();
  const copy = t(locale);
  const showResults = query.trim().length > 0;

  return (
    <div className="space-y-2">
      <label className="relative block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-cream/40" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.searchPlaceholder}
          className="pl-9"
          aria-label={copy.searchPlaceholder}
        />
      </label>
      {showResults ? (
        <ul className="scrollbar-thin max-h-40 space-y-1 overflow-auto pr-1">
          {searchResults.length === 0 ? (
            <li className="px-2 py-2 text-xs text-muted">{copy.searchEmpty}</li>
          ) : (
            searchResults.map((part) => {
              const hidden = !layers[part.layer];
              return (
                <li key={part.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(part.id)}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${
                      selectedId === part.id ? "bg-gold/20 text-gold" : "hover:bg-white/5"
                    } ${hidden ? "opacity-40" : ""}`}
                  >
                    <span>
                      <span className="block">{partLabel(part, locale)}</span>
                      <span className="block font-display text-[11px] text-muted italic">
                        {part.scientific}
                      </span>
                    </span>
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: LAYERS[part.layer].swatch }}
                    />
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
