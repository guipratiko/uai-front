import { AccountGuard } from "@/components/account/AccountGuard";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { PageShell } from "@/components/layout/PageShell";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell className="bg-slate-100">
      <AccountGuard>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <AccountSidebar />
            <div>{children}</div>
          </div>
        </div>
      </AccountGuard>
    </PageShell>
  );
}
