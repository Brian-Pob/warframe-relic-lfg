import {
	useDeferredValue,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react";
import RelicTable from "./components/RelicTable";
import type { Relic } from "./types/Relic";

function App() {
	const [relicData, setRelicData] = useState<Relic[]>([]);
	const [searchInput, setSearchInput] = useState("");
	const deferredSearchInput = useDeferredValue(searchInput);
	const [isLoading, setIsLoading] = useState(true);

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

	// Memoized filtered data
	const filteredRelics = useMemo(() => {
		if (deferredSearchInput.length < 2) return [];

		const searchTerm = deferredSearchInput.toLowerCase();
		return relicData
			.filter((relic) => relic.state === "Intact")
			.filter(
				(relic) =>
					relic.relicName.toLowerCase().includes(searchTerm) ||
					relic.rewards.some((reward) =>
						reward.itemName.toLowerCase().includes(searchTerm),
					),
			)
			.sort((a, b) => a.relicName.localeCompare(b.relicName));
	}, [relicData, deferredSearchInput]);

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
						<select name="relicsDisplayCount" id="relicsDisplayCount">
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="all">all</option>
						</select>
					</label>
				</form>
			</div>

			{isLoading ? (
				<div>Loading relics...</div>
			) : (
				<RelicTable relicData={filteredRelics} />
			)}
		</div>
	);
}

export default App;
