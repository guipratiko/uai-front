export function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "");
  }
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";
  return api.replace(/\/api\/?$/, "");
}

function extractUploadPath(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  let pathname = trimmed;
  if (!trimmed.startsWith("/")) {
    try {
      pathname = new URL(trimmed).pathname;
    } catch {
      return null;
    }
  } else {
    pathname = trimmed.split("?")[0].split("#")[0];
  }

  if (!pathname.startsWith("/uploads/")) return null;
  const filename = pathname.slice(pathname.lastIndexOf("/") + 1);
  if (!filename || !filename.includes(".")) return null;

  return pathname;
}

/** Corrige URLs de upload (avatar, hero) vindas da API — inclusive localhost em produção. */
export function resolveAssetUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const path = extractUploadPath(trimmed);
  if (!path) return null;
  return `${getApiBase()}${path}`;
}
