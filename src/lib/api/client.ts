import type { ApiErrorBody } from "@/types/api";

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

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiOrigin();

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("We could not connect to the API. Check your connection and try again, or contact the studio directly.", 0);
  }

  let payload: ApiErrorBody | T | null = null;
  const responseBody = await response.text();
  if (responseBody) {
    try {
      payload = JSON.parse(responseBody) as ApiErrorBody | T;
    } catch {
      if (response.ok) {
        throw new ApiError("The server returned an unreadable response.", response.status);
      }
    }
  }

  if (!response.ok) {
    const error = payload && typeof payload === "object" && "message" in payload ? payload : null;
    throw new ApiError(
      error?.message ?? `Your request could not be completed (HTTP ${response.status}). Please try again.`,
      response.status,
      error && "errors" in error ? error.errors : undefined,
    );
  }
  if (payload === null) throw new ApiError("The server returned an empty response.", response.status);
  return payload as T;
}
