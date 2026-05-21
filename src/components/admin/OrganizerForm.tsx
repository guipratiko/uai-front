"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEvents } from "@/context/EventsContext";

export type OrganizerFormData = {
  email: string;
  password: string;
  name: string;
  eventIds: string[];
  active: boolean;
};

export function emptyOrganizerForm(): OrganizerFormData {
  return {
    email: "",
    password: "",
    name: "",
    eventIds: [],
    active: true,
  };
}

export function OrganizerForm({
  initial,
  isEdit,
  onSubmit,
  onCancel,
}: {
  initial: OrganizerFormData;
  isEdit?: boolean;
  onSubmit: (data: OrganizerFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const { events } = useEvents();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleEvent = (eventId: string) => {
    setForm((prev) => ({
      ...prev,
      eventIds: prev.eventIds.includes(eventId)
        ? prev.eventIds.filter((id) => id !== eventId)
        : [...prev.eventIds, eventId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isEdit && form.password.length < 4) {
      setError("Senha com pelo menos 4 caracteres");
      return;
    }
    if (form.eventIds.length === 0) {
      setError("Selecione pelo menos um evento");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <Input
        label="Nome do responsável"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        label="E-mail (login check-in)"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <Input
        label={isEdit ? "Nova senha (deixe vazio para manter)" : "Senha inicial"}
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required={!isEdit}
      />

      {isEdit && (
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="rounded border-slate-300"
          />
          Conta ativa
        </label>
      )}

      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">Eventos permitidos</legend>
        <p className="mt-1 text-xs text-slate-500">
          O organizador só valida ingressos dos eventos marcados.
        </p>
        <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3">
          {events.map((ev) => (
            <li key={ev.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-brand-50">
                <input
                  type="checkbox"
                  checked={form.eventIds.includes(ev.id)}
                  onChange={() => toggleEvent(ev.id)}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium text-slate-900">{ev.title}</span>
                  <span className="block text-xs text-slate-500">
                    {ev.date} · {ev.city}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
