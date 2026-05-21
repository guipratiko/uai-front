"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { Event } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useRouter } from "next/navigation";

export function TicketSelector({ event }: { event: Event }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    let count = 0;
    for (const ticket of event.tickets) {
      if (ticket.status && ticket.status !== "active") continue;
      const qty = quantities[ticket.id] ?? 0;
      if (qty > 0) {
        addItem(
          {
            eventId: event.id,
            eventSlug: event.slug,
            eventTitle: event.title,
            eventDate: event.date,
            ticketId: ticket.id,
            ticketName: ticket.name,
            unitPrice: ticket.price,
            buyerFeePercent: event.buyerFeePercent,
          },
          qty,
        );
        count += qty;
      }
    }
    if (count > 0) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const totalSelected = Object.values(quantities).reduce((a, b) => a + b, 0);
  const selectionTotal = event.tickets.reduce((sum, t) => {
    const qty = quantities[t.id] ?? 0;
    return sum + t.price * qty;
  }, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg lg:sticky lg:top-24">
      <h2 className="text-xl font-bold text-slate-900">Ingressos</h2>
      <p className="mt-1 text-sm text-slate-500">{formatShortDate(event.date)} · {event.time}</p>

      <div className="mt-6 space-y-4">
        {event.tickets.map((ticket) => {
          const isActive = ticket.status === "active" || ticket.status == null;
          const isClosed = ticket.status === "closed";
          if (isClosed) return null;

          return (
          <div
            key={ticket.id}
            className={`rounded-xl border p-4 ${
              isActive
                ? "border-brand-100 bg-brand-50/80"
                : "border-slate-200 bg-slate-50 opacity-75"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">{ticket.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{ticket.description}</p>
                {ticket.benefits && (
                  <ul className="mt-2 space-y-1">
                    {ticket.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-1.5 text-xs text-brand-700">
                        <Check className="h-3.5 w-3.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-lg font-bold text-brand-700">
                  {formatCurrency(ticket.price)}
                </p>
                {!isActive && (
                  <p className="mt-2 text-xs font-medium text-amber-700">
                    Lote ainda não está à venda
                  </p>
                )}
              </div>
              <QuantitySelector
                value={isActive ? (quantities[ticket.id] ?? 0) : 0}
                min={0}
                max={isActive ? ticket.maxPerOrder : 0}
                onChange={(v) => {
                  if (!isActive) return;
                  setQuantities((prev) => ({ ...prev, [ticket.id]: v }));
                }}
                size="sm"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {ticket.available.toLocaleString("pt-BR")} disponíveis
            </p>
          </div>
          );
        })}
      </div>

      {totalSelected > 0 && (
        <div className="mt-6 border-t border-slate-200 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">{totalSelected} ingresso(s)</span>
            <span className="font-bold text-slate-900">{formatCurrency(selectionTotal)}</span>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <Button
          fullWidth
          disabled={totalSelected === 0}
          onClick={handleAddToCart}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" />
              Adicionado!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Adicionar ao carrinho
            </>
          )}
        </Button>
        <Button
          variant="outline"
          fullWidth
          disabled={totalSelected === 0}
          onClick={() => {
            handleAddToCart();
            router.push("/carrinho");
          }}
        >
          Comprar agora
        </Button>
      </div>
    </div>
  );
}
