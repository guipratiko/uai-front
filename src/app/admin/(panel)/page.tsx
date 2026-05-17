"use client";

import { Calendar, DollarSign, ShoppingCart, Ticket } from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { formatMetricCurrency } from "@/lib/admin-metrics";

export default function AdminDashboardPage() {
  const { metrics, loading, error } = useAdminMetrics();

  if (loading) {
    return <p className="text-slate-500">Carregando métricas...</p>;
  }

  if (error || !metrics) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error ?? "Não foi possível carregar as métricas"}
      </p>
    );
  }

  const maxRevenue = Math.max(...metrics.revenueByEvent.map((e) => e.revenue), 1);
  const maxDay = Math.max(...metrics.salesByDay.map((d) => d.count), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Métricas</h1>
      <p className="mt-1 text-sm text-slate-500">
        Dados em tempo real das vendas na plataforma
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Receita total"
          value={formatMetricCurrency(metrics.totalRevenue)}
          icon={DollarSign}
          accent="emerald"
        />
        <MetricCard
          label="Ingressos vendidos"
          value={String(metrics.ticketsSold)}
          icon={Ticket}
        />
        <MetricCard
          label="Pedidos"
          value={String(metrics.ordersCount)}
          icon={ShoppingCart}
          accent="amber"
        />
        <MetricCard
          label="Eventos ativos"
          value={String(metrics.eventsActive)}
          icon={Calendar}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Vendas por evento</h2>
          <ul className="mt-6 space-y-4">
            {metrics.revenueByEvent.length === 0 ? (
              <li className="text-sm text-slate-500">Nenhuma venda registrada</li>
            ) : (
              metrics.revenueByEvent.map((row) => (
                <li key={row.name}>
                  <div className="flex justify-between text-sm">
                    <span className="line-clamp-1 font-medium text-slate-700">
                      {row.name}
                    </span>
                    <span className="shrink-0 font-semibold text-brand-700">
                      {formatMetricCurrency(row.revenue)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${(row.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{row.tickets} ingressos</p>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Últimos 7 dias</h2>
          <div className="mt-6 flex h-48 items-end justify-between gap-2">
            {metrics.salesByDay.map((day) => (
              <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-brand-400"
                  style={{
                    height: `${Math.max(8, (day.count / maxDay) * 100)}%`,
                    minHeight: day.count > 0 ? "12px" : "4px",
                  }}
                  title={`${day.count} ingressos`}
                />
                <span className="text-[10px] uppercase text-slate-500">{day.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Formas de pagamento</h2>
        <div className="mt-4 flex flex-wrap gap-6">
          {metrics.paymentSplit.length === 0 ? (
            <p className="text-sm text-slate-500">Sem vendas ainda</p>
          ) : (
            metrics.paymentSplit.map((p) => (
              <div key={p.method} className="text-center">
                <p className="text-2xl font-bold text-brand-700">{p.count}</p>
                <p className="text-sm text-slate-500">{p.method}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
