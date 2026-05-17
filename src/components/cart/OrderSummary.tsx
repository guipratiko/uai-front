"use client";

import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function OrderSummary({ showCheckoutButton = true }: { showCheckoutButton?: boolean }) {
  const { subtotal, serviceFee, total, itemCount } = useCart();

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-slate-900">Resumo</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">Subtotal ({itemCount} itens)</dt>
          <dd className="font-medium">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-600">Taxa de serviço (10%)</dt>
          <dd className="font-medium">{formatCurrency(serviceFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
          <dt className="font-bold text-slate-900">Total</dt>
          <dd className="font-bold text-brand-700">{formatCurrency(total)}</dd>
        </div>
      </dl>
      {showCheckoutButton && (
        <Link href="/checkout" className="mt-6 block">
          <Button fullWidth size="lg" disabled={itemCount === 0}>
            Ir para checkout
          </Button>
        </Link>
      )}
      <p className="mt-4 text-center text-xs text-slate-500">
        Pagamento simulado — sem cobrança real
      </p>
    </aside>
  );
}
