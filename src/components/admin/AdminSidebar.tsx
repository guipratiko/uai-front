"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarPlus,
  ImageIcon,
  LayoutDashboard,
  List,
  LogOut,
  ScanLine,
  BarChart3,
  Tag,
  Ticket,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAdmin } from "@/context/AdminContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Métricas", icon: LayoutDashboard, exact: true },
  { href: "/admin/eventos", label: "Eventos", icon: List, exact: false },
  { href: "/admin/eventos/novo", label: "Novo evento", icon: CalendarPlus, exact: true },
  { href: "/admin/hero", label: "Banners home", icon: ImageIcon, exact: false },
  { href: "/admin/cupons", label: "Cupons", icon: Tag, exact: false },
  { href: "/admin/check-in", label: "Check-in", icon: ScanLine, exact: false },
  { href: "/admin/produtores", label: "Produtores", icon: BarChart3, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdmin();

  return (
    <aside className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm lg:w-64 lg:shrink-0">
      <div className="border-b border-slate-100 p-5">
        <Logo height={36} asLink={false} />
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-600">
          Painel administrativo
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-500 text-white"
                  : "text-slate-600 hover:bg-brand-50 hover:text-brand-700",
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-100 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Ticket className="h-4 w-4" />
          Ver site
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/admin/login");
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
