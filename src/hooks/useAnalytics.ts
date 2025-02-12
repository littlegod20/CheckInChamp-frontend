import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const fetchAnalytics = async ({
  team,
  startDate,
  endDate,
}: {
  team?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const { data } = await api.get("/master/analytics", {
    params: {
      team: team === "All Teams" ? undefined : team,
      startDate,
      endDate,
    },
  });
  return data;
};

export const useAnalytics = ({
  team,
  startDate,
  endDate,
}: {
  team?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["analytics", team, startDate, endDate], // Cache key
    queryFn: () => fetchAnalytics({ team, startDate, endDate }),
    enabled: !!team, // Prevents query from running if `team` is undefined
    retry: 2, // Number of retry attempts on failure
  });
};
