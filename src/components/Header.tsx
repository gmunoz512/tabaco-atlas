import { RotateCcw } from "lucide-react";
import { t } from "@/data/i18n";
import { Button } from "@/components/ui/button";
import { useAtlas } from "@/state/atlas-store";

export function Header() {
  const { locale, setLocale, requestResetView } = useAtlas();
  const copy = t(locale);

  return (
    <header className="pointer-events-none absolute top-0 right-0 z-30 flex items-start justify-end gap-2 p-3 md:p-4">
      <div className="pointer-events-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={requestResetView}
          aria-label={copy.resetView}
          title={copy.resetView}
        >
          <RotateCcw className="size-4" />
        </Button>
        <div className="panel-surface flex rounded-full p-1" role="group" aria-label={copy.language}>
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`rounded-full px-3 py-1.5 text-xs ${
              locale === "en" ? "bg-gold text-ink" : "text-cream/80"
            }`}
            aria-pressed={locale === "en"}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLocale("es")}
            className={`rounded-full px-3 py-1.5 text-xs ${
              locale === "es" ? "bg-gold text-ink" : "text-cream/80"
            }`}
            aria-pressed={locale === "es"}
          >
            ES
          </button>
        </div>
      </div>
    </header>
  );
}
