"use client";

import Link from "next/link";
import { Plus, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

type OrganizerRow = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  events: { id: string; title: string; date: string }[];
};

export default function AdminCheckInPage() {
  const [organizers, setOrganizers] = useState<OrganizerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ organizers: OrganizerRow[] }>("/admin/organizers", { admin: true })
      .then((data) => setOrganizers(data.organizers))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Check-in — Organizadores</h1>
          <p className="mt-2 text-slate-600">
            Credenciais para{" "}
            <a
              href="https://check.uaitickets.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-700 hover:underline"
            >
              check.uaitickets.com.br
            </a>
          </p>
        </div>
        <Link href="/admin/check-in/novo">
          <Button>
            <Plus className="h-4 w-4" />
            Novo organizador
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 text-slate-500">Carregando...</p>
      ) : organizers.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <ScanLine className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-600">Nenhum organizador cadastrado.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {organizers.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">{o.name}</p>
                <p className="text-sm text-slate-500">{o.email}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {o.events.map((e) => e.title).join(" · ") || "Sem eventos"}
                </p>
                {!o.active && (
                  <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    Inativo
                  </span>
                )}
              </div>
              <Link href={`/admin/check-in/${o.id}`}>
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
