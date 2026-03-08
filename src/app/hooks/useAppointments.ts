import { useEffect, useState } from "react";

interface UseAppointmentsResult {
  data: any[];
  isLoading: boolean;
  error: Error | null;
}

export function useAppointments(start: string, end: string): UseAppointmentsResult {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Extract just the start date in YYYY-MM-DD format
        const startDate = new Date(start).toISOString();
        const endDate = new Date(end).toISOString();
        const params = new URLSearchParams({ startDate, endDate });
        const response = await fetch(`/api/appointment?${params}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [start, end]);

  return { data, isLoading, error };
}
