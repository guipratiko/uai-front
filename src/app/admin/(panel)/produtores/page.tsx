"use client";

import Link from "next/link";
import { BarChart3, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

type ProducerRow = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  courtesyTicketsIssued: number;
  events: { id: string; title: string; date: string }[];
};

export default function AdminProdutoresPage() {
  const [producers, setProducers] = useState<ProducerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ producers: ProducerRow[] }>("/admin/producers", { admin: true })
      .then((data) => setProducers(data.producers))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produtores</h1>
          <p className="mt-2 text-slate-600">
            Credenciais para{" "}
            <a
              href="https://produtor.uaitickets.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-700 hover:underline"
            >
              produtor.uaitickets.com.br
            </a>
          </p>
        </div>
        <Link href="/admin/produtores/novo">
          <Button>
            <Plus className="h-4 w-4" />
            Novo produtor
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 text-slate-500">Carregando...</p>
      ) : producers.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <BarChart3 className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-600">Nenhum produtor cadastrado.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {producers.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">{p.name}</p>
                <p className="text-sm text-slate-500">{p.email}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {p.events.map((e) => e.title).join(" · ") || "Sem eventos"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {p.courtesyTicketsIssued} lote(s) de cortesia registrados
                </p>
                {!p.active && (
                  <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    Inativo
                  </span>
                )}
              </div>
              <Link href={`/admin/produtores/${p.id}`}>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
