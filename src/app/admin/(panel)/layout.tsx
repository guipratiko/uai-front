"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:flex-row lg:p-8">
          <AdminSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
