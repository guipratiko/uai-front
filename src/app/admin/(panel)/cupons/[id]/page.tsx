"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type CouponDetail = {
  id: string;
  code: string;
  eventTitle: string;
  discountPercent: number;
  active: boolean;
  maxUses: number;
  usedCount: number;
  maxUsesPerBuyer: number;
  validFrom: string | null;
  validUntil: string | null;
  ticketTierNames: string[];
};

export default function EditCouponPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [coupon, setCoupon] = useState<CouponDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountPercent: 10,
    maxUses: 1,
    maxUsesPerBuyer: 1,
    active: true,
  });

  useEffect(() => {
    api<{ coupon: CouponDetail }>(`/admin/coupons/${id}`, { admin: true })
      .then((data) => {
        setCoupon(data.coupon);
        setForm({
          code: data.coupon.code,
          discountPercent: data.coupon.discountPercent,
          maxUses: data.coupon.maxUses,
          maxUsesPerBuyer: data.coupon.maxUsesPerBuyer,
          active: data.coupon.active,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api(`/admin/coupons/${id}`, {
        method: "PUT",
        admin: true,
        body: JSON.stringify(form),
      });
      router.push("/admin/cupons");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Carregando...</p>;
  if (!coupon) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Cupom não encontrado.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Editar cupom</h1>
      <p className="mt-1 text-sm text-slate-500">
        {coupon.eventTitle} · ingressos: {coupon.ticketTierNames.join(", ")}
      </p>
      <form onSubmit={handleSave} className="mt-6 max-w-md space-y-4">
        <Input
          label="Código"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          required
        />
        <Input
          label="Desconto (%)"
          type="number"
          min={1}
          max={20}
          step={0.5}
          value={form.discountPercent}
          onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
          required
        />
        <Input
          label="Quantidade total de usos"
          type="number"
          min={coupon.usedCount}
          value={form.maxUses}
          onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })}
          required
        />
        <Input
          label="Limite por e-mail/CPF"
          type="number"
          min={1}
          value={form.maxUsesPerBuyer}
          onChange={(e) => setForm({ ...form, maxUsesPerBuyer: Number(e.target.value) })}
          required
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Cupom ativo
        </label>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/cupons")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
