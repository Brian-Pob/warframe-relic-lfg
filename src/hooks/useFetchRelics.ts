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
          .replace(/itemName/g, "item_name")
          .replace(/relicName/g, "relic_name")
          .replace(/state/g, "refinement"),
      );
      setRelicData(JSON.parse(localStorage.getItem("relics") as string));
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
