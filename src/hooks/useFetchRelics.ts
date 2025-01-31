import { useState, useCallback, useEffect } from "react";
import type { Relic } from "@/types/Relic";

const useFetchRelics = () => {
  const [relicData, setRelicData] = useState<Relic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      localStorage.setItem(
        "relics",
        JSON.stringify(relicsJson)
          .replaceAll("itemName", "item_name")
          .replaceAll("relicName", "relic_name"),
      );
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

  return { relicData, isLoading };
};

export default useFetchRelics;
