import type { IssuedTicket } from "@/types";

export function isCourtesyTicket(ticket: IssuedTicket): boolean {
  return (
    ticket.source === "courtesy" ||
    ticket.orderId.startsWith("ORD-CORT") ||
    ticket.lotLabel.toLowerCase() === "cortesia"
  );
}

export function getTransferBlockReason(ticket: IssuedTicket): string | null {
  if (isCourtesyTicket(ticket)) {
    return "Ingressos cortesia não podem ser transferidos";
  }
  if (ticket.checkedInAt) {
    return "Ingresso já validado no check-in";
  }
  if ((ticket.transferCount ?? 0) >= 1) {
    return "Este ingresso já foi transferido (limite de 1 vez)";
  }
  if (ticket.allowTransfer === false) {
    return "Este evento não permite transferência";
  }
  if (ticket.status !== "approved") {
    return "Ingresso ainda não está aprovado";
  }
  return null;
}

export function canTransferTicket(ticket: IssuedTicket): boolean {
  return getTransferBlockReason(ticket) === null;
}
