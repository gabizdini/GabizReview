"use client";

import { useEffect, useRef, useState, startTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/firebase-provider";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { validateAdmin } from "@/app/admin/actions";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const checkingRef = useRef(false);

  useEffect(() => {
    if (loading || !user) return;
    if (checkingRef.current) return;
    checkingRef.current = true;

    user.getIdToken().then((idToken) => {
      validateAdmin(idToken).then((result) => {
        startTransition(() => {
          setIsAdmin(result.authorized);
        });
        checkingRef.current = false;
      });
    });
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && isAdmin === false) {
      signOut(auth);
    }
  }, [loading, user, isAdmin]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  if (!user) return null;

  if (isAdmin === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-neutral-400">Verificando permissões...</p>
      </div>
    );
  }

  if (!isAdmin) {
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

  return <>{children}</>;
}
