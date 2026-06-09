"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { EventAttendanceResponse } from "@/lib/attendance";

const POLL_MS = 5000;

export function useAdminAttendance(eventId: string | null) {
  const [data, setData] = useState<EventAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!eventId) {
      setData(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api<EventAttendanceResponse>(`/admin/events/${eventId}/attendance`, {
        admin: true,
      });
      setData(res);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void refresh();
    if (!eventId) return;
    const id = setInterval(() => void refresh(), POLL_MS);
    return () => clearInterval(id);
  }, [eventId, refresh]);

  return { data, loading, error, refresh };
}
