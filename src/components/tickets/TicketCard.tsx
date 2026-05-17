"use client";

import { QRCodeSVG } from "qrcode.react";
import { Calendar, Download, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import type { IssuedTicket } from "@/types";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export function TicketCard({ ticket }: { ticket: IssuedTicket }) {
  return (
    <article className="overflow-hidden rounded-2xl border-2 border-dashed border-brand-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-brand-700 to-brand-950 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <Logo asLink={false} height={28} />
          <span className="rounded-full bg-white px-3 py-0.5 text-xs font-bold text-brand-700">
            VÁLIDO
          </span>
        </div>
        <h3 className="mt-3 text-xl font-bold">{ticket.eventTitle}</h3>
        <p className="text-sm text-brand-100">{ticket.ticketName}</p>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto]">
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="h-4 w-4 text-brand-600" />
            {formatDate(ticket.eventDate)} · {ticket.eventTime}
          </div>
          <div className="flex items-start gap-2 text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            {ticket.venue}
          </div>
          <div className="rounded-lg bg-brand-50 p-3">
            <p className="text-xs text-slate-500">Titular</p>
            <p className="font-semibold text-slate-900">{ticket.holderName}</p>
            <p className="text-xs text-slate-500">{ticket.holderEmail}</p>
          </div>
          <p className="font-mono text-xs text-slate-400">Código: {ticket.code}</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-brand-100 bg-brand-50 p-4">
          <QRCodeSVG value={ticket.qrValue} size={140} level="M" />
          <p className="mt-2 text-center text-xs text-slate-500">
            QR Code simulado para demonstração
          </p>
        </div>
      </div>

      <div className="border-t border-brand-100 bg-brand-50 px-6 py-4">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => window.print()}
        >
          <Download className="h-4 w-4" />
          Baixar / imprimir (simulado)
        </Button>
      </div>
    </article>
  );
}
