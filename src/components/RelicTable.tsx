import { memo } from "react";
import type { Relic, Item } from "@/types/Relic";
// import { Navigate } from '@tanstack/react-router';

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
    // index, // uncomment to use the index
  }: { relic: Relic; index: number; searchInput: string }) => {
    const handleSearchForGroup = () => {
      // navigate to /posts?relic_id=XXXX
      // NOTE: Consider refining that part in the backend to search by easier to read relic name
    };
    return (
      <tr>
        <td>
          {relic.tier} {relic.relic_name}{" "}
        </td>
        <td>
          <RewardsList rewards={relic.rewards} searchInput={searchInput} />
        </td>
        <td>
          <div className="group-btns">
            {/* Search for group will go to the /posts route and pass relic._id as the param to search for groups that are running that relic */}
            <button type="button">Find a Squad</button>
            {/* Create group will go to a /create-group route and pass relic._id as the param to create a new group that is running that relic */}
            <button type="button">Create a Squad</button>
          </div>
        </td>
      </tr>
    );
  },
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
