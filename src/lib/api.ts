const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

const TOKEN_KEY = "uai-tickets-token";
const ADMIN_TOKEN_KEY = "uai-tickets-admin-token";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setUserToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

type ApiOptions = RequestInit & {
  token?: string | null;
  admin?: boolean;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, admin, headers, ...rest } = options;
  const authToken =
    token !== undefined
      ? token
      : admin
        ? getAdminToken()
        : getUserToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(res.status, body.error ?? "Erro na requisição");
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiFormData<T>(
  path: string,
  formData: FormData,
  options: { admin?: boolean; method?: string } = {},
): Promise<T> {
  const authToken = options.admin ? getAdminToken() : getUserToken();
  const method = options.method ?? "POST";

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(res.status, body.error ?? "Erro na requisição");
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
