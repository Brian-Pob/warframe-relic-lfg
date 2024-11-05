import {
	useDeferredValue,
	useEffect,
	useState,
	useCallback,
	memo,
} from "react";

import { useFuzzySearchList } from "@nozbe/microfuzz/react";

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

// Memoized component for rendering rewards
const RewardsList = memo(({ rewards }: { rewards: Item[] }) => (
	<ul>
		{rewards.map((reward) => (
			<li key={reward._id + reward.chance}>
				<span>
					{reward.itemName} -{" "}
					{reward.chance === 25.33
						? "C"
						: reward.chance === 11
							? "U"
							: reward.chance === 2
								? "R"
								: ""}
				</span>
			</li>
		))}
	</ul>
));

// Memoized component for table rows
const RelicRow = memo(({ relic }: { relic: Relic }) => (
	<tr>
		<td>{relic.relicName}</td>
		<td>{relic.tier}</td>
		<td>
			<RewardsList rewards={relic.rewards} />
		</td>
	</tr>
));

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

	// const fuzzySearch = createFuzzySearch(relicData, {
	// 	getText: (relic) => [
	// 		relic.relicName,
	// 		relic.rewards.map((reward: Item) => reward.itemName).join(","),
	// 	],
	// });

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
				<label htmlFor="search">Search</label>
				<input
					type="text"
					name="search"
					id="search"
					value={searchInput}
					onChange={handleSearchChange}
					placeholder="Enter 2+ characters to search..."
				/>
			</div>

			{isLoading ? (
				<div>Loading relics...</div>
			) : (
				<table>
					<thead>
						<tr>
							<th>Relic Name</th>
							<th>Tier</th>
							<th>Rewards</th>
						</tr>
					</thead>
					<tbody>
						{deferredSearchInput.length >= 2 &&
							filteredRelicsList.map(({ item: relic }) => (
								<RelicRow key={relic._id + relic.relicName} relic={relic} />
							))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default App;
