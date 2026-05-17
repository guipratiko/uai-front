"use client";

import { useParams, useRouter } from "next/navigation";
import { EventForm, eventToForm } from "@/components/admin/EventForm";
import { useEvents } from "@/context/EventsContext";
import type { EventFormData } from "@/components/admin/EventForm";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getEventById, updateEvent } = useEvents();
  const event = getEventById(id);

  if (!event) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Evento não encontrado.
      </p>
    );
  }

  const handleSubmit = async (data: EventFormData) => {
    const { slug, ...rest } = data;
    try {
      await updateEvent(id, { ...rest, slug });
      router.push("/admin/eventos");
    } catch {
      alert("Não foi possível salvar o evento.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Editar evento</h1>
      <p className="mt-1 text-sm text-slate-500">{event.title}</p>
      <div className="mt-6">
        <EventForm
          initial={eventToForm(event)}
          onSubmit={handleSubmit}
          submitLabel="Salvar alterações"
        />
      </div>
    </div>
  );
}
