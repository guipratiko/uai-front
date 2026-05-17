"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/conta/ingressos";
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace(redirect);
  }, [isAuthenticated, isLoading, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) router.push(redirect);
    else setError(result.error ?? "Não foi possível entrar");
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex justify-center">
          <Logo height={48} asLink={false} />
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">
          Entrar na sua conta
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Acesse seus ingressos e pedidos
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
          <div>
            <Input
              label="Senha"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              hint="Mínimo de 4 caracteres"
            />
            <p className="mt-1.5 text-right">
              <Link
                href="/recuperar-senha"
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                Esqueci minha senha
              </Link>
            </p>
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Ainda não tem conta?{" "}
          <Link
            href={`/registro${redirect !== "/conta/ingressos" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageShell className="bg-brand-50">
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-slate-500">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </PageShell>
  );
}
