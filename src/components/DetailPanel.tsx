import { ScanSearch, X } from "lucide-react";
import { PART_BY_ID, partCultural, partDescription, partLabel } from "@/data/parts";
import { t } from "@/data/i18n";
import { Button } from "@/components/ui/button";
import { useAtlas } from "@/state/atlas-store";

export function DetailPanel() {
  const { locale, selectedId, setSelectedId, isolated, setIsolated } = useAtlas();
  const copy = t(locale);
  const part = selectedId ? PART_BY_ID[selectedId] : null;
  const cultural = part ? partCultural(part, locale) : undefined;

  return (
    <aside className="panel-surface flex max-h-[46vh] flex-col rounded-3xl p-4 md:max-h-[min(72vh,40rem)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-gold/80 uppercase">{copy.selected}</p>
          <h2 className="font-display text-2xl leading-tight">
            {part ? partLabel(part, locale) : copy.appName}
          </h2>
        </div>
        {part ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setSelectedId(null)}
            aria-label={copy.close}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      {part ? (
        <div className="scrollbar-thin space-y-3 overflow-auto pr-1 text-sm leading-relaxed">
          <p className="font-display text-gold italic">{part.scientific}</p>
          {locale === "es" ? (
            <p className="text-xs text-muted">{part.nameEn}</p>
          ) : (
            <p className="text-xs text-muted">{part.nameEs}</p>
          )}
          <p className="text-cream/90">{partDescription(part, locale)}</p>
          {cultural ? (
            <div className="rounded-2xl bg-ink/40 p-3">
              <p className="mb-1 text-[10px] tracking-wide text-gold/80 uppercase">
                {copy.culturalNote}
              </p>
              <p className="text-cream/85">{cultural}</p>
            </div>
          ) : null}
          <Button
            variant={isolated ? "gold" : "outline"}
            size="sm"
            onClick={() => setIsolated(!isolated)}
          >
            <ScanSearch className="size-3.5" />
            {copy.isolate}
          </Button>
        </div>
      ) : (
        <div className="space-y-3 text-sm leading-relaxed text-cream/80">
          <p>{copy.tapHint}</p>
          <p className="font-display text-gold italic">{copy.plantScientific}</p>
          <p className="text-xs text-muted">
            {copy.family} · {copy.region}
          </p>
          <p className="text-xs text-muted">{copy.tainoNote}</p>
        </div>
      )}
    </aside>
  );
}
