import { CreditCard, QrCode, Search, Ticket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Escolha o evento",
    description: "Navegue pelo catálogo e encontre a experiência perfeita para você.",
  },
  {
    icon: Ticket,
    title: "Selecione os ingressos",
    description: "Escolha o tipo, quantidade e adicione ao carrinho em poucos cliques.",
  },
  {
    icon: CreditCard,
    title: "Finalize o pagamento",
    description: "Pix, cartão ou boleto (em breve via Asaas). Nesta demo, fluxo simulado.",
  },
  {
    icon: QrCode,
    title: "Apresente o QR Code",
    description: "Receba seus ingressos digitais e entre no evento com validação rápida.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Simples assim
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Como funciona
          </h2>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
