"use client";

import { CreditCard, QrCode } from "lucide-react";
import type { PaymentMethod } from "@/types";
import { cn } from "@/lib/utils";

const methods: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof QrCode;
}[] = [
  {
    id: "pix",
    label: "Pix",
    description: "Pagamento via Asaas Checkout",
    icon: QrCode,
  },
  {
    id: "credit_card",
    label: "Cartão de crédito",
    description: "Pagamento seguro via Asaas",
    icon: CreditCard,
  },
];

export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}) {
  return (
    <fieldset>
      <legend className="text-lg font-bold text-slate-900">Forma de pagamento</legend>
      <p className="mt-1 text-sm text-slate-500">
        Você será redirecionado ao checkout seguro do Asaas
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={cn(
              "flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all",
              value === m.id
                ? "border-brand-600 bg-brand-50"
                : "border-slate-200 hover:border-slate-300",
            )}
          >
            <m.icon
              className={cn(
                "h-6 w-6",
                value === m.id ? "text-brand-600" : "text-slate-400",
              )}
            />
            <span className="mt-3 font-semibold text-slate-900">{m.label}</span>
            <span className="mt-1 text-xs text-slate-500">{m.description}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
