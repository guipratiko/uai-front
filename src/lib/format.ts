export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateIso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateIso));
}

export function formatShortDate(dateIso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateIso));
}

export function generateOrderId(): string {
  const segment = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `UAI-${segment()}-${segment()}`;
}

export function generateTicketCode(): string {
  return `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function formatEventDay(dateIso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(new Date(dateIso));
}

export function formatEventMonth(dateIso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(new Date(dateIso))
    .replace(".", "")
    .toUpperCase();
}

export function formatPurchaseDateTime(dateIso: string): string {
  const d = new Date(dateIso);
  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(d)
    .replace(":", "h");
  return `${date} às ${time}`;
}

export function formatOrderNumber(orderId: string): string {
  return orderId.replace(/\D/g, "").slice(-8) || orderId;
}
