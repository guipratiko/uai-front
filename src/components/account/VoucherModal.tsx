"use client";

import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";
import type { IssuedTicket } from "@/types";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export function VoucherModal({
  ticket,
  onClose,
}: {
  ticket: IssuedTicket;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="voucher-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 id="voucher-title" className="pr-8 text-xl font-bold text-slate-900">
          Meu voucher
        </h2>
        <p className="mt-1 text-sm text-slate-500">{ticket.eventTitle}</p>

        <div className="mt-6 flex justify-center rounded-xl border border-slate-100 bg-slate-50 p-6">
          <QRCodeSVG value={ticket.qrValue} size={200} level="M" />
        </div>

        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Ingresso</dt>
            <dd className="text-right font-medium text-slate-900">{ticket.ticketName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Data</dt>
            <dd className="font-medium">{formatDate(ticket.eventDate)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Local</dt>
            <dd className="text-right font-medium">{ticket.venue}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Código</dt>
            <dd className="font-mono text-xs">{ticket.code}</dd>
          </div>
        </dl>

        <Button fullWidth className="mt-6" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}
