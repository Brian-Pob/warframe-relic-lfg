import { memo } from "react";
import type { Relic, Item } from "@/types/Relic";

// Memoized component for rendering rewards
const RewardsList = memo(
  ({ rewards, searchInput }: { rewards: Item[]; searchInput: string }) => (
    <ul>
      {rewards.map((reward) => (
        // Add reward chance as part of key for edge-case where same reward is in multiple tiers of the same relic. Might be a bug with the data.
        <li
          key={reward._id + reward.chance}
          className={
            reward.item_name.toLowerCase().includes(searchInput.toLowerCase())
              ? "matches"
              : ""
          }
        >
          <span>
            {reward.item_name} -{" "}
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
  ),
);

// Memoized component for table rows
const RelicRow = memo(
  ({
    relic,
    searchInput,
  }: { relic: Relic; index: number; searchInput: string }) => (
    <tr>
      <td>{relic.relic_name}</td>
      <td>{relic.tier}</td>
      <td>
        <RewardsList rewards={relic.rewards} searchInput={searchInput} />
      </td>
    </tr>
  ),
);

const RelicTable = memo(
  ({ relicData, searchInput }: { relicData: Relic[]; searchInput: string }) => {
    return relicData.map((relic: Relic, index: number) => (
      <RelicRow
        key={relic._id + relic.relic_name}
        relic={relic}
        index={index}
        searchInput={searchInput}
      />
    ));
  },
);

export default RelicTable;
