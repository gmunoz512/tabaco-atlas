import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LAYER_IDS, PART_BY_ID, PARTS, type LayerId, type Locale } from "@/data/parts";
import { rankSearchResults } from "@/lib/search";

export type LayerVisibility = Record<LayerId, boolean>;

interface AtlasContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  layers: LayerVisibility;
  toggleLayer: (id: LayerId) => void;
  setLayer: (id: LayerId, visible: boolean) => void;
  explode: number;
  setExplode: (value: number) => void;
  exploded: boolean;
  isolated: boolean;
  setIsolated: (value: boolean) => void;
  query: string;
  setQuery: (value: string) => void;
  resetViewToken: number;
  requestResetView: () => void;
  webglStatus: string;
  setWebglStatus: (value: string) => void;
  isPartVisible: (id: string) => boolean;
  visibleParts: typeof PARTS;
  searchResults: typeof PARTS;
}

const AtlasContext = createContext<AtlasContextValue | null>(null);

const ALL_VISIBLE = Object.fromEntries(LAYER_IDS.map((id) => [id, true])) as LayerVisibility;

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [selectedId, setSelectedIdState] = useState<string | null>(null);
  const [layers, setLayers] = useState<LayerVisibility>(ALL_VISIBLE);
  const [explode, setExplode] = useState(0);
  const [isolated, setIsolated] = useState(false);
  const [query, setQuery] = useState("");
  const [resetViewToken, setResetViewToken] = useState(0);
  const [webglStatus, setWebglStatus] = useState("");

  const setSelectedId = useCallback((id: string | null) => {
    setSelectedIdState(id);
    if (!id) setIsolated(false);
  }, []);

  const toggleLayer = useCallback((id: LayerId) => {
    setLayers((current) => {
      const next = { ...current, [id]: !current[id] };
      setSelectedIdState((selected) => {
        if (!selected) return selected;
        const part = PART_BY_ID[selected];
        return part && !next[part.layer] ? null : selected;
      });
      return next;
    });
  }, []);

  const setLayer = useCallback((id: LayerId, visible: boolean) => {
    setLayers((current) => ({ ...current, [id]: visible }));
  }, []);

  const requestResetView = useCallback(() => {
    setResetViewToken((token) => token + 1);
  }, []);

  const isPartVisible = useCallback(
    (id: string) => {
      const part = PART_BY_ID[id];
      if (!part || !layers[part.layer]) return false;
      if (isolated && selectedId) return id === selectedId;
      return true;
    },
    [isolated, layers, selectedId],
  );

  const visibleParts = useMemo(
    () => PARTS.filter((part) => isPartVisible(part.id)),
    [isPartVisible],
  );

  const searchResults = useMemo(() => rankSearchResults(PARTS, query), [query]);
  const exploded = explode > 0.12;

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      selectedId,
      setSelectedId,
      layers,
      toggleLayer,
      setLayer,
      explode,
      setExplode,
      exploded,
      isolated,
      setIsolated,
      query,
      setQuery,
      resetViewToken,
      requestResetView,
      webglStatus,
      setWebglStatus,
      isPartVisible,
      visibleParts,
      searchResults,
    }),
    [
      explode,
      exploded,
      isPartVisible,
      isolated,
      layers,
      locale,
      query,
      requestResetView,
      resetViewToken,
      searchResults,
      selectedId,
      setSelectedId,
      toggleLayer,
      visibleParts,
      webglStatus,
    ],
  );

  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
}

export function useAtlas() {
  const context = useContext(AtlasContext);
  if (!context) {
    throw new Error("useAtlas must be used within AtlasProvider");
  }
  return context;
}
