"use client";

import { useRouter } from "next/navigation";
import {
  HeroSlideForm,
  buildHeroSlideFormData,
} from "@/components/admin/HeroSlideForm";
import { emptyHeroSlideForm } from "@/lib/hero-slides";
import { apiFormData } from "@/lib/api";

export default function NewHeroSlidePage() {
  const router = useRouter();

  const handleSubmit = async (form: ReturnType<typeof emptyHeroSlideForm>) => {
    await apiFormData("/admin/hero-slides", buildHeroSlideFormData(form), { admin: true });
    router.push("/admin/hero");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Novo banner</h1>
      <p className="mt-1 text-sm text-slate-500">Adicione um slide ao carrossel da home.</p>
      <div className="mt-6">
        <HeroSlideForm
          initial={emptyHeroSlideForm()}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/hero")}
        />
      </div>
    </div>
  );
}
