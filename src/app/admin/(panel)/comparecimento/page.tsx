"use client";

import { useState } from "react";
import { useEvents } from "@/context/EventsContext";
import { useAdminAttendance } from "@/hooks/useAdminAttendance";
import { AdminAttendanceScopeView } from "@/components/admin/AttendanceSections";

type Tab = "sale" | "all";

export default function AdminComparecimentoPage() {
  const { events } = useEvents();
  const [eventId, setEventId] = useState<string>("");
  const [tab, setTab] = useState<Tab>("sale");
  const selectedId = eventId || events[0]?.id || null;
  const { data, loading, error } = useAdminAttendance(selectedId);

  const attendance = data?.attendance;
  const scope = attendance ? (tab === "sale" ? attendance.sale : attendance.all) : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Comparecimento</h1>
      <p className="mt-1 text-sm text-slate-500">
        Validações no check-in por evento — atualização a cada 5 segundos
      </p>

      <div className="mt-6 max-w-md">
        <label className="block text-sm font-medium text-slate-700">Evento</label>
        <select
          value={selectedId ?? ""}
          onChange={(e) => setEventId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
        >
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && !attendance && (
        <p className="mt-6 text-slate-500">Carregando relatório...</p>
      )}

      {attendance && scope && (
        <div className="mt-8 max-w-2xl">
          <h2 className="font-semibold text-slate-800">{data?.eventTitle}</h2>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setTab("sale")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${
                tab === "sale"
                  ? "bg-brand-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              Vendas
            </button>
            <button
              type="button"
              onClick={() => setTab("all")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${
                tab === "all"
                  ? "bg-brand-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              Todos emitidos
            </button>
          </div>

          <div className="mt-4">
            <AdminAttendanceScopeView scope={scope} />
          </div>

          <div className="mt-10">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-700">
              Cortesias (destaque)
            </h3>
            <AdminAttendanceScopeView scope={attendance.courtesy} variant="courtesy" />
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Atualizado {new Date(attendance.updatedAt).toLocaleTimeString("pt-BR")}
          </p>
        </div>
      )}
    </div>
  );
}
