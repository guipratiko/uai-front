"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AvatarCropModal } from "@/components/account/AvatarCropModal";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  size?: "md" | "lg";
  showActions?: boolean;
  className?: string;
};

export function ProfileAvatar({
  size = "lg",
  showActions = true,
  className,
}: ProfileAvatarProps) {
  const { user, uploadAvatar, removeAvatar } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = previewUrl ?? user?.avatarUrl ?? null;

  useEffect(() => {
    setAvatarBroken(false);
  }, [displayUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const showAvatar = !!displayUrl && !avatarBroken;

  const dim = size === "lg" ? "h-24 w-24" : "h-20 w-20";
  const iconSize = size === "lg" ? "h-10 w-10" : "h-8 w-8";

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const revokePreview = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setPreviewUrl(null);
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    resetInput();
    setError(null);
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    const src = URL.createObjectURL(file);
    setCropSrc(src);
    setCropOpen(true);
  };

  const handleCropConfirm = async (file: File) => {
    revokePreview();
    const localPreview = URL.createObjectURL(file);
    previewRef.current = localPreview;
    setPreviewUrl(localPreview);
    setAvatarBroken(false);
    setLoading(true);
    const result = await uploadAvatar(file);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Falha ao enviar imagem");
      return;
    }
    revokePreview();
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const handleCropClose = () => {
    setCropOpen(false);
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    resetInput();
  };

  const handleRemove = async () => {
    setError(null);
    revokePreview();
    setAvatarBroken(false);
    setLoading(true);
    const result = await removeAvatar();
    setLoading(false);
    if (!result.ok) setError(result.error ?? "Falha ao remover imagem");
  };

  return (
    <>
      <div className={cn("flex flex-col items-center", className)}>
        <div className="relative">
          <button
            type="button"
            onClick={() => !loading && inputRef.current?.click()}
            disabled={loading}
            className={cn(
              "relative overflow-hidden rounded-full border-2 border-brand-200 bg-brand-50 transition hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30",
              dim,
              loading && "opacity-70",
            )}
            aria-label="Alterar foto de perfil"
          >
            {showAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element -- avatar externo; evita proxy _next/image
              <img
                key={displayUrl}
                src={displayUrl}
                alt={user?.fullName ?? "Foto de perfil"}
                className="h-full w-full object-cover"
                onError={() => setAvatarBroken(true)}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-brand-400">
                <User className={iconSize} />
              </span>
            )}
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
              </span>
            )}
            {showActions && !loading && (
              <span className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/50 to-transparent py-1.5">
                <Camera className="h-4 w-4 text-white" />
              </span>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
        </div>

        {showActions && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50"
            >
              {showAvatar ? "Trocar foto" : "Adicionar foto"}
            </button>
            {showAvatar && (
              <>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Remover
                </button>
              </>
            )}
          </div>
        )}

        {error && <p className="mt-2 text-center text-xs text-red-600">{error}</p>}
        {showActions && (
          <p className="mt-1 text-center text-[11px] text-slate-400">
            JPG, PNG ou WebP · máx. 2 MB · corte quadrado
          </p>
        )}
      </div>

      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          open={cropOpen}
          onClose={handleCropClose}
          onConfirm={handleCropConfirm}
        />
      )}
    </>
  );
}
