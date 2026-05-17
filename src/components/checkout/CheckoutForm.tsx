"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { isValidCpf, onlyDigits } from "@/lib/cpf";
import type { BuyerInfo, PaymentMethod } from "@/types";

export function CheckoutForm() {
  const { startCheckout, clearCart, itemCount } = useCart();
  const { user, syncUserFromBuyer } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BuyerInfo, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [buyer, setBuyer] = useState<BuyerInfo>({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    cpf: user?.cpf ?? "",
    phone: user?.phone ?? "",
  });

  const validate = (): boolean => {
    const next: Partial<Record<keyof BuyerInfo, string>> = {};
    if (!buyer.fullName.trim()) next.fullName = "Informe seu nome completo";
    if (!buyer.email.includes("@")) next.email = "E-mail inválido";
    if (!isValidCpf(buyer.cpf)) next.cpf = "CPF inválido";
    if (buyer.phone.replace(/\D/g, "").length < 10) next.phone = "Telefone inválido";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || itemCount === 0) return;
    setSubmitError(null);
    setLoading(true);
    try {
      const payload = {
        ...buyer,
        email: buyer.email.toLowerCase(),
        cpf: onlyDigits(buyer.cpf),
      };
      const { checkoutUrl } = await startCheckout(payload, paymentMethod);
      syncUserFromBuyer(payload);
      clearCart();
      window.location.href = checkoutUrl;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Não foi possível iniciar o pagamento",
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="text-lg font-bold text-slate-900">Dados do comprador</legend>
        <Input
          label="Nome completo"
          name="fullName"
          value={buyer.fullName}
          onChange={(e) => setBuyer({ ...buyer, fullName: e.target.value })}
          error={errors.fullName}
          placeholder="Maria da Silva"
          autoComplete="name"
        />
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={buyer.email}
          onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
          error={errors.email}
          placeholder="maria@email.com"
          autoComplete="email"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="CPF"
            name="cpf"
            value={buyer.cpf}
            onChange={(e) => setBuyer({ ...buyer, cpf: e.target.value })}
            error={errors.cpf}
            placeholder="000.000.000-00"
          />
          <Input
            label="Telefone"
            name="phone"
            type="tel"
            value={buyer.phone}
            onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
            error={errors.phone}
            placeholder="(31) 99999-9999"
            autoComplete="tel"
          />
        </div>
      </fieldset>

      <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

      {submitError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <Button type="submit" fullWidth size="lg" disabled={loading || itemCount === 0}>
        {loading ? "Redirecionando..." : "Ir para pagamento"}
      </Button>
    </form>
  );
}
