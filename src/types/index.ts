export type TicketTierStatus = "scheduled" | "active" | "closed";

export type TicketTier = {
  id: string;
  name: string;
  description: string;
  price: number;
  available: number;
  maxPerOrder: number;
  benefits?: string[];
  /** Mesmo texto em vários tipos = virada de lote. Vazio = vende em paralelo. */
  lotChainId?: string | null;
  sortOrder?: number;
  status?: TicketTierStatus;
  activateAt?: string | null;
  maxSales?: number | null;
  soldCount?: number;
  countCourtesyInCap?: boolean;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  image: string;
  bannerImage: string;
  description: string;
  highlights: string[];
  organizer: string;
  ageRating: string;
  mapEmbedUrl: string;
  coordinates: { lat: number; lng: number };
  tickets: TicketTier[];
  featured?: boolean;
  /** Null no banco = 10% ao comprador */
  buyerFeePercent?: number | null;
  /** Null = 0% — comissão Uai sobre bilheteria (relatório) */
  platformFeePercent?: number | null;
  /** false = evento não permite transferência de ingressos */
  allowTransfer?: boolean;
};

export type CartItem = {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  ticketId: string;
  ticketName: string;
  unitPrice: number;
  quantity: number;
  /** % taxa comprador do evento (10 se null) */
  buyerFeePercent?: number | null;
};

export type BuyerInfo = {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
};

export type PaymentMethod = "pix" | "credit_card";

export type Order = {
  id: string;
  items: CartItem[];
  buyer: BuyerInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  serviceFee: number;
  platformFee?: number;
  total: number;
  createdAt: string;
  status: "pending" | "confirmed" | "cancelled" | "expired";
  paidAt?: string | null;
};

export type User = {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  avatarUrl?: string | null;
};

export type IssuedTicket = {
  id: string;
  orderId: string;
  code: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  state: string;
  ticketName: string;
  lotLabel: string;
  categoryLabel: string;
  unitPrice: number;
  feeAmount: number;
  holderName: string;
  holderEmail: string;
  purchasedAt: string;
  status: "approved" | "pending";
  qrValue: string;
  source?: "sale" | "courtesy";
  transferCount?: number;
  transferredAt?: string | null;
  checkedInAt?: string | null;
  allowTransfer?: boolean;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};
