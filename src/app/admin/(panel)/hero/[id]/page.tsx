"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HeroSlideForm,
  buildHeroSlideFormData,
} from "@/components/admin/HeroSlideForm";
import { api, apiFormData } from "@/lib/api";
import { heroSlideToForm, type HeroSlide } from "@/lib/hero-slides";

export default function EditHeroSlidePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [slide, setSlide] = useState<HeroSlide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ slide: HeroSlide }>(`/admin/hero-slides/${id}`, { admin: true })
      .then((data) => setSlide(data.slide))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-slate-500">Carregando...</p>;
  }

  if (!slide) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Banner não encontrado.
      </p>
    );
  }

  const handleSubmit = async (form: ReturnType<typeof heroSlideToForm>) => {
    await apiFormData(`/admin/hero-slides/${id}`, buildHeroSlideFormData(form), {
      admin: true,
      method: "PUT",
    });
    router.push("/admin/hero");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Editar banner</h1>
      <p className="mt-1 text-sm text-slate-500">{slide.title}</p>
      <div className="mt-6">
        <HeroSlideForm
          initial={heroSlideToForm(slide)}
          isEdit
          existingSlide={slide}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/hero")}
        />
      </div>
    </div>
  );
}
