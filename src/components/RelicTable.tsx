import { memo } from "react";
import type { Relic, Item } from "../types/Relic";

// Memoized component for rendering rewards
const RewardsList = memo(({ rewards }: { rewards: Item[] }) => (
	<ul>
		{rewards.map((reward) => (
			// Add reward chance as part of key for edge-case where same reward is in multiple tiers of the same relic. Might be a bug with the data.
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

const RelicTable = memo(({ relicData }: { relicData: Relic[] }) => {
	return relicData.map((relic: Relic) => (
		<RelicRow key={relic._id + relic.relicName} relic={relic} />
	));
});

export default RelicTable;
