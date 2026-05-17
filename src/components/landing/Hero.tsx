import Link from "next/link";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroVideo } from "@/components/landing/HeroVideo";
import { Header } from "@/components/layout/Header";

export function Hero() {
  return (
    <section className="relative min-h-[520px] overflow-hidden bg-black text-white sm:min-h-[600px] lg:min-h-[680px]">
      <HeroVideo />
      <Header embedded />

      <div className="relative mx-auto flex min-h-[inherit] max-w-7xl items-center px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Seu evento começa com o{" "}
            <span className="text-brand-300">ingresso certo</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
            Descubra festivais, shows e experiências incríveis. Compre em segundos,
            receba seu ingresso digital com QR Code e entre sem fila.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/#eventos">
              <Button size="lg" variant="secondary">
                Explorar eventos
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/eventos/festival-sertanejo-bh">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Evento em destaque
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-300" />
              Compra 100% segura
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-300" />
              Ingresso instantâneo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
