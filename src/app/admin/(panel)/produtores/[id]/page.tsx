"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ProducerForm,
  emptyProducerForm,
  type ProducerFormData,
} from "@/components/admin/ProducerForm";
import { api } from "@/lib/api";

export default function EditProducerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<ProducerFormData | null>(null);

  useEffect(() => {
    api<{ producer: ProducerFormData & { id: string; events: { id: string }[] } }>(
      `/admin/producers/${id}`,
      { admin: true },
    ).then((data) => {
      setInitial({
        email: data.producer.email,
        password: "",
        name: data.producer.name,
        eventIds: data.producer.events.map((e) => e.id),
        active: data.producer.active,
      });
    });
  }, [id]);

  const handleSubmit = async (data: ProducerFormData) => {
    const body: Record<string, unknown> = {
      email: data.email,
      name: data.name,
      active: data.active,
      eventIds: data.eventIds,
    };
    if (data.password) body.password = data.password;

    await api(`/admin/producers/${id}`, {
      method: "PUT",
      admin: true,
      body: JSON.stringify(body),
    });
    router.push("/admin/produtores");
  };

  if (!initial) {
    return <p className="text-slate-500">Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Editar produtor</h1>
      <div className="mt-8">
        <ProducerForm
          initial={initial}
          isEdit
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/produtores")}
        />
      </div>
    </div>
  );
}
