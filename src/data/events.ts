import type { Event } from "@/types";
import { SEED_EVENTS } from "./events.seed";

/** Dados iniciais — em runtime use `useEvents()` para lista atualizada */
export const events: Event[] = SEED_EVENTS;

export function getEventBySlug(slug: string): Event | undefined {
  return SEED_EVENTS.find((e) => e.slug === slug);
}

export function getFeaturedEvents(): Event[] {
  return SEED_EVENTS.filter((e) => e.featured);
}
