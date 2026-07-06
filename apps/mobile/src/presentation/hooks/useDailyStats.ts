import { useQuery } from "@tanstack/react-query";

import { getDailyStats } from "../../infra/container";

export function useDailyStats(groupId?: string) {
  return useQuery({
    queryKey: ["stats", "daily", groupId ?? "all"],
    queryFn: () => getDailyStats.execute(groupId),
  });
}
