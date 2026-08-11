"use server";

import { cookies } from "next/headers";

export interface AdminValidationResult {
  authorized: boolean;
  email?: string;
  error?: string;
}

const SESSION_COOKIE_NAME = "admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface LookupUser {
  localId: string;
  email?: string;
}

async function lookupUser(idToken: string): Promise<LookupUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    }
  );
  if (!res.ok) return null;

  const data = await res.json();
  const user = data?.users?.[0];
  if (!user) return null;

  return { localId: user.localId, email: user.email };
}

export async function validateAdmin(
  idToken: string
): Promise<AdminValidationResult> {
  try {
    const user = await lookupUser(idToken);
    if (!user) {
      return { authorized: false, error: "Token inválido" };
    }

    const email = user.email;
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
    cookieStore.set(SESSION_COOKIE_NAME, user.localId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return { authorized: true, email };
  } catch {
    return { authorized: false, error: "Erro ao verificar permissões" };
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
