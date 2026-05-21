"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { IssuedTicket } from "@/types";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function TransferTicketModal({
  ticket,
  onClose,
  onSuccess,
}: {
  ticket: IssuedTicket;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [holderName, setHolderName] = useState("");
  const [holderEmail, setHolderEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api<{ ticket: IssuedTicket }>(`/orders/tickets/${ticket.id}/transfer`, {
        method: "POST",
        body: JSON.stringify({ holderName, holderEmail }),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível transferir");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="pr-8 text-xl font-bold text-slate-900">Transferir ingresso</h2>
        <p className="mt-2 text-sm text-slate-600">
          {ticket.eventTitle} — {ticket.ticketName}
        </p>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Você só pode transferir <strong>uma vez</strong>. O QR Code atual será invalidado e um
          novo será enviado ao novo titular. Após validação no check-in, a transferência é
          bloqueada.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Nome do novo titular"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            required
          />
          <Input
            label="E-mail do novo titular"
            type="email"
            value={holderEmail}
            onChange={(e) => setHolderEmail(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Transferindo..." : "Confirmar transferência"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
