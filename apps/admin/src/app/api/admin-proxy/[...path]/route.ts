import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiError, apiRequest } from "@forge-form/shared/api";
import { endpoints } from "@forge-form/shared/endpoints";

type TokenResponse = { access_token: string; refresh_token: string; token_type: "bearer" };

type Context = { params: Promise<{ path: string[] }> };

async function backendRequest(
  path: string,
  request: NextRequest,
  body: string | undefined,
): Promise<unknown> {
  const cookieJar = await cookies();
  const accessToken = cookieJar.get("ff_admin_access")?.value;
  const refreshToken = cookieJar.get("ff_admin_refresh")?.value;
  if (!accessToken && !refreshToken) throw new ApiError("Authentication required.", 401);

  const init = {
    method: request.method,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    body,
  };
  try {
    return await apiRequest<unknown>(`/${path}${request.nextUrl.search}`, init);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !refreshToken) throw error;
  }

  let replacement: TokenResponse;
  try {
    replacement = await apiRequest<TokenResponse>(endpoints.refresh, {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      cookieJar.delete("ff_admin_access");
      cookieJar.delete("ff_admin_refresh");
      throw new ApiError("Your session has expired. Please sign in again.", 401);
    }
    throw error;
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
  cookieJar.set("ff_admin_access", replacement.access_token, cookieOptions);
  cookieJar.set("ff_admin_refresh", replacement.refresh_token, cookieOptions);
  return apiRequest<unknown>(`/${path}${request.nextUrl.search}`, {
    ...init,
    headers: { Authorization: `Bearer ${replacement.access_token}` },
  });
}

async function handle(request: NextRequest, context: Context) {
  if (request.method !== "GET" && request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ message: "Same-origin requests are required." }, { status: 403 });
  }

  const { path: segments } = await context.params;
  const path = segments.join("/");
  if (
    !/^(auth\/me|admin\/[a-z-]+(?:\/[a-zA-Z0-9-]+)*)$/.test(path)
    || path.split("/").some((part) => part === "." || part === "..")
  ) {
    return NextResponse.json({ message: "This administrative API path is not available." }, { status: 404 });
  }

  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "DELETE") {
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return NextResponse.json({ message: "JSON requests are required." }, { status: 415 });
    }
    body = await request.text();
  } else if (request.method === "DELETE" && request.headers.get("content-length") !== "0") {
    body = undefined;
  }

  try {
    const result = await backendRequest(path, request, body);
    return result === undefined ? new NextResponse(null, { status: 204 }) : NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message, errors: error.details ?? {} },
        { status: error.status > 0 ? error.status : 503 },
      );
    }
    return NextResponse.json({ message: "The administrative request could not be completed." }, { status: 502 });
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
