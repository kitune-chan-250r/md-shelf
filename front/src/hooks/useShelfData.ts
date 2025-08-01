import { useCallback, useEffect, useState } from "react";
import type { ShelfData } from "../types";

export const useShelfData = () => {
  const [shelfData, setShelfData] = useState<ShelfData[]>([]);

  const fetchShelfData = useCallback(async () => {
    const response = await fetch(`/api/shelf`);
    if (response.ok) {
      setShelfData(JSON.parse(await response.text()));
    } else {
      console.warn("fetchMarkDown faild");
    }
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        await fetchShelfData();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [fetchShelfData]);

  return shelfData;
};
