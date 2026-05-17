import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const LOGO_PATH = "/img/AGENTS.png";

type LogoProps = {
  className?: string;
  height?: number;
  asLink?: boolean;
  priority?: boolean;
};

export function Logo({
  className,
  height = 36,
  asLink = true,
  priority = false,
}: LogoProps) {
  const image = (
    <Image
      src={LOGO_PATH}
      alt="Uai Tickets"
      width={Math.round(height * 3.2)}
      height={height}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ height, width: "auto" }}
      priority={priority}
    />
  );

  if (!asLink) return image;

  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  );
}
