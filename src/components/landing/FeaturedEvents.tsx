import { EventsGrid } from "@/components/landing/EventsGrid";

export function FeaturedEvents() {
  return (
    <section id="eventos" className="bg-brand-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Em cartaz
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Eventos imperdíveis
          </h2>
          <p className="mt-4 text-slate-600">
            Os melhores eventos de Goiás com ingressos disponíveis agora.
          </p>
        </div>
        <EventsGrid />
      </div>
    </section>
  );
}
