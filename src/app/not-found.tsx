import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageShell className="flex flex-1 items-center justify-center bg-white">
      <div className="px-4 py-20 text-center">
        <p className="text-6xl font-bold text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Página não encontrada</h1>
        <p className="mt-2 text-slate-600">O evento ou página que você busca não existe.</p>
        <Link href="/" className="mt-8 inline-block">
          <Button>Voltar ao início</Button>
        </Link>
      </div>
    </PageShell>
  );
}
