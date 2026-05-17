"use client";

import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#eventos", label: "Eventos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#faq", label: "FAQ" },
];

type HeaderProps = {
  /** Menu integrado ao banner hero (home) */
  embedded?: boolean;
};

export function Header({ embedded = false }: HeaderProps) {
  const hydrated = useHydrated();
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hydrated]);

  const displayItemCount = hydrated ? itemCount : 0;
  const overHero = embedded && !scrolled;

  if (!hydrated) {
    return (
      <header
        className={cn(
          "z-50 h-16 border-b border-brand-100/80 bg-white/90",
          embedded ? "absolute inset-x-0 top-0" : "sticky top-0",
        )}
        aria-hidden
      />
    );
  }
  const menuText = (extra?: string) =>
    cn(extra, overHero && "menu-text-outline");

  return (
    <header
      className={cn(
        "z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        embedded
          ? scrolled
            ? "fixed inset-x-0 top-0 border-b border-brand-100/80 bg-white/85 shadow-sm backdrop-blur-md"
            : "absolute inset-x-0 top-0 border-b border-transparent bg-transparent"
          : cn(
              "sticky top-0",
              scrolled
                ? "border-b border-brand-100/80 bg-white/85 shadow-sm backdrop-blur-md"
                : "border-b border-transparent bg-transparent",
            ),
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo height={60} priority />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={menuText(
                cn(
                  "text-sm font-medium transition-colors",
                  overHero
                    ? "text-white/90 hover:text-white"
                    : "text-brand-800 hover:text-brand-500",
                ),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={isAuthenticated ? "/conta/ingressos" : "/login"}
            className={menuText(
              cn(
                "hidden text-sm font-medium transition-colors sm:block",
                overHero
                  ? "text-white/90 hover:text-white"
                  : "text-brand-800 hover:text-brand-500",
              ),
            )}
          >
            {isAuthenticated ? "Minha conta" : "Entrar"}
          </Link>
          <Link
            href="/carrinho"
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              overHero
                ? "bg-white/15 text-white hover:bg-white/25"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100",
            )}
            aria-label={`Carrinho com ${displayItemCount} itens`}
          >
            <ShoppingCart className="h-5 w-5" />
            {displayItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-white">
                {displayItemCount > 9 ? "9+" : displayItemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl md:hidden",
              overHero
                ? "text-white hover:bg-white/15"
                : "text-brand-700 hover:bg-brand-50",
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t md:hidden",
          mobileOpen ? "block" : "hidden",
          overHero
            ? "border-white/15 bg-black/40 backdrop-blur-md"
            : "border-brand-100/80 bg-white/90 backdrop-blur-md",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={menuText(
                cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  overHero
                    ? "text-white hover:bg-white/10"
                    : "text-brand-800 hover:bg-brand-50",
                ),
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={isAuthenticated ? "/conta/ingressos" : "/login"}
            onClick={() => setMobileOpen(false)}
            className={menuText(
              cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium",
                overHero
                  ? "text-white hover:bg-white/10"
                  : "text-brand-800 hover:bg-brand-50",
              ),
            )}
          >
            {isAuthenticated ? "Minha conta" : "Entrar"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
