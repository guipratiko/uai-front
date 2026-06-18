"use client";

import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import type { HeroSlide } from "@/lib/hero-slides";

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api<{ slides: HeroSlide[] }>("/admin/hero-slides", { admin: true })
      .then((data) => setSlides(data.slides))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Remover o banner "${title}"? As imagens enviadas ao servidor também serão apagadas.`)) {
      return;
    }
    try {
      await api(`/admin/hero-slides/${id}`, { method: "DELETE", admin: true });
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Não foi possível remover o banner.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners da home</h1>
          <p className="mt-2 text-slate-600">
            Carrossel do hero com imagens desktop e mobile, título e link para o evento.
          </p>
        </div>
        <Link href="/admin/hero/novo">
          <Button>
            <Plus className="h-4 w-4" />
            Novo banner
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 text-slate-500">Carregando...</p>
      ) : slides.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <ImageIcon className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-600">Nenhum banner cadastrado. O site usa o vídeo padrão.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {slides.map((slide) => (
            <li
              key={slide.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <img
                src={slide.imageDesktopUrl}
                alt=""
                className="h-20 w-32 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{slide.title}</p>
                <p className="truncate text-sm text-slate-500">{slide.subtitle}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {slide.eventTitle ?? "Sem evento vinculado"} · {slide.displayDurationMs / 1000}s · ordem{" "}
                  {slide.sortOrder}
                </p>
                {!slide.active && (
                  <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    Inativo
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/hero/${slide.id}`}>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(slide.id, slide.title)}
                >
                  Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
