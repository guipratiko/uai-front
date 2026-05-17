"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { itemCount, cartReady } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!cartReady) return;
    if (itemCount === 0) {
      router.replace("/carrinho");
    }
  }, [cartReady, itemCount, router]);

  if (!cartReady || itemCount === 0) return null;

  return (
    <PageShell className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/carrinho"
          className="inline-flex items-center gap-2 text-sm text-brand-700 hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-2 text-slate-600">
          Preencha seus dados e escolha a forma de pagamento (simulado)
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <CheckoutForm />
          </div>
          <OrderSummary showCheckoutButton={false} />
        </div>
      </div>
    </PageShell>
  );
}
