"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  value,
  min = 0,
  max = 99,
  onChange,
  size = "md",
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-slate-200 bg-white",
        size === "sm" ? "h-9" : "h-11",
      )}
    >
      <button
        type="button"
        aria-label="Diminuir quantidade"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-full items-center justify-center px-3 text-slate-600 transition-colors hover:bg-brand-50 disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        className={cn(
          "min-w-[2.5rem] text-center font-semibold text-slate-900",
          size === "sm" ? "text-sm" : "text-base",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-full items-center justify-center px-3 text-slate-600 transition-colors hover:bg-brand-50 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
