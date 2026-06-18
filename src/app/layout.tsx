import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import { BRAND_TAGLINE } from "@/lib/brand";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND_TAGLINE,
    template: "%s | Uai Tickets",
  },
  description:
    "Checkout seguro, ingressos digitais com QR Code e gestão completa para produtores e compradores.",
  icons: {
    icon: "/img/favicon.png",
    shortcut: "/img/favicon.png",
    apple: "/img/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
