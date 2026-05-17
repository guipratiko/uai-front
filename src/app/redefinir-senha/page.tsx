"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Link inválido. Solicite um novo e-mail de recuperação.");
      return;
    }
    if (password.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await api<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        token: null,
      });
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível redefinir a senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex justify-center">
          <Logo height={48} asLink={false} />
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">
          Nova senha
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Escolha uma nova senha para sua conta
        </p>

        {done ? (
          <div className="mt-8 rounded-xl bg-brand-50 p-4 text-center text-sm text-brand-800">
            Senha redefinida! Redirecionando para o login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Nova senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="Mínimo de 4 caracteres"
            />
            <Input
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" fullWidth size="lg" disabled={loading || !token}>
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
            {!token && (
              <p className="text-center text-sm">
                <Link
                  href="/recuperar-senha"
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  Solicitar novo link
                </Link>
              </p>
            )}
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <PageShell className="bg-brand-50">
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-slate-500">Carregando...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </PageShell>
  );
}
