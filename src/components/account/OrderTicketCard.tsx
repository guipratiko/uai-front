"use client";

import { useState } from "react";
import { ArrowLeftRight, CheckCircle2, Ticket } from "lucide-react";
import type { IssuedTicket, Order } from "@/types";
import {
  formatCurrency,
  formatEventDay,
  formatEventMonth,
  formatOrderNumber,
  formatPurchaseDateTime,
} from "@/lib/format";
import { canTransferTicket, getTransferBlockReason, isCourtesyTicket } from "@/lib/tickets";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { TransferTicketModal } from "./TransferTicketModal";
import { VoucherModal } from "./VoucherModal";

export function OrderTicketCard({
  order,
  tickets,
}: {
  order: Order;
  tickets: IssuedTicket[];
}) {
  const { refreshTickets } = useCart();
  const [voucherTicket, setVoucherTicket] = useState<IssuedTicket | null>(null);
  const [transferTicket, setTransferTicket] = useState<IssuedTicket | null>(null);
  const first = tickets[0];
  if (!first) return null;
  const orderIsCourtesy = tickets.every(isCourtesyTicket);

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-50 text-center">
              <span className="text-2xl font-bold leading-none text-slate-900">
                {formatEventDay(first.eventDate)}
              </span>
              <span className="text-xs font-semibold uppercase text-brand-600">
                {formatEventMonth(first.eventDate)}
              </span>
            </div>

            <div>
              <span className="inline-block rounded-md bg-brand-500 px-2 py-0.5 text-xs font-semibold text-white">
                {first.city} — {first.state}
              </span>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                {first.venue} | {first.eventTime}
              </p>
              <h3 className="mt-1 text-lg font-bold uppercase text-slate-900 lg:text-xl">
                {first.eventTitle}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-6 lg:gap-8">
            <div className="text-sm">
              <p className="text-slate-500">{formatPurchaseDateTime(order.createdAt)}</p>
              <p className="mt-1 font-mono text-slate-700">
                {formatOrderNumber(order.id)}
              </p>
              <p className="mt-2 text-slate-500">
                {orderIsCourtesy ? "Tipo" : "Valor total"}
              </p>
              {orderIsCourtesy ? (
                <p className="text-lg font-bold text-amber-700">Cortesia</p>
              ) : (
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(order.total)}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Aprovado
              </span>
              <Button size="sm" onClick={() => setVoucherTicket(first)}>
                Meu voucher
              </Button>
            </div>
          </div>
        </div>

        <ul className="divide-y divide-dashed divide-slate-200">
          {tickets.map((ticket) => {
            const courtesy = isCourtesyTicket(ticket);
            const transferable = canTransferTicket(ticket);
            const blockReason = getTransferBlockReason(ticket);
            const wasTransferred = (ticket.transferCount ?? 0) >= 1;
            return (
            <li
              key={ticket.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                    courtesy
                      ? "bg-amber-100 text-amber-900"
                      : "bg-brand-100 text-brand-800"
                  }`}
                >
                  {courtesy ? "Cortesia" : ticket.lotLabel}
                </span>
                {courtesy && (
                  <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    Intransferível
                  </span>
                )}
                {wasTransferred && !courtesy && (
                  <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    Já transferido
                  </span>
                )}
                {ticket.checkedInAt && (
                  <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                    Validado
                  </span>
                )}
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                  {ticket.ticketName}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Ticket className="h-3.5 w-3.5" />
                  {ticket.categoryLabel}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {!courtesy && (
                  <>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Preço</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(ticket.unitPrice)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Taxa</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(ticket.feeAmount)}
                      </p>
                    </div>
                    {transferable ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => setTransferTicket(ticket)}
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                        Transferir
                      </Button>
                    ) : blockReason ? (
                      <p className="max-w-[220px] text-center text-xs text-slate-500">
                        {blockReason}
                      </p>
                    ) : null}
                  </>
                )}
                {courtesy && (
                  <p className="max-w-[200px] text-center text-xs font-medium text-amber-800">
                    Uso pessoal · Não pode ser transferido
                  </p>
                )}
              </div>
            </li>
          );
          })}
        </ul>
      </article>

      {voucherTicket && (
        <VoucherModal ticket={voucherTicket} onClose={() => setVoucherTicket(null)} />
      )}

      {transferTicket && (
        <TransferTicketModal
          ticket={transferTicket}
          onClose={() => setTransferTicket(null)}
          onSuccess={() => refreshTickets()}
        />
      )}
    </>
  );
}
