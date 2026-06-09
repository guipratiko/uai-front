"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

type CouponRow = {
  id: string;
  code: string;
  eventTitle: string;
  producerName: string;
  discountPercent: number;
  active: boolean;
  maxUses: number;
  usedCount: number;
  maxUsesPerBuyer: number;
  ticketTierNames: string[];
};

export default function AdminCuponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ coupons: CouponRow[] }>("/admin/coupons", { admin: true })
      .then((data) => setCoupons(data.coupons))
      .finally(() => setLoading(false));
  }, []);

  const toggleActive = async (c: CouponRow) => {
    await api(`/admin/coupons/${c.id}`, {
      method: "PUT",
      admin: true,
      body: JSON.stringify({ active: !c.active }),
    });
    setCoupons((prev) =>
      prev.map((row) => (row.id === c.id ? { ...row, active: !row.active } : row)),
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Cupons de desconto</h1>
      <p className="mt-2 text-slate-600">
        Criados pelos produtores. Você pode ativar/desativar ou editar detalhes.
      </p>

      {loading ? (
        <p className="mt-10 text-slate-500">Carregando...</p>
      ) : coupons.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <Tag className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-600">Nenhum cupom cadastrado.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {coupons.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {c.code} · {c.discountPercent}%
                </p>
                <p className="text-sm text-slate-500">
                  {c.eventTitle} — {c.producerName}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {c.usedCount}/{c.maxUses} usos · máx {c.maxUsesPerBuyer}/comprador ·{" "}
                  {c.ticketTierNames.join(", ")}
                </p>
                {!c.active && (
                  <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    Inativo
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/cupons/${c.id}`}>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => toggleActive(c)}>
                  {c.active ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
