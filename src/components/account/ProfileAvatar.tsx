"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dim = size === "lg" ? "h-24 w-24" : "h-20 w-20";
  const iconSize = size === "lg" ? "h-10 w-10" : "h-8 w-8";

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setLoading(true);
    const result = await uploadAvatar(file);
    setLoading(false);
    if (!result.ok) setError(result.error ?? "Falha ao enviar imagem");
  };

  const handleRemove = async () => {
    setError(null);
    setLoading(true);
    const result = await removeAvatar();
    setLoading(false);
    if (!result.ok) setError(result.error ?? "Falha ao remover imagem");
  };

  return (
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
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.fullName}
              fill
              className="object-cover"
              sizes={size === "lg" ? "96px" : "80px"}
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
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
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
            {user?.avatarUrl ? "Trocar foto" : "Adicionar foto"}
          </button>
          {user?.avatarUrl && (
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
          JPG, PNG ou WebP · máx. 2 MB
        </p>
      )}
    </div>
  );
}
