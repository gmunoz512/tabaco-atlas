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
  const { locale, selectedId, explode } = useAtlas();
  const hideChrome = explode > 0.2;

  useEffect(() => {
    const next = t(locale);
    document.documentElement.lang = locale;
    document.title = next.documentTitle;
  }, [locale]);

  useEffect(() => {
    if (hideChrome) setDockOpen(false);
  }, [hideChrome]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDockOpen(false);
      }
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        if (!hideChrome) {
          setDockOpen(true);
          window.setTimeout(() => document.getElementById("atlas-search")?.focus(), 0);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hideChrome]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#8eb8dc]">
      <MonumentScene />
      {dockOpen && !hideChrome ? (
        <button
          type="button"
          className="pointer-events-auto absolute inset-0 z-10 bg-ink/30 md:hidden"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setDockOpen(false)}
        />
      ) : null}
      <div className={`chrome-fade ${hideChrome ? "chrome-fade-hidden" : ""}`}>
        <Header />
      </div>
      <ControlDock
        open={dockOpen && !hideChrome}
        onOpen={() => {
          if (!hideChrome) setDockOpen(true);
        }}
        onClose={() => setDockOpen(false)}
      />
      <div
        className={`pointer-events-auto absolute right-3 bottom-16 left-3 z-20 md:top-24 md:right-4 md:bottom-auto md:left-auto md:w-[24rem] chrome-fade ${
          selectedId && !hideChrome ? "block" : "hidden"
        } ${hideChrome ? "chrome-fade-hidden" : ""}`}
      >
        <DetailPanel />
      </div>
      <div className={`chrome-fade ${hideChrome ? "chrome-fade-hidden" : ""}`}>
        <Footer />
      </div>
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
