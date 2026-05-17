import { MapPin, Navigation } from "lucide-react";
import type { Event } from "@/types";

export function EventLocation({ event }: { event: Event }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-slate-900">Local do evento</h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="aspect-[16/9] w-full bg-slate-100">
          <iframe
            title={`Mapa — ${event.venue}`}
            src={event.mapEmbedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">{event.venue}</h3>
            <p className="mt-1 flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              {event.address}, {event.city} — {event.state}
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            <Navigation className="h-4 w-4" />
            Como chegar
          </a>
        </div>
      </div>
    </section>
  );
}
