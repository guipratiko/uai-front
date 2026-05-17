import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function FavoritesPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <Heart className="mx-auto h-12 w-12 text-slate-300" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Eventos favoritos</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Você ainda não favoritou eventos. Explore o catálogo e salve os que mais
        interessam — recurso em breve.
      </p>
      <Link href="/#eventos" className="mt-6 inline-block">
        <Button>Explorar eventos</Button>
      </Link>
    </div>
  );
}
