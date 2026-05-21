import type { FAQItem } from "@/types";

export const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    category: "Compra",
    question: "Como funciona a compra de ingressos?",
    answer:
      "Escolha o evento, selecione o tipo e quantidade de ingressos, finalize o checkout com seus dados e método de pagamento. Após a confirmação (simulada nesta versão), seus ingressos com QR Code ficam disponíveis na área Meus Ingressos.",
  },
  {
    id: "faq-2",
    category: "Compra",
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Em breve: Pix, cartão de crédito e boleto via integração Asaas. Nesta demonstração, o fluxo de pagamento é apenas visual — nenhuma cobrança real é realizada.",
  },
  {
    id: "faq-3",
    category: "Ingressos",
    question: "Como acesso meus ingressos após a compra?",
    answer:
      "Após a confirmação, você receberá (em produção) um e-mail com link para baixar os ingressos. Cada ingresso possui um QR Code único para validação na entrada do evento.",
  },
  {
    id: "faq-4",
    category: "Ingressos",
    question: "Posso transferir meu ingresso para outra pessoa?",
    answer:
      "Sim, quando o evento permite: em Meus ingressos, use Transferir e informe nome e e-mail do novo titular. Cada ingresso pode ser transferido uma vez; o QR Code anterior deixa de valer e o novo titular recebe um e-mail com o ingresso atualizado. Não é possível transferir cortesias, ingressos já validados no check-in ou eventos em que o organizador desativou a transferência.",
  },
  {
    id: "faq-5",
    category: "Evento",
    question: "O que fazer se o evento for cancelado?",
    answer:
      "Em caso de cancelamento pelo organizador, os compradores serão notificados e o reembolso seguirá a política do evento e a legislação vigente. O Uai Tickets atuará como intermediário na comunicação.",
  },
  {
    id: "faq-6",
    category: "Acesso",
    question: "Como funciona a entrada no evento?",
    answer:
      "Apresente o QR Code do ingresso (tela do celular ou impressão) na catraca. Cada código é válido para um único acesso. Chegue com antecedência para evitar filas.",
  },
  {
    id: "faq-7",
    category: "Suporte",
    question: "Não recebi meu ingresso por e-mail. E agora?",
    answer:
      "Verifique a caixa de spam. Se o problema persistir, acesse Meus Ingressos com o e-mail usado na compra ou entre em contato com suporte@uaitickets.com.br.",
  },
  {
    id: "faq-8",
    category: "Taxas",
    question: "Existe taxa de serviço?",
    answer:
      "Sim. Uma taxa de conveniência de 10% é aplicada sobre o subtotal dos ingressos, destinada à manutenção da plataforma, suporte e tecnologia de validação.",
  },
];
