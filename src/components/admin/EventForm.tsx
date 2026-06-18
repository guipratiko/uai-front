"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { TicketTier } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AdminImageField } from "@/components/admin/AdminImageField";
import {
  createEmptyTicket,
  emptyEventForm,
  eventToFormData,
  type EventFormData,
} from "@/lib/event-form";

export type { EventFormData };
export { emptyEventForm, eventToFormData as eventToForm };

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export function EventForm({
  initial,
  onSubmit,
  submitLabel,
  isEdit,
}: {
  initial: EventFormData;
  onSubmit: (data: EventFormData) => void;
  submitLabel: string;
  isEdit?: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof EventFormData>(key: K, value: EventFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateTicket(index: number, patch: Partial<TicketTier>) {
    setForm((f) => ({
      ...f,
      tickets: f.tickets.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }));
  }

  const validateImages = () => {
    const checkFile = (file: File | null, label: string) => {
      if (file && file.size > MAX_IMAGE_BYTES) {
        throw new Error(`${label}: arquivo maior que 3 MB`);
      }
    };
    checkFile(form.imageFile, "Imagem card");
    checkFile(form.bannerFile, "Banner");

    const hasCard =
      (form.cardMode === "upload" && (form.imageFile || (isEdit && form.image))) ||
      (form.cardMode === "url" && form.imageUrl.trim());
    const hasBanner =
      (form.bannerMode === "upload" && (form.bannerFile || (isEdit && form.bannerImage))) ||
      (form.bannerMode === "url" && form.bannerImageUrl.trim());

    if (!hasCard) throw new Error("Informe a imagem card (upload ou URL)");
    if (!hasBanner) throw new Error("Informe o banner (upload ou URL)");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      validateImages();
      onSubmit({
        ...form,
        highlights: form.highlights.filter((h) => h.trim()),
        tickets: form.tickets.filter((t) => t.name.trim()),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verifique as imagens");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Informações do evento</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Título"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
          <Input
            label="Subtítulo"
            value={form.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
          />
          <Input
            label="Categoria"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
          <Input
            label="Organizador"
            value={form.organizer}
            onChange={(e) => update("organizer", e.target.value)}
          />
          <Input
            label="Data"
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            required
          />
          <Input
            label="Data fim (opcional)"
            type="date"
            value={form.endDate ?? ""}
            onChange={(e) => update("endDate", e.target.value || undefined)}
          />
          <Input
            label="Horário"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
          />
          <Input
            label="Classificação"
            value={form.ageRating}
            onChange={(e) => update("ageRating", e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="rounded border-slate-300 text-brand-500"
            />
            Evento em destaque na home
          </label>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            required
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Taxas e comissões</h2>
        <p className="mt-1 text-sm text-slate-500">
          Deixe em branco para usar o padrão de 10% na taxa ao comprador.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Taxa ao comprador (%)"
            type="number"
            min={0}
            max={100}
            step={0.01}
            placeholder="10 (padrão)"
            value={form.buyerFeePercent ?? ""}
            onChange={(e) =>
              update(
                "buyerFeePercent",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          />
          <Input
            label="Comissão Uai sobre bilheteria (%)"
            type="number"
            min={0}
            max={100}
            step={0.01}
            placeholder="0"
            value={form.platformFeePercent ?? ""}
            onChange={(e) =>
              update(
                "platformFeePercent",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          A taxa ao comprador entra no checkout Asaas. A comissão sobre bilheteria é só para
          relatório (não aumenta o preço para o cliente).
        </p>
        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={form.allowTransfer !== false}
            onChange={(e) => update("allowTransfer", e.target.checked)}
            className="mt-1 rounded border-slate-300"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Permitir transferência de ingressos
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              Cada ingresso vendido pode ser transferido uma vez, até a validação no check-in.
              Cortesias nunca são transferíveis.
            </span>
          </span>
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Local</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Local" value={form.venue} onChange={(e) => update("venue", e.target.value)} />
          <Input label="Endereço" value={form.address} onChange={(e) => update("address", e.target.value)} />
          <Input label="Cidade" value={form.city} onChange={(e) => update("city", e.target.value)} />
          <Input label="UF" value={form.state} onChange={(e) => update("state", e.target.value)} maxLength={2} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Imagens</h2>
        <p className="mt-1 text-sm text-slate-500">
          Envie arquivos ou use URL externa (ex.: OnlyFlow). Máximo 3 MB por arquivo.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <AdminImageField
            label="Imagem card"
            hint="Listagem e cards do site (proporção paisagem recomendada)"
            mode={form.cardMode}
            onModeChange={(cardMode) => update("cardMode", cardMode)}
            url={form.imageUrl}
            onUrlChange={(imageUrl) => update("imageUrl", imageUrl)}
            file={form.imageFile}
            onFileChange={(imageFile) => update("imageFile", imageFile)}
            previewUrl={isEdit && form.cardMode === "upload" ? form.image : undefined}
            required={!isEdit}
            maxMb={3}
          />
          <AdminImageField
            label="Banner"
            hint="Topo da página do evento (paisagem, maior resolução)"
            mode={form.bannerMode}
            onModeChange={(bannerMode) => update("bannerMode", bannerMode)}
            url={form.bannerImageUrl}
            onUrlChange={(bannerImageUrl) => update("bannerImageUrl", bannerImageUrl)}
            file={form.bannerFile}
            onFileChange={(bannerFile) => update("bannerFile", bannerFile)}
            previewUrl={isEdit && form.bannerMode === "upload" ? form.bannerImage : undefined}
            required={!isEdit}
            maxMb={3}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Tipos de ingresso</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => update("tickets", [...form.tickets, createEmptyTicket()])}
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          <strong>Sem cadeia de lote</strong> (campo vazio): tipos vendidos juntos, ex. VIP e Pista.
          Use o <strong>mesmo nome de cadeia</strong> em vários ingressos para virada 1º→2º lote (ex.{" "}
          <code className="rounded bg-slate-100 px-1">pista</code> no 1º e 2º lote).
        </p>
        <div className="mt-4 space-y-4">
          {form.tickets.map((ticket, i) => (
            <div key={ticket.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 flex justify-end">
                {form.tickets.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "tickets",
                        form.tickets.filter((_, idx) => idx !== i),
                      )
                    }
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Nome"
                  value={ticket.name}
                  onChange={(e) => updateTicket(i, { name: e.target.value })}
                />
                <Input
                  label="Preço (R$)"
                  type="number"
                  min={0}
                  step={0.01}
                  value={ticket.price}
                  onChange={(e) => updateTicket(i, { price: Number(e.target.value) })}
                />
                <Input
                  label="Disponíveis"
                  type="number"
                  min={0}
                  value={ticket.available}
                  onChange={(e) => updateTicket(i, { available: Number(e.target.value) })}
                />
                <Input
                  label="Máx. por pedido"
                  type="number"
                  min={1}
                  value={ticket.maxPerOrder}
                  onChange={(e) => updateTicket(i, { maxPerOrder: Number(e.target.value) })}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Descrição"
                    value={ticket.description}
                    onChange={(e) => updateTicket(i, { description: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Cadeia de lote (opcional)"
                    placeholder="Vazio = paralelo (VIP, Pista)"
                    value={ticket.lotChainId ?? ""}
                    onChange={(e) =>
                      updateTicket(i, {
                        lotChainId: e.target.value.trim() || null,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
