import type { IssuedTicket, Order } from "@/types";

export function groupTicketsByOrder(
  tickets: IssuedTicket[],
): { orderId: string; tickets: IssuedTicket[] }[] {
  const map = new Map<string, IssuedTicket[]>();
  for (const ticket of tickets) {
    const list = map.get(ticket.orderId) ?? [];
    list.push(ticket);
    map.set(ticket.orderId, list);
  }
  return Array.from(map.entries())
    .map(([orderId, group]) => ({ orderId, tickets: group }))
    .sort(
      (a, b) =>
        new Date(b.tickets[0]?.purchasedAt ?? 0).getTime() -
        new Date(a.tickets[0]?.purchasedAt ?? 0).getTime(),
    );
}

export function buildOrderFromTickets(
  orderId: string,
  tickets: IssuedTicket[],
): Order | null {
  if (tickets.length === 0) return null;
  const first = tickets[0];
  const subtotal = tickets.reduce((s, t) => s + t.unitPrice, 0);
  const serviceFee = tickets.reduce((s, t) => s + t.feeAmount, 0);
  return {
    id: orderId,
    items: [],
    buyer: {
      fullName: first.holderName,
      email: first.holderEmail,
      cpf: "",
      phone: "",
    },
    paymentMethod: "pix",
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
    createdAt: first.purchasedAt,
    status: "confirmed",
  };
}
