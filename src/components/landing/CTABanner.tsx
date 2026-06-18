import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTABanner() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-950 px-8 py-14 text-center text-white sm:px-16">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/30 blur-2xl" />
          <h2 className="relative text-3xl font-bold sm:text-4xl">
            Pronto para viver momentos inesquecíveis?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-slate-300">
            Garanta seu lugar nos melhores eventos. Processo rápido, seguro e sem
            complicação.
          </p>
          <Link href="/#eventos" className="relative mt-8 inline-block">
            <Button size="lg" variant="secondary">
              Ver todos os eventos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
