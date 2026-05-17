"use client";

import Link from "next/link";
import { Ticket } from "lucide-react";
import { OrderTicketCard } from "@/components/account/OrderTicketCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { buildOrderFromTickets, groupTicketsByOrder } from "@/lib/orders";

export default function MyTicketsPage() {
  const { user } = useAuth();
  const { issuedTickets } = useCart();

  const myTickets = issuedTickets.filter(
    (t) => t.holderEmail.toLowerCase() === user?.email.toLowerCase(),
  );
  const groups = groupTicketsByOrder(myTickets);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Meus ingressos</h1>

      {groups.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Ticket className="h-14 w-14 text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-700">
            Nenhum ingresso encontrado
          </p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Faça uma compra com o e-mail{" "}
            <span className="font-medium text-brand-700">{user?.email}</span> ou entre
            com o e-mail usado no checkout.
          </p>
          <Link href="/#eventos" className="mt-6">
            <Button>Comprar ingressos</Button>
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-6">
          {groups.map(({ orderId, tickets }) => {
            const order = buildOrderFromTickets(orderId, tickets);
            if (!order) return null;
            return (
              <li key={orderId}>
                <OrderTicketCard order={order} tickets={tickets} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
