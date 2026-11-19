export type ApiErrorBody = {
  message: string;
  errors?: Record<string, string[]>;
};

export type ApiRequestInit = RequestInit & {
  next?: { revalidate?: number };
};

export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;

  constructor(message: string, status: number, details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function getApiOrigin(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!configuredUrl) {
    throw new ApiError("Online submission is not configured yet. Please call or email the studio.", 503);
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new ApiError("The API URL must be an absolute backend origin.", 503);
  }

  if (
    !["http:", "https:"].includes(url.protocol)
    || url.username
    || url.password
    || (url.pathname !== "" && url.pathname !== "/")
    || url.search
    || url.hash
  ) {
    throw new ApiError("The API URL must contain only the backend origin, without an API path.", 503);
  }

  return url.origin;
}

function getApiPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/api/v1")) {
    throw new ApiError("API paths must be relative to the configured API version.", 500);
  }
  return `/api/v1${path}`;
}

export async function apiRequest<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const baseUrl = getApiOrigin();
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${getApiPath(path)}`, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError("We could not connect to the API. Check your connection and try again, or contact the studio directly.", 0);
  }

  const responseBody = await response.text();
  let payload: unknown = null;
  if (responseBody) {
    try {
      payload = JSON.parse(responseBody);
    } catch {
      if (response.ok) throw new ApiError("The server returned an unreadable response.", response.status);
    }
  }

  if (!response.ok) {
    const error = payload && typeof payload === "object" ? payload as Partial<ApiErrorBody> : null;
    throw new ApiError(
      typeof error?.message === "string"
        ? error.message
        : `Your request could not be completed (HTTP ${response.status}). Please try again.`,
      response.status,
      error?.errors,
    );
  }

  if (response.status === 204 || payload === null) return undefined as T;
  return payload as T;
}
