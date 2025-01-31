import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useState, useCallback, memo } from "react";
import RelicTable from "@/components/RelicTable";
import useFetchRelics from "@/hooks/useFetchRelics";
import useFilterRelics from "@/hooks/useFilterRelics";

export const Route = createFileRoute("/")({
  component: App,
});

import "@/App.css";

const MemoizedRelicTable = memo(RelicTable);

function App() {
  const { relicData, isLoading } = useFetchRelics();
  const [searchInput, setSearchInput] = useState("");
  const deferredSearchInput = useDeferredValue(searchInput);
  const [selectedRelicsDisplayCount, setSelectedRelicsDisplayCount] =
    useState("10");

  // Use the filterRelics function to filter relics by search input,
  const filteredRelics = useFilterRelics(relicData, deferredSearchInput);

  // Debounced search input handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value),
    [],
  );

  return (
    <main>
      <h1 id="title">Warframe Relic LFG</h1>
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="search">
              Search
              <input
                type="text"
                name="search"
                id="search"
                value={searchInput}
                onChange={handleSearchChange}
              />
            </label>
            {deferredSearchInput.length >= 2 && (
              <span>Found {filteredRelics.length} relics</span>
            )}
          </div>
          <label htmlFor="relics-display-count">
            Relics to display
            <select
              name="relics-display-count"
              id="relics-display-count"
              value={selectedRelicsDisplayCount}
              onChange={(e) => setSelectedRelicsDisplayCount(e.target.value)}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="all">all</option>
            </select>
          </label>
        </form>
      </div>
      <table className="results-grid">
        <thead>
          <tr>
            <th>Relic Name</th>
            <th>Tier</th>
            <th>Rewards</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && (
            <MemoizedRelicTable
              relicData={filteredRelics.slice(
                0,
                selectedRelicsDisplayCount === "all"
                  ? relicData.length
                  : Number.parseInt(selectedRelicsDisplayCount),
              )}
              searchInput={deferredSearchInput}
            />
          )}
        </tbody>
      </table>
      <a href="#title" className="back-to-top">
        <span className="sr-only">Back to top</span>
        &uarr;
      </a>
    </main>
  );
}

export default App;
