"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfileAvatar } from "@/components/account/ProfileAvatar";
import { useAuth } from "@/context/AuthContext";
import { formatCpf } from "@/lib/cpf";
import { BRAZIL_STATES, GENDER_OPTIONS, type UserGender } from "@/lib/brazil-states";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cpf: "",
    phone: "",
    gender: "unspecified" as UserGender,
    city: "",
    state: "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
        cpf: user.cpf ? formatCpf(user.cpf) : "",
        phone: user.phone,
        gender: user.gender ?? "unspecified",
        city: user.city ?? "",
        state: user.state ?? "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.city.trim()) {
      setError("Informe sua cidade");
      return;
    }
    if (!form.state) {
      setError("Selecione o estado");
      return;
    }
    setError("");
    setSaving(true);
    await updateProfile({
      fullName: form.fullName,
      cpf: form.cpf.replace(/\D/g, ""),
      phone: form.phone,
      gender: form.gender,
      city: form.city.trim(),
      state: form.state,
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
        <div className="space-y-1.5">
          <label htmlFor="profile-gender" className="block text-sm font-medium text-slate-700">
            Gênero
          </label>
          <select
            id="profile-gender"
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value as UserGender })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Cidade"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <div className="space-y-1.5">
          <label htmlFor="profile-state" className="block text-sm font-medium text-slate-700">
            Estado
          </label>
          <select
            id="profile-state"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Selecione a UF</option>
            {BRAZIL_STATES.map((s) => (
              <option key={s.uf} value={s.uf}>
                {s.uf} — {s.name}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
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
