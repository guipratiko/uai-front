"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Ticket, XCircle } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Order } from "@/types";

const paymentLabels = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
};

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order");
  const { setLastOrder, refreshTickets } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.replace("/");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const data = await api<{ order: Order }>(`/orders/${orderId}`);
        if (cancelled) return;
        setOrder(data.order);
        setLastOrder(data.order);

        if (data.order.status === "confirmed") {
          setLoading(false);
          refreshTickets();
          return;
        }

        if (data.order.status === "cancelled" || data.order.status === "expired") {
          setLoading(false);
          return;
        }

        attempts += 1;
        if (attempts < 20) {
          setTimeout(poll, 2000);
        } else {
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [orderId, router, setLastOrder, refreshTickets]);

  if (!orderId) return null;

  if (loading && !order) {
    return (
      <div className="py-16 text-center">
        <Clock className="mx-auto h-12 w-12 animate-pulse text-brand-500" />
        <p className="mt-4 text-slate-600">Verificando pagamento...</p>
      </div>
    );
  }

  if (order?.status === "pending") {
    return (
      <div className="py-16 text-center">
        <Clock className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Aguardando confirmação</h1>
        <p className="mt-3 text-slate-600">
          Se você já pagou, os ingressos aparecerão em instantes. Pedido{" "}
          <span className="font-mono font-semibold">{orderId}</span>
        </p>
        <Link href="/conta/ingressos" className="mt-8 inline-block">
          <Button>Ver meus ingressos</Button>
        </Link>
      </div>
    );
  }

  if (order?.status === "cancelled" || order?.status === "expired") {
    return (
      <div className="py-16 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Pagamento não concluído</h1>
        <p className="mt-3 text-slate-600">
          O checkout foi {order.status === "expired" ? "expirado" : "cancelado"}.
        </p>
        <Link href="/checkout" className="mt-8 inline-block">
          <Button>Tentar novamente</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center text-slate-600">
        <p>Não foi possível carregar o pedido.</p>
        <Link href="/" className="mt-4 inline-block text-brand-600">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
        <CheckCircle2 className="h-12 w-12 text-brand-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Compra confirmada!</h1>
      <p className="mt-3 text-slate-600">
        Pagamento aprovado. Seus ingressos foram enviados para{" "}
        <span className="font-medium">{order.buyer.email}</span>.
      </p>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
        <p className="text-sm text-slate-500">Pedido</p>
        <p className="font-mono text-lg font-bold text-brand-700">{order.id}</p>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Comprador</dt>
            <dd className="font-medium">{order.buyer.fullName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Pagamento</dt>
            <dd className="font-medium">{paymentLabels[order.paymentMethod]}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2">
            <dt className="font-bold text-slate-900">Total pago</dt>
            <dd className="font-bold text-brand-700">{formatCurrency(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/conta/ingressos">
          <Button size="lg">
            <Ticket className="h-5 w-5" />
            Ver meus ingressos
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="outline">
            Voltar ao início
          </Button>
        </Link>
      </div>
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <PageShell className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <Suspense fallback={<p className="text-slate-500">Carregando...</p>}>
          <ConfirmationContent />
        </Suspense>
      </div>
    </PageShell>
  );
}
