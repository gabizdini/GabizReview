import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/config/firebase-admin";

const SESSION_COOKIE_NAME = "admin-session";

async function isValidSession(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get(SESSION_COOKIE_NAME);
  if (!session?.value) return false;

  try {
    await adminAuth.getUser(session.value);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const validSession = await isValidSession(request);

    if (!validSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
