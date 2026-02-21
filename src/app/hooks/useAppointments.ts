import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAppointments(start: string, end: string) {
  return useQuery({
    queryKey: ["calendar-events", start, end],
    queryFn: async () => {
      const { data } = await api.get("/calendar", {
        params: { start, end },
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}
