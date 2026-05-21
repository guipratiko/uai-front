"use client";

import { useRouter } from "next/navigation";
import { ProducerForm, emptyProducerForm, type ProducerFormData } from "@/components/admin/ProducerForm";
import { api } from "@/lib/api";

export default function NewProducerPage() {
  const router = useRouter();

  const handleSubmit = async (data: ProducerFormData) => {
    await api("/admin/producers", {
      method: "POST",
      admin: true,
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        eventIds: data.eventIds,
      }),
    });
    router.push("/admin/produtores");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Novo produtor</h1>
      <p className="mt-2 text-slate-600">Painel de métricas, cortesias e envio em massa.</p>
      <div className="mt-8">
        <ProducerForm
          initial={emptyProducerForm()}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/produtores")}
        />
      </div>
    </div>
  );
}
