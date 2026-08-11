"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/config/firebase-admin";

export interface AdminValidationResult {
  authorized: boolean;
  email?: string;
  error?: string;
}

const SESSION_COOKIE_NAME = "admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function validateAdmin(
  idToken: string
): Promise<AdminValidationResult> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;

    if (!email) {
      return { authorized: false, error: "Token sem email" };
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return { authorized: false, error: "ADMIN_EMAIL não configurado" };
    }

    if (email !== adminEmail) {
      return { authorized: false, email };
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, decodedToken.uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return { authorized: true, email };
  } catch {
    return { authorized: false, error: "Token inválido" };
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAdminSessionValid(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    if (!session?.value) return false;

    await adminAuth.getUser(session.value);
    return true;
  } catch {
    return false;
  }
}
