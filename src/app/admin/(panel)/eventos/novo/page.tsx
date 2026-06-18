"use client";

import { useRouter } from "next/navigation";
import { EventForm, emptyEventForm } from "@/components/admin/EventForm";
import { useEvents } from "@/context/EventsContext";
import type { EventFormData } from "@/components/admin/EventForm";

export default function NewEventPage() {
  const router = useRouter();
  const { addEvent } = useEvents();

  const handleSubmit = async (data: EventFormData) => {
    try {
      await addEvent(data);
      router.push("/admin/eventos");
    } catch {
      alert("Não foi possível criar o evento. Verifique se a API está online.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Novo evento</h1>
      <p className="mt-1 text-sm text-slate-500">Preencha os dados para publicar no catálogo</p>
      <div className="mt-6">
        <EventForm
          initial={emptyEventForm()}
          onSubmit={handleSubmit}
          submitLabel="Publicar evento"
        />
      </div>
    </div>
  );
}
