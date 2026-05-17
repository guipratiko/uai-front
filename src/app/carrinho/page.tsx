"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { useEvents } from "@/context/EventsContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartReady } = useCart();
  const { getEventBySlug } = useEvents();

  if (!cartReady) {
    return (
      <PageShell className="bg-white">
        <div className="mx-auto max-w-7xl min-h-[12rem] px-4 py-10 sm:px-6 lg:px-8" aria-busy />
      </PageShell>
    );
  }

  return (
    <PageShell className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Carrinho</h1>
        <p className="mt-2 text-slate-600">
          Revise seus ingressos antes de finalizar a compra
        </p>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <ShoppingBag className="h-16 w-16 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-700">
              Seu carrinho está vazio
            </p>
            <Link href="/#eventos" className="mt-6">
              <Button>Explorar eventos</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <ul className="space-y-4">
              {items.map((item) => {
                const event = getEventBySlug(item.eventSlug);
                return (
                  <li
                    key={`${item.eventId}-${item.ticketId}`}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                  >
                    {event && (
                      <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-xl sm:block">
                        <Image
                          src={event.image}
                          alt={item.eventTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-slate-900">{item.eventTitle}</h2>
                      <p className="text-sm text-slate-500">
                        {formatShortDate(item.eventDate)}
                      </p>
                      <p className="mt-1 font-medium text-brand-700">
                        {item.ticketName}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {formatCurrency(item.unitPrice)} cada
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="inline-flex items-center rounded-lg border border-slate-200">
                          <button
                            type="button"
                            aria-label="Diminuir"
                            onClick={() =>
                              updateQuantity(
                                item.ticketId,
                                item.eventId,
                                item.quantity - 1,
                              )
                            }
                            className="px-3 py-2 hover:bg-brand-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[2rem] text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Aumentar"
                            onClick={() =>
                              updateQuantity(
                                item.ticketId,
                                item.eventId,
                                item.quantity + 1,
                              )
                            }
                            className="px-3 py-2 hover:bg-brand-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.ticketId, item.eventId)}
                          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </button>
                      </div>
                    </div>
                    <p className="text-right font-bold text-slate-900">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </li>
                );
              })}
            </ul>
            <OrderSummary />
          </div>
        )}
      </div>
    </PageShell>
  );
}
