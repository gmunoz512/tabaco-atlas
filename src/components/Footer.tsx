import { t } from "@/data/i18n";
import { useAtlas } from "@/state/atlas-store";

export function Footer() {
  const { locale, webglStatus } = useAtlas();
  const copy = t(locale);

  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-2 md:p-3">
      <div className="pointer-events-auto mx-auto max-w-2xl rounded-full border border-cream/10 bg-ink/65 px-3 py-1.5 text-center text-[10px] leading-snug text-muted backdrop-blur-md md:text-[11px]">
        <p>
          {copy.orbitHint}
          {webglStatus ? (
            <span className="ml-2 font-mono text-[9px] tracking-[0.12em] text-cream/45"> · {webglStatus}</span>
          ) : null}
        </p>
      </div>
    </footer>
  );
}
