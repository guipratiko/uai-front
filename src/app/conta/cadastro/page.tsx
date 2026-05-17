"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfileAvatar } from "@/components/account/ProfileAvatar";
import { useAuth } from "@/context/AuthContext";
import { formatCpf } from "@/lib/cpf";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cpf: "",
    phone: "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
        cpf: user.cpf ? formatCpf(user.cpf) : "",
        phone: user.phone,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      fullName: form.fullName,
      cpf: form.cpf.replace(/\D/g, ""),
      phone: form.phone,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Alterar cadastro</h1>
      <p className="mt-1 text-sm text-slate-500">
        Foto de perfil e dados da sua conta
      </p>

      <div className="mt-8 border-b border-slate-100 pb-8">
        <ProfileAvatar size="lg" />
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-4">
        <Input
          label="Nome completo"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <Input
          label="E-mail"
          type="email"
          value={form.email}
          disabled
          hint="O e-mail não pode ser alterado"
        />
        <Input
          label="CPF"
          value={form.cpf}
          onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })}
        />
        <Input
          label="Telefone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {saved && (
          <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
            Cadastro atualizado com sucesso!
          </p>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
