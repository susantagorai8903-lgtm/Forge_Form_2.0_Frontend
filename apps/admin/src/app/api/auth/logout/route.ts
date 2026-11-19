import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiRequest, ApiError } from "@forge-form/shared/api";
import { endpoints } from "@forge-form/shared/endpoints";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ message: "Same-origin requests are required." }, { status: 403 });
  }

  const cookieJar = await cookies();
  const refreshToken = cookieJar.get("ff_admin_refresh")?.value;
  cookieJar.delete("ff_admin_access");
  cookieJar.delete("ff_admin_refresh");
  if (!refreshToken) return new NextResponse(null, { status: 204 });

  try {
    await apiRequest<void>(endpoints.logout, {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status > 0 ? error.status : 503 });
    }
    return NextResponse.json({ message: "The local session ended, but the backend session could not be revoked." }, { status: 502 });
  }
}
