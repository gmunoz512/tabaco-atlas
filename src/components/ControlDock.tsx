import { Layers, SplitSquareHorizontal } from "lucide-react";
import { t } from "@/data/i18n";
import { Button } from "@/components/ui/button";
import { InventoryList } from "@/components/InventoryList";
import { LayerToggles } from "@/components/LayerToggles";
import { SearchPanel } from "@/components/SearchPanel";
import { useAtlas } from "@/state/atlas-store";

interface ControlDockProps {
  mobileOpen: boolean;
  onToggleMobile: () => void;
}

export function ControlDock({ mobileOpen, onToggleMobile }: ControlDockProps) {
  const { locale, exploded, setExploded } = useAtlas();
  const copy = t(locale);

  return (
    <>
      <div className="pointer-events-auto absolute bottom-16 left-3 z-20 flex gap-2 md:hidden">
        <Button variant="outline" size="sm" onClick={onToggleMobile}>
          <Layers className="size-3.5" />
          {copy.layers}
        </Button>
        <Button
          variant={exploded ? "gold" : "outline"}
          size="sm"
          onClick={() => setExploded(!exploded)}
        >
          <SplitSquareHorizontal className="size-3.5" />
          {exploded ? copy.explodeOff : copy.explodeOn}
        </Button>
      </div>

      <aside
        className={`panel-surface absolute top-24 right-3 left-3 z-20 flex max-h-[58vh] flex-col gap-4 overflow-hidden rounded-3xl p-4 md:top-4 md:right-auto md:bottom-16 md:left-4 md:max-h-[min(78vh,46rem)] md:w-[22.5rem] ${
          mobileOpen ? "flex" : "hidden md:flex"
        }`}
      >
        <SearchPanel />
        <LayerToggles />
        <div className="hidden md:block">
          <Button
            variant={exploded ? "gold" : "outline"}
            className="w-full"
            onClick={() => setExploded(!exploded)}
          >
            <SplitSquareHorizontal className="size-4" />
            {exploded ? copy.explodeOff : copy.explodeOn}
            <span className="text-xs opacity-70">— {copy.explode}</span>
          </Button>
        </div>
        <InventoryList />
      </aside>
    </>
  );
}
