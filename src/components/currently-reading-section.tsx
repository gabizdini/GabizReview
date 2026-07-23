"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { getAllCurrentlyReading } from "@/services/currently-reading";
import { CurrentlyReadingCard } from "./currently-reading-card";
import type { CurrentlyReading } from "@/types/currently-reading";

export function CurrentlyReadingSection() {
  const [books, setBooks] = useState<CurrentlyReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCurrentlyReading()
      .then(setBooks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mt-10">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
          Lendo Agora
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
            />
          ))}
        </div>
      </section>
    );
  }

  if (books.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-center gap-2">
        <BookOpen className="h-6 w-6 text-neutral-400" />
        <h2 className="text-2xl font-bold tracking-tight">Lendo Agora</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <CurrentlyReadingCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
