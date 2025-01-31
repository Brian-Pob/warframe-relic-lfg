import type { Relic, Item } from "@/types/Relic";
import { useFuzzySearchList } from "@nozbe/microfuzz/react";

const useFilterRelics = (
  relicData: Relic[],
  deferredSearchInput: string,
  // selectedRelicsDisplayCount: string,
) => {
  const filteredRelicsList = useFuzzySearchList({
    list: relicData.filter((relic) => relic.state === "Intact"),
    queryText: deferredSearchInput,
    getText: (relic) => [
      `${relic.relic_name} ${relic.tier}`,
      relic.rewards.map((reward: Item) => reward.item_name).join(","),
    ],
    mapResultItem: ({ item, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
    }),
    strategy: "off",
  });

  const relicTableData = () => {
    if (deferredSearchInput.length < 2) {
      return [];
    }
    return filteredRelicsList.map(({ item }) => item);
  };

  return relicTableData();
};

export default useFilterRelics;
