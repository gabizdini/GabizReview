"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/firebase-provider";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href
      ? "text-blue-600 font-medium dark:text-blue-400"
      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100";

  const mobileItemClass =
    "block py-3 text-base font-medium text-neutral-700 transition hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400";

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          GabizReview
        </Link>

        <div className="hidden items-center gap-4 text-sm sm:flex">
          <Link href="/reviews" className={isActive("/reviews")}>
            Reviews
          </Link>
          <Link href="/collections" className={isActive("/collections")}>
            Coleções
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

        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center justify-center text-neutral-600 dark:text-neutral-400 sm:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 sm:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-2xl dark:bg-neutral-900 sm:hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
              <span className="text-lg font-bold tracking-tight">
                GabizReview
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                aria-label="Fechar menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-5 py-4">
              <Link href="/reviews" className={mobileItemClass} onClick={() => setMenuOpen(false)}>
                Reviews
              </Link>
              <Link href="/collections" className={mobileItemClass} onClick={() => setMenuOpen(false)}>
                Coleções
              </Link>
              <a
                href="https://www.instagram.com/gabrielidiniz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-3 text-neutral-400 transition hover:text-pink-500"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <div className="my-3 border-t border-neutral-200 dark:border-neutral-700" />
              {user ? (
                <>
                  <Link href="/admin" className={mobileItemClass} onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className={`${mobileItemClass} w-full text-left`}
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link href="/admin" className={mobileItemClass} onClick={() => setMenuOpen(false)}>
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
