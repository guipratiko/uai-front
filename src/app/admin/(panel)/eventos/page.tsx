"use client";

import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEvents } from "@/context/EventsContext";
import { formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";

export default function AdminEventsPage() {
  const { events, deleteEvent } = useEvents();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eventos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cadastre e gerencie os eventos exibidos no site
          </p>
        </div>
        <Link href="/admin/eventos/novo">
          <Button>
            <Plus className="h-4 w-4" />
            Novo evento
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Evento</th>
              <th className="hidden px-4 py-3 md:table-cell">Data</th>
              <th className="hidden px-4 py-3 lg:table-cell">Cidade</th>
              <th className="px-4 py-3">A partir de</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event) => {
              const minPrice = Math.min(...event.tickets.map((t) => t.price));
              return (
                <tr key={event.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={event.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{event.title}</p>
                        {event.featured && (
                          <span className="text-xs text-brand-600">Destaque</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                    {formatShortDate(event.date)}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                    {event.city}, {event.state}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-700">
                    {formatCurrency(minPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/eventos/${event.id}`}
                        className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Excluir "${event.title}"?`)) {
                            try {
                              await deleteEvent(event.id);
                            } catch {
                              alert("Não foi possível excluir o evento.");
                            }
                          }
                        }}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
