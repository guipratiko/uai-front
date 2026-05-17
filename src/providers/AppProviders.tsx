"use client";

import { AdminProvider } from "@/context/AdminContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { EventsProvider } from "@/context/EventsContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <EventsProvider>
        <AdminProvider>
          <CartProvider>{children}</CartProvider>
        </AdminProvider>
      </EventsProvider>
    </AuthProvider>
  );
}
