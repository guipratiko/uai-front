export function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "");
  }
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";
  return api.replace(/\/api\/?$/, "");
}
