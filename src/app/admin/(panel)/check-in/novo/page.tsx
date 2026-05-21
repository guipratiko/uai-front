"use client";

import { useRouter } from "next/navigation";
import { OrganizerForm, emptyOrganizerForm } from "@/components/admin/OrganizerForm";
import type { OrganizerFormData } from "@/components/admin/OrganizerForm";
import { api } from "@/lib/api";

export default function NewOrganizerPage() {
  const router = useRouter();

  const handleSubmit = async (data: OrganizerFormData) => {
    await api("/admin/organizers", {
      method: "POST",
      admin: true,
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        eventIds: data.eventIds,
      }),
    });
    router.push("/admin/check-in");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Novo organizador</h1>
      <p className="mt-2 text-slate-600">Login para validação de ingressos no check-in.</p>
      <div className="mt-8">
        <OrganizerForm
          initial={emptyOrganizerForm()}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/check-in")}
        />
      </div>
    </div>
  );
}
