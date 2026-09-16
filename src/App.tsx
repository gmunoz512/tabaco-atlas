import { useEffect, useState } from "react";
import { ControlDock } from "@/components/ControlDock";
import { DetailPanel } from "@/components/DetailPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MonumentScene } from "@/components/monument/MonumentScene";
import { t } from "@/data/i18n";
import { AtlasProvider, useAtlas } from "@/state/atlas-store";

function initialDockOpen() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 768px)").matches;
}

function Shell() {
  const [dockOpen, setDockOpen] = useState(initialDockOpen);
  const { locale, selectedId } = useAtlas();
  const copy = t(locale);

  useEffect(() => {
    const next = t(locale);
    document.documentElement.lang = locale;
    document.title = next.documentTitle;
  }, [locale]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDockOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-ink">
      <MonumentScene />
      {dockOpen ? (
        <button
          type="button"
          className="pointer-events-auto absolute inset-0 z-10 bg-ink/30 md:hidden"
          aria-label={copy.close}
          onClick={() => setDockOpen(false)}
        />
      ) : null}
      <Header />
      <ControlDock open={dockOpen} onOpen={() => setDockOpen(true)} onClose={() => setDockOpen(false)} />
      <div
        className={`pointer-events-auto absolute right-3 bottom-16 left-3 z-20 md:top-24 md:right-4 md:bottom-auto md:left-auto md:w-[24rem] ${
          selectedId ? "block" : "hidden md:block"
        }`}
      >
        <DetailPanel />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AtlasProvider>
      <Shell />
    </AtlasProvider>
  );
}
