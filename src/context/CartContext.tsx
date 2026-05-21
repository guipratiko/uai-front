"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BuyerInfo, CartItem, IssuedTicket, Order, PaymentMethod } from "@/types";
import { api, getUserToken } from "@/lib/api";
import { reconcileCartItems } from "@/lib/reconcile-cart";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/context/EventsContext";

const DEFAULT_BUYER_FEE_PERCENT = 10;
const CART_STORAGE_KEY = "uai-tickets-cart";
const GUEST_TICKETS_KEY = "uai-tickets-guest";
const LAST_ORDER_KEY = "uai-tickets-last-order";

type CartContextValue = {
  /** true após ler sessionStorage no cliente (evita flash/redirect indevido no SSR) */
  cartReady: boolean;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  serviceFeeLabel: string;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (ticketId: string, eventId: string, quantity: number) => void;
  removeItem: (ticketId: string, eventId: string) => void;
  clearCart: () => void;
  startCheckout: (
    buyer: BuyerInfo,
    paymentMethod: PaymentMethod,
  ) => Promise<{ orderId: string; checkoutUrl: string }>;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  issuedTickets: IssuedTicket[];
  refreshTickets: () => Promise<void>;
  ticketsLoading: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function loadLastOrder(): Order | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { events, isReady: eventsReady } = useEvents();
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrderState] = useState<Order | null>(null);
  const [issuedTickets, setIssuedTickets] = useState<IssuedTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setLastOrderState(loadLastOrder());
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady || !eventsReady || events.length === 0) return;
    setItems((prev) => {
      const next = reconcileCartItems(prev, events);
      return next.length === prev.length &&
        next.every(
          (item, i) =>
            item.ticketId === prev[i]?.ticketId && item.unitPrice === prev[i]?.unitPrice,
        )
        ? prev
        : next;
    });
  }, [storageReady, eventsReady, events]);

  const setLastOrder = useCallback((order: Order | null) => {
    setLastOrderState(order);
    if (typeof window === "undefined") return;
    if (order) sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    else sessionStorage.removeItem(LAST_ORDER_KEY);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, storageReady]);

  const loadGuestTickets = useCallback((): IssuedTicket[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(GUEST_TICKETS_KEY);
      return raw ? (JSON.parse(raw) as IssuedTicket[]) : [];
    } catch {
      return [];
    }
  }, []);

  const refreshTickets = useCallback(async () => {
    if (!getUserToken()) {
      setIssuedTickets(loadGuestTickets());
      return;
    }
    setTicketsLoading(true);
    try {
      const data = await api<{ tickets: IssuedTicket[] }>("/orders/tickets/me");
      setIssuedTickets(data.tickets);
    } catch {
      setIssuedTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  }, [loadGuestTickets]);

  useEffect(() => {
    if (isAuthenticated) refreshTickets();
    else setIssuedTickets(loadGuestTickets());
  }, [isAuthenticated, refreshTickets, loadGuestTickets]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );
  const serviceFee = useMemo(() => {
    const fee = items.reduce((sum, i) => {
      const pct = i.buyerFeePercent ?? DEFAULT_BUYER_FEE_PERCENT;
      return sum + i.unitPrice * i.quantity * (pct / 100);
    }, 0);
    return Math.round(fee * 100) / 100;
  }, [items]);

  const serviceFeeLabel = useMemo(() => {
    if (items.length === 0) return "Taxa de serviço";
    const rates = new Set(items.map((i) => i.buyerFeePercent ?? DEFAULT_BUYER_FEE_PERCENT));
    if (rates.size === 1) return `Taxa de serviço (${[...rates][0]}%)`;
    return "Taxa de serviço";
  }, [items]);
  const total = subtotal + serviceFee;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.ticketId === item.ticketId && i.eventId === item.eventId,
        );
        if (existing) {
          return prev.map((i) =>
            i.ticketId === item.ticketId && i.eventId === item.eventId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (ticketId: string, eventId: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => !(i.ticketId === ticketId && i.eventId === eventId)),
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.ticketId === ticketId && i.eventId === eventId ? { ...i, quantity } : i,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((ticketId: string, eventId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.ticketId === ticketId && i.eventId === eventId)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const startCheckout = useCallback(
    async (buyer: BuyerInfo, paymentMethod: PaymentMethod) => {
      const result = await api<{ orderId: string; checkoutUrl: string }>(
        "/checkout/session",
        {
          method: "POST",
          body: JSON.stringify({ items, buyer, paymentMethod }),
          token: getUserToken(),
        },
      );
      return result;
    },
    [items],
  );

  const value = useMemo(
    () => ({
      cartReady: storageReady,
      items,
      itemCount,
      subtotal,
      serviceFee,
      serviceFeeLabel,
      total,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      startCheckout,
      lastOrder,
      setLastOrder,
      issuedTickets,
      refreshTickets,
      ticketsLoading,
    }),
    [
      storageReady,
      items,
      itemCount,
      subtotal,
      serviceFee,
      serviceFeeLabel,
      total,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      startCheckout,
      lastOrder,
      setLastOrder,
      issuedTickets,
      refreshTickets,
      ticketsLoading,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
