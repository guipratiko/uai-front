"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/Badge";
import { TicketSelector } from "@/components/events/TicketSelector";
import { EventLocation } from "@/components/events/EventLocation";
import { useEvents } from "@/context/EventsContext";
import { CommissionerRefCapture } from "@/components/events/CommissionerRefCapture";

export default function EventPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { getEventBySlug, isReady } = useEvents();
  const event = getEventBySlug(slug);

  if (!isReady) {
    return (
      <PageShell className="flex min-h-[40vh] items-center justify-center bg-brand-50">
        <p className="text-slate-500">Carregando evento...</p>
      </PageShell>
    );
  }

  if (!event) notFound();

  return (
    <PageShell className="bg-brand-50">
      <CommissionerRefCapture eventId={event.id} />
      <div className="relative h-64 sm:h-80 lg:h-96">
        <Image
          src={event.bannerImage}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <Link
            href="/#eventos"
            className="mb-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos eventos
          </Link>
          <Badge variant="accent">{event.category}</Badge>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>
          <p className="mt-2 text-lg text-slate-200">{event.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-brand-600" />
                {formatDate(event.date)}
                {event.endDate && ` — ${formatDate(event.endDate)}`}
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-brand-600" />
                {event.time}
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-brand-600" />
                {event.venue}, {event.city}
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-brand-600" />
                {event.ageRating}
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="h-4 w-4 text-brand-600" />
                {event.organizer}
              </span>
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">Sobre o evento</h2>
              <p className="mt-4 leading-relaxed text-slate-600">{event.description}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {event.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800"
                  >
                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            <EventLocation event={event} />
          </div>

          <TicketSelector event={event} />
        </div>
      </div>
    </PageShell>
  );
}
