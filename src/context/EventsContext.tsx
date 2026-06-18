"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, apiFormData } from "@/lib/api";
import { buildEventFormData, type EventFormData } from "@/lib/event-form";
import { SEED_EVENTS } from "@/data/events.seed";
import type { Event } from "@/types";

type EventsContextValue = {
  events: Event[];
  isReady: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getEventBySlug: (slug: string) => Event | undefined;
  getEventById: (id: string) => Event | undefined;
  addEvent: (event: EventFormData) => Promise<Event>;
  updateEvent: (id: string, data: EventFormData) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
};

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await api<{ events: Event[] }>("/events");
      setEvents(data.events);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar eventos");
      setEvents(SEED_EVENTS);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getEventBySlug = useCallback(
    (slug: string) => events.find((e) => e.slug === slug),
    [events],
  );

  const getEventById = useCallback(
    (id: string) => events.find((e) => e.id === id),
    [events],
  );

  const addEvent = useCallback(async (input: EventFormData) => {
    const fd = buildEventFormData(input);
    const data = await apiFormData<{ event: Event }>("/events", fd, { admin: true });
    setEvents((prev) => [...prev, data.event]);
    return data.event;
  }, []);

  const updateEvent = useCallback(async (id: string, input: EventFormData) => {
    const fd = buildEventFormData(input);
    const result = await apiFormData<{ event: Event }>(`/events/${id}`, fd, {
      admin: true,
      method: "PUT",
    });
    setEvents((prev) => prev.map((e) => (e.id === id ? result.event : e)));
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await api(`/events/${id}`, { method: "DELETE", admin: true });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      events,
      isReady,
      error,
      refresh,
      getEventBySlug,
      getEventById,
      addEvent,
      updateEvent,
      deleteEvent,
    }),
    [
      events,
      isReady,
      error,
      refresh,
      getEventBySlug,
      getEventById,
      addEvent,
      updateEvent,
      deleteEvent,
    ],
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
