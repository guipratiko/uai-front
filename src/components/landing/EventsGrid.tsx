"use client";

import { useEvents } from "@/context/EventsContext";
import { EventCard } from "@/components/events/EventCard";

export function EventsGrid() {
  const { events, isReady } = useEvents();

  if (!isReady) {
    return (
      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-200 sm:h-80" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
