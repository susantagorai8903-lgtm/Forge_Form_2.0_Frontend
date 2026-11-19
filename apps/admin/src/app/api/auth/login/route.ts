import { NextRequest, NextResponse } from "next/server";
import { apiRequest, ApiError } from "@forge-form/shared/api";
import { endpoints } from "@forge-form/shared/endpoints";
import type { AdminUser } from "@forge-form/shared/types";

type TokenResponse = { access_token: string; refresh_token: string; token_type: "bearer" };

function isAdmin(user: AdminUser): boolean {
  return user.roles.some((role) => ["STAFF", "ADMIN", "SUPER_ADMIN"].includes(role));
}

function apiFailure(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ message: error.message, errors: error.details ?? {} }, { status: error.status > 0 ? error.status : 503 });
  }
  return NextResponse.json({ message: "Sign in could not be completed." }, { status: 500 });
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ message: "Same-origin requests are required." }, { status: 403 });
  }

  let credentials: { email?: unknown; password?: unknown };
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ message: "A valid JSON request is required." }, { status: 400 });
  }
  if (typeof credentials.email !== "string" || typeof credentials.password !== "string" || !credentials.email || !credentials.password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 422 });
  }

  try {
    const token = await apiRequest<TokenResponse>(endpoints.login, {
      method: "POST",
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    const user = await apiRequest<AdminUser>(endpoints.me, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!isAdmin(user)) {
      await apiRequest<void>(endpoints.logout, {
        method: "POST",
        body: JSON.stringify({ refresh_token: token.refresh_token }),
      });
      return NextResponse.json({ message: "This account does not have an administrative role." }, { status: 403 });
    }

    const response = NextResponse.json({ user });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };
    response.cookies.set("ff_admin_access", token.access_token, cookieOptions);
    response.cookies.set("ff_admin_refresh", token.refresh_token, cookieOptions);
    return response;
  } catch (error) {
    return apiFailure(error);
  }
}
