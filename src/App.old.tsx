import { useDeferredValue, useEffect, useState } from "react";

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
	const [relicData, setRelicData] = useState<Relic[]>();
	const [searchInput, setSearchInput] = useState("");
	const deferredSearchInput = useDeferredValue(searchInput);
	useEffect(() => {
		let ignore = false;
		const fetchRelics = async () => {
			const localRelics = localStorage.getItem("relics");
			if (localRelics) {
				setRelicData(JSON.parse(localRelics));
				return;
			}

			const response = await fetch(
				"https://drops.warframestat.us/data/relics.json",
			);
			if (!response.ok) {
				console.error(`Reponse status ${response.status}`);
			}
			const { relics: relicsJson } = await response.json();
			if (!ignore) {
				localStorage.setItem("relics", JSON.stringify(relicsJson));
				setRelicData(relicsJson);
			}
		};
		fetchRelics();
		return () => {
			ignore = true;
		};
	}, []);

	return (
		<>
			<h1>Warframe Relic LFG</h1>

			<input
				type="text"
				name="search"
				id="search"
				value={searchInput}
				onChange={(e) => setSearchInput(e.target.value)}
			/>
			<label htmlFor="search">Search</label>

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
						relicData
							?.sort((a, b) => a.relicName.localeCompare(b.relicName))
							.filter((relic) => relic.state === "Intact")
							.filter(
								(relic) =>
									relic.relicName
										.toLocaleLowerCase()
										.includes(deferredSearchInput.toLocaleLowerCase()) ||
									relic.rewards.some((reward) =>
										reward.itemName
											.toLocaleLowerCase()
											.includes(deferredSearchInput.toLocaleLowerCase()),
									),
							)
							.map((relic) => (
								<tr key={relic._id + relic.relicName}>
									<td>{relic.relicName}</td>
									<td>{relic.tier}</td>
									<td>
										<ul>
											{relic.rewards.map((reward) => (
												<li key={reward._id + reward.chance}>
													<span>
														{reward.itemName} - {(() => {
															if (reward.chance === 25.33) return "C";
															if (reward.chance === 11) return "U";
															if (reward.chance === 2) return "R";
														})()}
													</span>
												</li>
											))}
										</ul>
									</td>
								</tr>
							))}
				</tbody>
			</table>
		</>
	);
}

export default App;
