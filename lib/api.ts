const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

let cachedToken: { token: string; exp: number } | null = null;

/**
 * Retrieves the short-lived JWT token from Next.js /api/token route.
 * Caches token in-memory for 45 minutes to minimize internal roundtrips.
 */
export async function getJwtToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch("/api/token", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("User session not found or expired. Please log in.");
  }

  const data = await res.json();
  cachedToken = {
    token: data.token,
    exp: Date.now() + 45 * 60 * 1000,
  };

  return data.token;
}

export function clearTokenCache() {
  cachedToken = null;
}

/**
 * Universal fetcher for Rentara Express backend API.
 */
export async function api<T = any>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (requiresAuth) {
    try {
      const token = await getJwtToken();
      headers.Authorization = `Bearer ${token}`;
    } catch (err: any) {
      throw new Error(err.message || "Authentication token required");
    }
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const targetUrl = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${normalizedEndpoint}`;

  const res = await fetch(targetUrl, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}
