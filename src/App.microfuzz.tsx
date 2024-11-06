import { useDeferredValue, useEffect, useState, useCallback } from "react";

import { useFuzzySearchList } from "@nozbe/microfuzz/react";
import RelicTable from "./components/RelicTable";

type Relic = {
	tier: string;
	relicName: string;
	state: string;
	rewards: Array<Item>;
	_id: string;
};

type Item = {
	_id: string;
	itemName: string;
	rarity: string;
	chance: number;
};

function App() {
	const [relicData, setRelicData] = useState<Relic[]>([]);
	const [searchInput, setSearchInput] = useState("");
	const deferredSearchInput = useDeferredValue(searchInput);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedRelicsDisplayCount, setSelectedRelicsDisplayCount] =
		useState(5);

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
		strategy: "off",
	});

	// Debounced search input handler
	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchInput(e.target.value);
		},
		[],
	);

	return (
		<div>
			<h1>Warframe Relic LFG</h1>

			<div>
				<form>
					<label htmlFor="search">
						Search
						<input
							type="text"
							name="search"
							id="search"
							value={searchInput}
							onChange={handleSearchChange}
							placeholder="Enter 2+ characters to search..."
						/>
					</label>
					<label htmlFor="relicsDisplayCount">
						Relics to display
						<select
							name="relicsDisplayCount"
							id="relicsDisplayCount"
							value={selectedRelicsDisplayCount}
							onChange={(e) =>
								setSelectedRelicsDisplayCount(Number.parseInt(e.target.value))
							}
						>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="40">40</option>
							{/* <option value="all">all</option> */}
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
					{!isLoading && deferredSearchInput.length >= 2 && (
						<RelicTable
							relicData={filteredRelicsList
								.slice(0, selectedRelicsDisplayCount)
								.map(({ item }) => item)}
						/>
					)}
				</tbody>
			</table>
		</div>
	);
}

export default App;
