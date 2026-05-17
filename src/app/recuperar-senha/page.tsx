"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        token: null,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar o e-mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell className="bg-brand-50">
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="flex justify-center">
              <Logo height={48} asLink={false} />
            </div>

            <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">
              Recuperar senha
            </h1>
            <p className="mt-2 text-center text-sm text-slate-500">
              Enviaremos um link para redefinir sua senha
            </p>

            {sent ? (
              <div className="mt-8 rounded-xl bg-brand-50 p-4 text-center text-sm text-brand-800">
                Se o e-mail estiver cadastrado, você receberá as instruções em breve.
                Verifique também a caixa de spam.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <Input
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                )}
                <Button type="submit" fullWidth size="lg" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar link"}
                </Button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-slate-500">
              <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
                Voltar ao login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
