import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "outline";
}) {
  const styles = {
    default: "bg-brand-100 text-brand-800",
    accent: "bg-brand-500 text-white",
    outline: "border border-brand-200 text-brand-700 bg-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
