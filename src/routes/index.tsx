import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useState, useCallback, memo } from "react";
import RelicTable from "@/components/RelicTable";
import useFetchRelics from "@/hooks/useFetchRelics"; // Adjust the path as necessary
import useFilterRelics from "@/hooks/useFilterRelics"; // Adjust the path as necessary

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
    useState("10"); // Consider moving this to query params

  // Use the filterRelics function to get the filtered relic table data
  const relicTableData = useFilterRelics(relicData, deferredSearchInput);

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
              <span>Found {relicTableData.length} relics</span>
            )}
          </div>
          <label htmlFor="relicsDisplayCount">
            Relics to display
            <select
              name="relicsDisplayCount"
              id="relicsDisplayCount"
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
      <table>
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
              relicData={relicTableData}
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
