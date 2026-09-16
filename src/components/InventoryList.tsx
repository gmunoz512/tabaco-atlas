import { LAYERS, LAYER_IDS, PARTS, partLabel } from "@/data/parts";
import { t } from "@/data/i18n";
import { useAtlas } from "@/state/atlas-store";

export function InventoryList() {
  const { locale, selectedId, setSelectedId, layers, visibleParts } = useAtlas();
  const copy = t(locale);

  return (
    <section className="min-h-0 flex-1">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-[11px] tracking-[0.18em] text-gold/80 uppercase">{copy.inventory}</h2>
        <p className="text-[11px] text-muted">
          {visibleParts.length} {copy.partsVisible}
        </p>
      </div>
      <div className="scrollbar-thin max-h-[28vh] space-y-3 overflow-auto pr-1 md:max-h-[36vh]">
        {LAYER_IDS.map((layerId) => {
          const layerParts = PARTS.filter((part) => part.layer === layerId);
          const layer = LAYERS[layerId];
          const hidden = !layers[layerId];
          return (
            <div key={layerId} className={hidden ? "opacity-40" : ""}>
              <p className="mb-1 text-[10px] tracking-wide text-muted uppercase">
                {locale === "es" ? layer.nameEs : layer.nameEn}
              </p>
              <ul className="space-y-1">
                {layerParts.map((part) => (
                  <li key={part.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(part.id)}
                      className={`w-full rounded-xl px-2 py-1.5 text-left text-sm ${
                        selectedId === part.id ? "bg-gold/18 text-gold" : "hover:bg-white/5"
                      }`}
                    >
                      {partLabel(part, locale)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
