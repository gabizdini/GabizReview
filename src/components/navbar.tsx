"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase-provider";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) =>
    pathname === href
      ? "text-blue-600 font-medium dark:text-blue-400"
      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100";

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          GabizReview
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/reviews" className={isActive("/reviews")}>
            Reviews
          </Link>
          <a
            href="https://www.instagram.com/gabrielidiniz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 transition hover:text-pink-500"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
          {user ? (
            <>
              <Link href="/admin" className={isActive("/admin")}>
                Admin
              </Link>
              <button
                onClick={logout}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/admin" className={isActive("/admin")}>
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
