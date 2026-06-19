"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEvents } from "@/context/EventsContext";
import {
  buildHeroSlideFormData,
  type HeroSlide,
  type HeroSlideFormData,
} from "@/lib/hero-slides";

function ImageField({
  label,
  hint,
  mode,
  onModeChange,
  url,
  onUrlChange,
  file,
  onFileChange,
  previewUrl,
  required,
}: {
  label: string;
  hint: string;
  mode: "upload" | "url";
  onModeChange: (mode: "upload" | "url") => void;
  url: string;
  onUrlChange: (url: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  previewUrl?: string;
  required?: boolean;
}) {
  const displayPreview =
    (mode === "upload" && file ? URL.createObjectURL(file) : null) ??
    (mode === "url" && url.trim() ? url.trim() : null) ??
    previewUrl ??
    null;

  return (
    <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
      <legend className="px-1 text-sm font-semibold text-slate-900">{label}</legend>
      <p className="text-xs text-slate-500">{hint}</p>

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`${label}-mode`}
            checked={mode === "upload"}
            onChange={() => onModeChange("upload")}
          />
          Upload
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`${label}-mode`}
            checked={mode === "url"}
            onChange={() => onModeChange("url")}
          />
          URL externa
        </label>
      </div>

      {mode === "upload" ? (
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          required={required && !previewUrl}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700"
        />
      ) : (
        <Input
          label="URL da imagem"
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://..."
          required={required && !previewUrl}
        />
      )}

      {displayPreview && (
        <img
          src={displayPreview}
          alt=""
          className="mt-2 max-h-40 rounded-lg border border-slate-200 object-cover"
        />
      )}
    </fieldset>
  );
}

export function HeroSlideForm({
  initial,
  isEdit,
  existingSlide,
  onSubmit,
  onCancel,
}: {
  initial: HeroSlideFormData;
  isEdit?: boolean;
  existingSlide?: HeroSlide;
  onSubmit: (form: HeroSlideFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const { events } = useEvents();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.eventId && form.externalLink.trim()) {
      try {
        const url = new URL(form.externalLink.trim());
        if (!["http:", "https:"].includes(url.protocol)) {
          setError("Link externo: use uma URL http ou https");
          return;
        }
      } catch {
        setError("Link externo inválido");
        return;
      }
    }

    const hasDesktop =
      (form.desktopMode === "upload" && form.imageDesktopFile) ||
      (form.desktopMode === "url" && form.imageDesktopUrl.trim()) ||
      (isEdit && !!existingSlide?.imageDesktop);
    const hasMobile =
      (form.mobileMode === "upload" && form.imageMobileFile) ||
      (form.mobileMode === "url" && form.imageMobileUrl.trim()) ||
      (isEdit && !!existingSlide?.imageMobile);

    if (!hasDesktop) {
      setError("Informe a imagem desktop (upload ou URL)");
      return;
    }
    if (!hasMobile) {
      setError("Informe a imagem mobile (upload ou URL)");
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
      <div>
        <label htmlFor="hero-event" className="block text-sm font-medium text-slate-700">
          Evento vinculado <span className="font-normal text-slate-400">(opcional)</span>
        </label>
        <select
          id="hero-event"
          value={form.eventId}
          onChange={(e) =>
            setForm({
              ...form,
              eventId: e.target.value,
              externalLink: e.target.value ? "" : form.externalLink,
            })
          }
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">Nenhum — banner informativo</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-500">
          Se vincular um evento, o clique no banner leva para a página dele.
        </p>
      </div>

      {!form.eventId && (
        <Input
          label="Link externo"
          type="url"
          value={form.externalLink}
          onChange={(e) => setForm({ ...form, externalLink: e.target.value })}
          placeholder="https://..."
          hint="Opcional. Abre em nova aba quando o banner for clicado."
        />
      )}

      <Input
        label="Título"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        hint="Opcional. Sem título e subtítulo, o banner exibe só a imagem (sem filtro escuro)."
      />

      <div className="space-y-1.5">
        <label htmlFor="hero-subtitle" className="block text-sm font-medium text-slate-700">
          Subtítulo <span className="font-normal text-slate-400">(opcional)</span>
        </label>
        <textarea
          id="hero-subtitle"
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <Input
        label="Duração do slide (segundos)"
        type="number"
        min={2}
        max={30}
        step={0.5}
        value={form.displayDurationMs / 1000}
        onChange={(e) =>
          setForm({
            ...form,
            displayDurationMs: Math.round(Number(e.target.value) * 1000) || 4000,
          })
        }
        hint="Tempo que este banner fica visível antes de passar ao próximo."
      />

      <Input
        label="Ordem"
        type="number"
        value={form.sortOrder}
        onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
        hint="Menor número aparece primeiro."
      />

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
          className="rounded border-slate-300"
        />
        Banner ativo (visível na home)
      </label>

      <ImageField
        label="Imagem desktop"
        hint="Recomendado: 1920 × 680 px — JPEG, PNG ou WebP."
        mode={form.desktopMode}
        onModeChange={(desktopMode) => setForm({ ...form, desktopMode })}
        url={form.imageDesktopUrl}
        onUrlChange={(imageDesktopUrl) => setForm({ ...form, imageDesktopUrl })}
        file={form.imageDesktopFile}
        onFileChange={(imageDesktopFile) => setForm({ ...form, imageDesktopFile })}
        previewUrl={existingSlide?.imageDesktopUrl}
        required={!isEdit}
      />

      <ImageField
        label="Imagem mobile"
        hint="Recomendado: 1080 × 1350 px — JPEG, PNG ou WebP."
        mode={form.mobileMode}
        onModeChange={(mobileMode) => setForm({ ...form, mobileMode })}
        url={form.imageMobileUrl}
        onUrlChange={(imageMobileUrl) => setForm({ ...form, imageMobileUrl })}
        file={form.imageMobileFile}
        onFileChange={(imageMobileFile) => setForm({ ...form, imageMobileFile })}
        previewUrl={existingSlide?.imageMobileUrl}
        required={!isEdit}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar banner"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export { buildHeroSlideFormData };
