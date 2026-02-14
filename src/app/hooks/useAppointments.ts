import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAppointments(date: string) {
  return useQuery({
    // queryKey changes with date. Every time the dropdown changes, React Query will automatically fetch new data.
    queryKey: ["calendar-events", date],
    queryFn: async () => {
      const { data } = await api.get("/calendar", {
        params: { date },
      });
      return data;
    },
    // Maintains old data while loading the new data
    placeholderData: (previousData) => previousData,
  });
}
