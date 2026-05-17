import type { Event, IssuedTicket } from "@/types";
import { formatCurrency } from "./format";

export type AdminMetrics = {
  totalRevenue: number;
  ticketsSold: number;
  ordersCount: number;
  eventsActive: number;
  revenueByEvent: { name: string; revenue: number; tickets: number }[];
  salesByDay: { label: string; count: number; revenue: number }[];
  paymentSplit: { method: string; count: number }[];
};

const PAYMENT_LABELS: Record<string, string> = {
  pix: "Pix",
  credit_card: "Cartão",
};

export function computeMetrics(
  tickets: IssuedTicket[],
  events: Event[],
): AdminMetrics {
  const totalRevenue = tickets.reduce(
    (s, t) => s + t.unitPrice + t.feeAmount,
    0,
  );
  const orderIds = new Set(tickets.map((t) => t.orderId));

  const byEvent = new Map<string, { name: string; revenue: number; tickets: number }>();
  for (const t of tickets) {
    const cur = byEvent.get(t.eventSlug) ?? {
      name: t.eventTitle,
      revenue: 0,
      tickets: 0,
    };
    cur.revenue += t.unitPrice + t.feeAmount;
    cur.tickets += 1;
    byEvent.set(t.eventSlug, cur);
  }

  const revenueByEvent = Array.from(byEvent.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const dayMap = new Map<string, { count: number; revenue: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayMap.set(key, { count: 0, revenue: 0 });
  }
  for (const t of tickets) {
    const key = t.purchasedAt.slice(0, 10);
    if (dayMap.has(key)) {
      const cur = dayMap.get(key)!;
      cur.count += 1;
      cur.revenue += t.unitPrice + t.feeAmount;
    }
  }
  const salesByDay = Array.from(dayMap.entries()).map(([iso, data]) => ({
    label: new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit" })
      .format(new Date(iso))
      .replace(".", ""),
    count: data.count,
    revenue: data.revenue,
  }));

  return {
    totalRevenue,
    ticketsSold: tickets.length,
    ordersCount: orderIds.size,
    eventsActive: events.length,
    revenueByEvent,
    salesByDay,
    paymentSplit: [
      { method: PAYMENT_LABELS.pix, count: Math.ceil(tickets.length * 0.62) },
      {
        method: PAYMENT_LABELS.credit_card,
        count: Math.ceil(tickets.length * 0.38),
      },
    ],
  };
}

export function formatMetricCurrency(value: number) {
  return formatCurrency(value);
}
