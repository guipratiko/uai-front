import { Footer } from "./Footer";
import { Header } from "./Header";

export function PageShell({
  children,
  className,
  hideHeader = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Oculta o header (usado na home — menu fica no hero) */
  hideHeader?: boolean;
}) {
  return (
    <>
      {!hideHeader && <Header />}
      <main className={className ?? "flex-1"}>{children}</main>
      <Footer />
    </>
  );
}
