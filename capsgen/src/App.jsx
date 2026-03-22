import { useEffect, useMemo, useState } from "react";
import AppHeader from "./components/AppHeader.jsx";
import FilterPanel from "./components/FilterPanel.jsx";
import GeneratedTitleList from "./components/GeneratedTitleList.jsx";
import FavoritesPanel from "./components/FavoritesPanel.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import {
  DEFAULT_FILTERS,
  FILTER_OPTIONS,
  buildGenerationRequest,
  generateTitles,
  hydrateStoredResults,
  swapTokenValue,
} from "./engine/generator.ts";
import { usePersistentState } from "./hooks/usePersistentState.js";

const STORAGE_KEYS = {
  filters: "capsgen.filters.v2",
  generated: "capsgen.generated.v2",
  favorites: "capsgen.favorites.v2",
  history: "capsgen.history.v2",
  theme: "capsgen.theme.v1",
};

function App() {
  const [filters, setFilters] = usePersistentState(STORAGE_KEYS.filters, DEFAULT_FILTERS);
  const [generatedTitles, setGeneratedTitles] = usePersistentState(
    STORAGE_KEYS.generated,
    [],
    hydrateStoredResults
  );
  const [favoriteTitles, setFavoriteTitles] = usePersistentState(
    STORAGE_KEYS.favorites,
    [],
    hydrateStoredResults
  );
  const [historyTitles, setHistoryTitles] = usePersistentState(
    STORAGE_KEYS.history,
    [],
    hydrateStoredResults
  );
  const [theme, setTheme] = usePersistentState(STORAGE_KEYS.theme, "light");
  const [lastRequest, setLastRequest] = useState(() =>
    buildGenerationRequest(DEFAULT_FILTERS)
  );

  const availableOptions = useMemo(() => FILTER_OPTIONS, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const persistGeneratedSet = (nextResults, request) => {
    setGeneratedTitles(nextResults);
    setHistoryTitles((prev) => [...nextResults, ...prev].slice(0, 5));
    setLastRequest(request);
  };

  const runGeneration = (nextFilters) => {
    const request = buildGenerationRequest(nextFilters);
    const results = generateTitles(request);
    persistGeneratedSet(results, request);
  };

  const handleGenerate = () => {
    runGeneration(filters);
  };

  const handleRegenerate = () => {
    const request = buildGenerationRequest({
      ...filters,
      seed: filters.seed || `${Date.now()}`,
    });
    const results = generateTitles(request);
    persistGeneratedSet(results, request);
  };

  const handleFiltersChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleToggleFavorite = (result) => {
    setFavoriteTitles((prev) => {
      const exists = prev.some((entry) => entry.id === result.id);

      if (exists) {
        return prev.filter((entry) => entry.id !== result.id);
      }

      return [result, ...prev].slice(0, 18);
    });
  };

  const handleSwapToken = (resultId, token) => {
    setGeneratedTitles((prev) =>
      prev.map((result) => (result.id === resultId ? swapTokenValue(result, token) : result))
    );
    setFavoriteTitles((prev) =>
      prev.map((result) => (result.id === resultId ? swapTokenValue(result, token) : result))
    );
    setHistoryTitles((prev) =>
      prev.map((result) => (result.id === resultId ? swapTokenValue(result, token) : result))
    );
  };

  const favoriteIds = useMemo(
    () => new Set(favoriteTitles.map((item) => item.id)),
    [favoriteTitles]
  );

  const summaryItems = useMemo(
    () => [
      {
        label: "Generated",
        value: generatedTitles.length,
        accent: "sky",
      },
      {
        label: "Saved",
        value: favoriteTitles.length,
        accent: "mint",
      },
      {
        label: "History",
        value: historyTitles.length,
        accent: "sun",
      },
    ],
    [favoriteTitles.length, generatedTitles.length, historyTitles.length]
  );

  return (
    <div className="appShell">
      <AppHeader theme={theme} onToggleTheme={handleToggleTheme} />

      <main className="container py-4 pb-5">
        <section className="bentoGrid">
          <div className="bentoTile bentoTileTall bentoTileControls">
            <div className="bentoColumnStack">
              <FilterPanel
                filters={filters}
                options={availableOptions}
                onChange={handleFiltersChange}
                onGenerate={handleGenerate}
                onRegenerate={handleRegenerate}
                onReset={handleResetFilters}
              />

              <HistoryPanel results={historyTitles} />
            </div>
          </div>

          <div className="bentoTile bentoTileWide">
            <GeneratedTitleList
              results={generatedTitles}
              favoriteIds={favoriteIds}
              onSwapToken={handleSwapToken}
              onToggleFavorite={handleToggleFavorite}
              request={lastRequest}
            />
          </div>

          <div className="bentoTile bentoTileSummary">
            <section className="panelCard glassPanel summaryPanel h-100">
              <div className="panelInner">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h2 className="sectionTitle">Session Snapshot</h2>
                    <p className="sectionText mb-0">
                      Track output volume and keep the workspace feeling alive.
                    </p>
                  </div>
                  <span className="panelKicker">Live</span>
                </div>

                <div className="summaryStats">
                  {summaryItems.map((item) => (
                    <div key={item.label} className={`summaryStat summaryStat${item.accent}`}>
                      <span className="summaryValue">{item.value}</span>
                      <span className="summaryLabel">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="insightStrip">
                  <span>{lastRequest.domainLabel}</span>
                  <span>{lastRequest.technologyLabel}</span>
                  <span>{lastRequest.outputTypeLabel}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="bentoTile">
            <FavoritesPanel
              results={favoriteTitles}
              onSwapToken={handleSwapToken}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
