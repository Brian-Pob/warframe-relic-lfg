import React, {
	useDeferredValue,
	useEffect,
	useState,
	useCallback,
	useMemo,
} from "react";
import { useFuzzySearchList } from "@nozbe/microfuzz/react";
import type { Relic, Item } from "./types/Relic";
import RelicTable from "./components/RelicTable";

import "./App.css";

const MemoizedRelicTable = React.memo(RelicTable);

function App() {
	const [relicData, setRelicData] = useState<Relic[]>([]);
	const [searchInput, setSearchInput] = useState("");
	const deferredSearchInput = useDeferredValue(searchInput);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedRelicsDisplayCount, setSelectedRelicsDisplayCount] =
		useState("10");

	// Memoized fetch function
	const fetchRelics = useCallback(async () => {
		try {
			const localRelics = localStorage.getItem("relics");
			if (localRelics) {
				setRelicData(JSON.parse(localRelics));
				setIsLoading(false);
				return;
			}

			const response = await fetch(
				"https://drops.warframestat.us/data/relics.json",
			);
			if (!response.ok) {
				throw new Error(`Response status ${response.status}`);
			}
			const { relics: relicsJson } = await response.json();
			localStorage.setItem("relics", JSON.stringify(relicsJson));
			setRelicData(relicsJson);
		} catch (error) {
			console.error("Error fetching relics:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRelics();
	}, [fetchRelics]);

	const filteredRelicsList = useFuzzySearchList({
		list: relicData.filter((relic) => relic.state === "Intact"),
		queryText: deferredSearchInput,
		getText: (relic) => [
			relic.relicName,
			relic.rewards.map((reward: Item) => reward.itemName).join(","),
		],
		mapResultItem: ({ item, matches: [highlightRanges] }) => ({
			item,
			highlightRanges,
		}),
		strategy: "smart",
	});

	// Debounced search input handler
	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchInput(e.target.value);
		},
		[],
	);

	const relicTableData = useMemo(() => {
		if (deferredSearchInput.length < 2) {
			return [];
		}

		if (selectedRelicsDisplayCount === "all") {
			return filteredRelicsList.map(({ item }) => item);
		}
		return filteredRelicsList
			.slice(0, Number.parseInt(selectedRelicsDisplayCount))
			.map(({ item }) => item);
	}, [filteredRelicsList, selectedRelicsDisplayCount, deferredSearchInput]);

	return (
		<main>
			<h1 id="title">Warframe Relic LFG</h1>

			<div>
				<form>
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
							<span>Found {filteredRelicsList.length} relics</span>
						)}
					</div>
					<label htmlFor="relicsDisplayCount">
						Relics to display
						<select
							name="relicsDisplayCount"
							id="relicsDisplayCount"
							value={selectedRelicsDisplayCount}
							onChange={(e) => {
								setSelectedRelicsDisplayCount(e.target.value);
							}}
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
