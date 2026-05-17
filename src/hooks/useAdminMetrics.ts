"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AdminMetrics } from "@/lib/admin-metrics";

export function useAdminMetrics() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ metrics: AdminMetrics }>("/admin/metrics", { admin: true })
      .then((data) => setMetrics(data.metrics))
      .catch((e) => setError(e instanceof Error ? e.message : "Erro ao carregar métricas"))
      .finally(() => setLoading(false));
  }, []);

  return { metrics, loading, error };
}
