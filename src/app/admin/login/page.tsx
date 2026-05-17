"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdmin, isLoading } = useAdmin();
  const [email, setEmail] = useState("admin@uaitickets.com.br");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAdmin) router.replace("/admin");
  }, [isAdmin, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) router.push("/admin");
    else setError(result.error ?? "Erro ao entrar");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex justify-center">
          <Logo height={44} asLink={false} />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">
          Admin Uai Tickets
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Gestão de eventos e métricas
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hint="Use as credenciais de administrador configuradas no servidor"
          />
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Entrando..." : "Entrar no painel"}
          </Button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-brand-600 hover:text-brand-700">
            Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  );
}
