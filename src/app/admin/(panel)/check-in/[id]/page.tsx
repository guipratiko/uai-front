"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  OrganizerForm,
  emptyOrganizerForm,
  type OrganizerFormData,
} from "@/components/admin/OrganizerForm";
import { api } from "@/lib/api";

export default function EditOrganizerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<OrganizerFormData | null>(null);

  useEffect(() => {
    api<{ organizer: OrganizerFormData & { id: string; events: { id: string }[] } }>(
      `/admin/organizers/${id}`,
      { admin: true },
    ).then((data) => {
      setInitial({
        email: data.organizer.email,
        password: "",
        name: data.organizer.name,
        eventIds: data.organizer.events.map((e) => e.id),
        active: data.organizer.active,
      });
    });
  }, [id]);

  const handleSubmit = async (data: OrganizerFormData) => {
    const body: Record<string, unknown> = {
      email: data.email,
      name: data.name,
      active: data.active,
      eventIds: data.eventIds,
    };
    if (data.password) body.password = data.password;

    await api(`/admin/organizers/${id}`, {
      method: "PUT",
      admin: true,
      body: JSON.stringify(body),
    });
    router.push("/admin/check-in");
  };

  if (!initial) {
    return <p className="text-slate-500">Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Editar organizador</h1>
      <div className="mt-8">
        <OrganizerForm
          initial={initial}
          isEdit
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/check-in")}
        />
      </div>
    </div>
  );
}
