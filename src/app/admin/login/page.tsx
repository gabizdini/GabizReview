"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase-provider";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";

export default function AdminLoginPage() {
  const { signInWithGoogle, user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (user.email === adminEmail) {
      router.replace("/admin");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
      setSigningIn(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Erro ao fazer login.";
      setError(msg);
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  if (user) {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (user.email === adminEmail) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-neutral-400">Redirecionando...</p>
        </div>
      );
    }
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <p className="text-lg font-medium text-red-600">
          Acesso negado. E-mail não autorizado: {user.email}
        </p>
        <button
          onClick={() => signOut(auth)}
          className="text-sm text-blue-600 hover:underline"
        >
          Fazer logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Área Admin</h1>
        <p className="mt-2 text-neutral-500">
          Faça login com sua conta Google para acessar.
        </p>
      </div>

      <button
        onClick={handleLogin}
        disabled={signingIn}
        className="flex items-center gap-3 rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-medium shadow-sm transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {signingIn ? "Entrando..." : "Entrar com Google"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
