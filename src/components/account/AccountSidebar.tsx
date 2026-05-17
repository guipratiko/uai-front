"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, Ticket, User } from "lucide-react";
import { ProfileAvatar } from "@/components/account/ProfileAvatar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "/conta/ingressos", label: "Meus ingressos", icon: Ticket },
  { href: "/conta/cadastro", label: "Alterar cadastro", icon: User },
  { href: "/conta/favoritos", label: "Eventos favoritos", icon: Heart },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center border-b border-slate-100 pb-6 text-center">
        <ProfileAvatar size="md" showActions={false} />
        <p className="mt-4 text-sm font-semibold text-slate-900">{user?.fullName}</p>
        <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
        <Link
          href="/conta/cadastro"
          className="mt-2 text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          Editar perfil
        </Link>
      </div>

      <nav className="mt-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
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
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair
        </button>
      </nav>
    </aside>
  );
}
