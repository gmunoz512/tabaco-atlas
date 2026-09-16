import { Eye, EyeOff } from "lucide-react";
import { LAYERS, LAYER_IDS } from "@/data/parts";
import { t } from "@/data/i18n";
import { useAtlas } from "@/state/atlas-store";

export function LayerToggles() {
  const { locale, layers, toggleLayer } = useAtlas();
  const copy = t(locale);

  return (
    <section>
      <h2 className="mb-2 text-[11px] tracking-[0.18em] text-gold/80 uppercase">{copy.layers}</h2>
      <div className="grid grid-cols-2 gap-2">
        {LAYER_IDS.map((id) => {
          const layer = LAYERS[id];
          const on = layers[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleLayer(id)}
              aria-pressed={on}
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-left transition ${
                on ? "border-cream/15 bg-white/6" : "border-cream/8 bg-ink/30 opacity-60"
              }`}
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: layer.swatch }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm">{locale === "es" ? layer.nameEs : layer.nameEn}</span>
                <span className="block text-[10px] text-muted">
                  {locale === "es" ? layer.hintEs : layer.hintEn}
                </span>
              </span>
              {on ? (
                <Eye className="size-3.5 text-cream/50" aria-hidden />
              ) : (
                <EyeOff className="size-3.5 text-cream/40" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
