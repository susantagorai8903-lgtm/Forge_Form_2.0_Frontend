import { ApiError } from "@forge-form/shared/api";

export class AdminRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "AdminRequestError";
  }
}

export async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin-proxy/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const text = await response.text();
  let payload: unknown;
  try {
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    throw new AdminRequestError("The administrative service returned an invalid response.", response.status);
  }
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
      ? payload.message
      : `The request failed (HTTP ${response.status}).`;
    throw new AdminRequestError(message, response.status);
  }
  return payload as T;
}

export function errorMessage(error: unknown): string {
  if (error instanceof AdminRequestError || error instanceof ApiError) return error.message;
  return "The request could not be completed.";
}
