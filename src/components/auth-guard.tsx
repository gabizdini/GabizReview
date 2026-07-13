"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/firebase-provider";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const state = useMemo(() => {
    if (loading) return "loading" as const;
    if (!user) return "unauthenticated" as const;
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (user.email !== adminEmail) return "unauthorized" as const;
    return "authorized" as const;
  }, [user, loading]);

  useEffect(() => {
    if (state === "unauthenticated") {
      router.replace("/admin/login");
    }
    if (state === "unauthorized") {
      signOut(auth);
    }
  }, [state, router]);

  if (state === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  if (state === "unauthorized") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-red-600">
          Acesso negado. Você não tem permissão de administrador.
        </p>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          Voltar para a home
        </Link>
      </div>
    );
  }

  if (state === "unauthenticated") return null;

  return <>{children}</>;
}
