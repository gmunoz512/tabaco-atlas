import { useEffect, useState } from "react";
import { ControlDock } from "@/components/ControlDock";
import { DetailPanel } from "@/components/DetailPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlantScene } from "@/components/plant/PlantScene";
import { t } from "@/data/i18n";
import { AtlasProvider, useAtlas } from "@/state/atlas-store";

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, selectedId } = useAtlas();

  useEffect(() => {
    const copy = t(locale);
    document.title =
      locale === "es"
        ? `${copy.appName} — explorador botánico 3D`
        : `${copy.appName} — 3D botanical explorer`;
  }, [locale]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-ink">
      <PlantScene />
      <Header />
      <ControlDock mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen((open) => !open)} />
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
