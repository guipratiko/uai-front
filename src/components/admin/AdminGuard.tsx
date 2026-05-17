"use client";

import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
}
