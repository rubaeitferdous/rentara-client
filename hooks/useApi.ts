"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface UseApiOptions {
  requiresAuth?: boolean;
  immediate?: boolean;
}

export function useApi<T = any>(
  endpoint: string | null,
  options: UseApiOptions = {}
) {
  const { requiresAuth = true, immediate = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(immediate && endpoint));
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    try {
      const result = await api<T>(endpoint, {}, requiresAuth);
      setData(result);
      setError("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [endpoint, requiresAuth]);

  useEffect(() => {
    if (immediate && endpoint) {
      fetchData();
    }
  }, [fetchData, immediate, endpoint]);

  return {
    data,
    loading,
    error,
    reload: fetchData,
    setData,
  };
}
