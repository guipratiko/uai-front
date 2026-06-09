"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function OrderSummary({ showCheckoutButton = true }: { showCheckoutButton?: boolean }) {
  const {
    subtotal,
    serviceFee,
    serviceFeeLabel,
    discountAmount,
    total,
    itemCount,
    coupon,
    couponError,
    couponLoading,
    singleEventCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [codeInput, setCodeInput] = useState("");

  const handleApply = async () => {
    const ok = await applyCoupon(codeInput);
    if (ok) setCodeInput("");
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-slate-900">Resumo</h2>

      {itemCount > 0 && (
        <div className="mt-4 space-y-2">
          {!singleEventCart && (
            <p className="text-xs text-amber-700">
              Cupom disponível apenas com ingressos de um evento por vez.
            </p>
          )}
          {singleEventCart && (
            <>
              {coupon ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-emerald-800">{coupon.code}</p>
                      <p className="text-xs text-emerald-700">
                        −{coupon.discountPercent}% em {coupon.ticketTierNames.join(", ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-emerald-800 underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    label="Cupom"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="VERAO20"
                    className="flex-1"
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={couponLoading || !codeInput.trim()}
                      onClick={handleApply}
                    >
                      {couponLoading ? "..." : "Aplicar"}
                    </Button>
                  </div>
                </div>
              )}
              {couponError && <p className="text-xs text-red-600">{couponError}</p>}
            </>
          )}
        </div>
      )}

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">Subtotal ({itemCount} itens)</dt>
          <dd className="font-medium">{formatCurrency(subtotal)}</dd>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <dt>Desconto (cupom)</dt>
            <dd className="font-medium">−{formatCurrency(discountAmount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-slate-600">{serviceFeeLabel}</dt>
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
    </aside>
  );
}
