"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UsePollingResourceResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePollingResource<T>(
  url: string,
  intervalMs = 4000
): UsePollingResourceResult<T> {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(String(response.status));
      const json = (await response.json()) as T;
      if (!cancelledRef.current) {
        setData(json);
        setError(null);
      }
    } catch {
      if (!cancelledRef.current) setError("No se pudo cargar la información.");
    } finally {
      if (!cancelledRef.current) setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    cancelledRef.current = false;
    fetchData();
    const id = setInterval(fetchData, intervalMs);

    return () => {
      cancelledRef.current = true;
      clearInterval(id);
    };
  }, [fetchData, intervalMs]);

  return { data, isLoading, error, refetch: fetchData };
}
