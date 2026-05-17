"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { formatCpf, isValidCpf, onlyDigits } from "@/lib/cpf";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/conta/ingressos";
  const { register, isAuthenticated, isLoading } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof form, string>>>(
    {},
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace(redirect);
  }, [isAuthenticated, isLoading, redirect, router]);

  const validate = (): Partial<Record<keyof typeof form, string>> => {
    const next: Partial<Record<keyof typeof form, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Informe seu nome completo";
    if (!form.email.includes("@")) next.email = "Informe um e-mail válido";
    const cpfDigits = onlyDigits(form.cpf);
    if (!cpfDigits) next.cpf = "Informe seu CPF";
    else if (!isValidCpf(form.cpf)) next.cpf = "CPF inválido";
    if (form.phone && form.phone.replace(/\D/g, "").length < 10) {
      next.phone = "Telefone inválido";
    }
    if (form.password.length < 4) next.password = "A senha deve ter pelo menos 4 caracteres";
    if (form.password !== form.confirmPassword) {
      next.confirmPassword = "As senhas não coincidem";
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("Corrija os campos destacados");
      return;
    }

    setError("");
    setFieldErrors({});
    setLoading(true);
    const result = await register({
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      cpf: onlyDigits(form.cpf),
      phone: form.phone,
    });
    setLoading(false);

    if (result.ok) router.push(redirect);
    else setError(result.error ?? "Não foi possível criar a conta");
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex justify-center">
          <Logo height={48} asLink={false} />
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">
          Criar conta
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Cadastre-se para acessar seus ingressos a qualquer momento
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            label="Nome completo"
            name="fullName"
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => {
              setForm({ ...form, fullName: e.target.value });
              if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: undefined }));
            }}
            placeholder="Seu nome"
            error={fieldErrors.fullName}
          />
          <Input
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
            }}
            placeholder="seu@email.com"
            error={fieldErrors.email}
          />
          <Input
            label="CPF"
            name="cpf"
            inputMode="numeric"
            autoComplete="off"
            value={form.cpf}
            onChange={(e) => {
              setForm({ ...form, cpf: formatCpf(e.target.value) });
              if (fieldErrors.cpf) setFieldErrors((p) => ({ ...p, cpf: undefined }));
            }}
            onBlur={() => {
              const digits = onlyDigits(form.cpf);
              if (digits.length === 11 && !isValidCpf(form.cpf)) {
                setFieldErrors((p) => ({ ...p, cpf: "CPF inválido" }));
              }
            }}
            placeholder="000.000.000-00"
            error={fieldErrors.cpf}
          />
          <Input
            label="Telefone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => {
              setForm({ ...form, phone: e.target.value });
              if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
            }}
            placeholder="(00) 00000-0000"
            hint="Opcional"
            error={fieldErrors.phone}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
            }}
            placeholder="••••••••"
            hint="Mínimo de 4 caracteres"
            error={fieldErrors.password}
          />
          <Input
            label="Confirmar senha"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => {
              setForm({ ...form, confirmPassword: e.target.value });
              if (fieldErrors.confirmPassword) {
                setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
              }
            }}
            placeholder="••••••••"
            error={fieldErrors.confirmPassword}
          />
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Já tem uma conta?{" "}
          <Link
            href={`/login${redirect !== "/conta/ingressos" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <PageShell className="bg-brand-50">
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-slate-500">Carregando...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </PageShell>
  );
}
