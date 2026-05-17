import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "brand",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: "brand" | "emerald" | "amber";
}) {
  const accents = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            accents[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
