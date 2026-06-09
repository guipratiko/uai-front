export function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "");
  }
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";
  return api.replace(/\/api\/?$/, "");
}

/** Corrige URLs de upload (avatar, hero) vindas da API — inclusive localhost em produção. */
export function resolveAssetUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const path = url.match(/(\/uploads\/[^/?#]+)/)?.[1];
  if (path) return `${getApiBase()}${path}`;
  return url;
}
