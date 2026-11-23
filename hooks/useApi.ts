"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface UseApiOptions {
  requiresAuth?: boolean;
  immediate?: boolean;
}

export function useApi<T = any>(
  endpoint: string | null,
  options: UseApiOptions = { requiresAuth: true, immediate: true }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(options.immediate && endpoint));
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    try {
      const result = await api<T>(endpoint, {}, options.requiresAuth);
      setData(result);
      setError("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [endpoint, options.requiresAuth]);

  useEffect(() => {
    if (options.immediate && endpoint) {
      fetchData();
    }
  }, [fetchData, options.immediate, endpoint]);

  return {
    data,
    loading,
    error,
    reload: fetchData,
    setData,
  };
}
