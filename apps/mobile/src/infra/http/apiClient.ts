export type IdTokenProvider = () => Promise<string | null>;

/** Thin fetch wrapper for the Node/Prisma backend: injects the Firebase ID token and normalizes errors. */
export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly getIdToken: IdTokenProvider,
  ) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.getIdToken();
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(body.error ?? `Request to ${path} failed with status ${res.status}`);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: "POST", body: JSON.stringify(body) });
  }
}
