import type { CartItem, Event } from "@/types";

/** Alinha itens do carrinho (sessionStorage/seed) com os IDs reais da API. */
export function reconcileCartItems(items: CartItem[], events: Event[]): CartItem[] {
  const result: CartItem[] = [];

  for (const item of items) {
    const event = events.find(
      (e) => e.id === item.eventId || e.slug === item.eventSlug,
    );
    if (!event) continue;

    const ticket =
      event.tickets.find((t) => t.id === item.ticketId) ??
      event.tickets.find((t) => t.name === item.ticketName);
    if (!ticket) continue;

    result.push({
      ...item,
      eventId: event.id,
      eventSlug: event.slug,
      eventTitle: event.title,
      eventDate: event.date,
      ticketId: ticket.id,
      ticketName: ticket.name,
      unitPrice: ticket.price,
      buyerFeePercent: event.buyerFeePercent,
    });
  }

  return result;
}
