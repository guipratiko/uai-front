"use client";

import { Input } from "@/components/ui/Input";

export function AdminImageField({
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
  maxMb = 3,
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
  maxMb?: number;
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
          required={required && !previewUrl && !file}
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

      <p className="text-[11px] text-slate-400">JPG, PNG ou WebP · máx. {maxMb} MB</p>

      {displayPreview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayPreview}
          alt=""
          className="mt-2 max-h-48 w-full rounded-lg border border-slate-200 object-cover"
        />
      )}
    </fieldset>
  );
}
