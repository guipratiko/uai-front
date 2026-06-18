"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, X, ZoomIn, ZoomOut } from "lucide-react";

const VIEWPORT = 280;
const OUTPUT_SIZE = 512;

type AvatarCropModalProps = {
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (file: File) => Promise<void>;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function AvatarCropModal({ imageSrc, open, onClose, onConfirm }: AvatarCropModalProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; ox: number; oy: number }>({
    active: false,
    startX: 0,
    startY: 0,
    ox: 0,
    oy: 0,
  });

  useEffect(() => {
    if (!open || !imageSrc) return;
    setError(null);
    setUploading(false);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      const minScale = Math.max(VIEWPORT / img.width, VIEWPORT / img.height);
      setScale(minScale);
      setOffset({ x: 0, y: 0 });
    };
    img.onerror = () => setError("Não foi possível carregar a imagem");
    img.src = imageSrc;
  }, [open, imageSrc]);

  const clampOffset = useCallback(
    (nextScale: number, nextOffset: { x: number; y: number }) => {
      if (!image) return nextOffset;
      const displayW = image.width * nextScale;
      const displayH = image.height * nextScale;
      const maxX = Math.max(0, (displayW - VIEWPORT) / 2);
      const maxY = Math.max(0, (displayH - VIEWPORT) / 2);
      return {
        x: clamp(nextOffset.x, -maxX, maxX),
        y: clamp(nextOffset.y, -maxY, maxY),
      };
    },
    [image],
  );

  const minScale = image ? Math.max(VIEWPORT / image.width, VIEWPORT / image.height) : 1;
  const maxScale = image ? minScale * 3 : 3;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!image || uploading) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active || !image) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(
      clampOffset(scale, {
        x: dragRef.current.ox + dx,
        y: dragRef.current.oy + dy,
      }),
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragRef.current.active = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const exportCrop = useCallback((): Promise<File | null> => {
    if (!image) return Promise.resolve(null);

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return Promise.resolve(null);

    const displayW = image.width * scale;
    const displayH = image.height * scale;
    const left = VIEWPORT / 2 - displayW / 2 + offset.x;
    const top = VIEWPORT / 2 - displayH / 2 + offset.y;

    const sx = clamp((0 - left) / scale, 0, image.width);
    const sy = clamp((0 - top) / scale, 0, image.height);
    const sw = clamp(VIEWPORT / scale, 1, image.width - sx);
    const sh = clamp(VIEWPORT / scale, 1, image.height - sy);

    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.92,
      );
    });
  }, [image, scale, offset]);

  const handleConfirm = async () => {
    setError(null);
    setUploading(true);
    try {
      const file = await exportCrop();
      if (!file) {
        setError("Falha ao preparar a imagem");
        return;
      }
      await onConfirm(file);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao enviar foto");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  const displayW = image ? image.width * scale : 0;
  const displayH = image ? image.height * scale : 0;
  const imgLeft = VIEWPORT / 2 - displayW / 2 + offset.x;
  const imgTop = VIEWPORT / 2 - displayH / 2 + offset.y;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-crop-title"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="avatar-crop-title" className="text-lg font-bold text-slate-900">
            Ajustar foto
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-500">Arraste e use o zoom para enquadrar</p>

        <div className="relative mx-auto mt-4 overflow-hidden rounded-2xl bg-slate-900">
          <div
            className="relative touch-none select-none"
            style={{ width: VIEWPORT, height: VIEWPORT, margin: "0 auto" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt=""
                draggable={false}
                className="pointer-events-none absolute max-w-none"
                style={{
                  width: displayW,
                  height: displayH,
                  left: imgLeft,
                  top: imgTop,
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white/70" />
              </div>
            )}
            <div
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
              aria-hidden
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <ZoomOut className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="range"
            min={minScale}
            max={maxScale}
            step={0.01}
            value={scale}
            disabled={!image || uploading}
            onChange={(e) => {
              const nextScale = Number(e.target.value);
              setScale(nextScale);
              setOffset((prev) => clampOffset(nextScale, prev));
            }}
            className="w-full accent-brand-600"
            aria-label="Zoom"
          />
          <ZoomIn className="h-4 w-4 shrink-0 text-slate-400" />
        </div>

        {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!image || uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Salvar foto"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
