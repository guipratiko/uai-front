"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function IngressosRedirectPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    router.replace(
      isAuthenticated ? "/conta/ingressos" : "/login?redirect=%2Fconta%2Fingressos",
    );
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
      Redirecionando...
    </div>
  );
}
