import { Languages, RotateCcw } from "lucide-react";
import { t } from "@/data/i18n";
import { Button } from "@/components/ui/button";
import { useAtlas } from "@/state/atlas-store";

export function Header() {
  const { locale, setLocale, requestResetView } = useAtlas();
  const copy = t(locale);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 md:p-4">
      <div className="pointer-events-auto panel-surface max-w-[min(100%,28rem)] rounded-3xl px-4 py-3 md:px-5">
        <p className="font-display text-xl leading-none text-gold md:text-2xl">{copy.appName}</p>
        <p className="mt-1 text-xs text-muted md:text-sm">{copy.tagline}</p>
        <p className="mt-2 hidden text-[11px] leading-relaxed text-cream/70 sm:block">{copy.intro}</p>
      </div>
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
        <div className="panel-surface flex rounded-full p-1">
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
          <span className="sr-only">
            <Languages className="size-4" />
            {copy.language}
          </span>
        </div>
      </div>
    </header>
  );
}
