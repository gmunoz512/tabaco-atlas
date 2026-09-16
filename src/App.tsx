import { useState } from "react";
import { ControlDock } from "@/components/ControlDock";
import { DetailPanel } from "@/components/DetailPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlantScene } from "@/components/plant/PlantScene";
import { AtlasProvider, useAtlas } from "@/state/atlas-store";

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selectedId } = useAtlas();

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-ink">
      <PlantScene />
      <Header />
      <ControlDock mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen((open) => !open)} />
      <div
        className={`pointer-events-auto absolute right-3 bottom-16 z-20 w-[min(100%-1.5rem,24rem)] md:top-24 md:right-4 md:bottom-auto ${
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
