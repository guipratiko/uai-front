import Image from "next/image";
import Link from "next/link";
import { AtSign, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const ONLYFLOW_LOGO_PATH = "/img/OnlyFlow-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-brand-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo height={40} />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              A plataforma goiana de venda de ingressos. Eventos, checkout seguro e
              ingressos digitais com QR Code, com o jeitinho uai de fazer as coisas
              direito.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Av. Castelo Branco, Qd. R25 Lt. 08, nº 590, Sala 05
                  <br />
                  Setor Oeste — Goiânia, GO
                </span>
              </p>
              <p className="pl-6">CNPJ: 60.553.248/0001-01</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white">Plataforma</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/#eventos" className="hover:text-brand-300">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/ingressos" className="hover:text-brand-300">
                  Meus ingressos
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-brand-300">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-brand-300">
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-brand-300">
                  Área do produtor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Contato</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="mailto:suporte@uaitickets.com.br"
                  className="flex items-center gap-2 hover:text-brand-300"
                >
                  <Mail className="h-4 w-4" />
                  suporte@uaitickets.com.br
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-brand-300"
                >
                  <AtSign className="h-4 w-4" />
                  @uaitickets
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Uai Tickets. Todos os direitos reservados.</p>
          <a
            href="https://www.onlyflow.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 transition-opacity hover:opacity-90 sm:items-end"
          >
            <span>Desenvolvido por</span>
            <Image
              src={ONLYFLOW_LOGO_PATH}
              alt="OnlyFlow"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
