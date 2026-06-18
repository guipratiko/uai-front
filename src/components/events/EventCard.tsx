import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import type { Event } from "@/types";
import { formatShortDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />
        <Badge className="absolute left-3 top-3 text-[10px]" variant="accent">
          {event.category}
        </Badge>
        {event.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
            Destaque
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-brand-700 sm:text-base lg:text-lg">
          {event.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500 sm:text-sm">{event.subtitle}</p>
        <div className="mt-2 flex flex-col gap-1 text-[11px] text-slate-600 sm:mt-3 sm:gap-1.5 sm:text-sm">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-brand-600 sm:h-4 sm:w-4" />
            {formatShortDate(event.date)}
            {event.endDate && ` — ${formatShortDate(event.endDate)}`}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-600 sm:h-4 sm:w-4" />
            {event.city}, {event.state}
          </span>
        </div>
        <div className="mt-auto border-t border-slate-100 pt-3 sm:pt-4">
          <Link href={`/eventos/${event.slug}`} className="block">
            <Button size="sm" className="w-full text-xs sm:text-sm">
              Ver ingressos
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
