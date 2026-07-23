"use client";

import { BookOpen } from "lucide-react";
import type { CurrentlyReading } from "@/types/currently-reading";

function getProgressColor(progress: number): string {
  if (progress <= 30) return "#F97316";
  if (progress <= 70) return "#EAB308";
  return "#22C55E";
}

export function CurrentlyReadingCard({
  book,
}: {
  book: CurrentlyReading;
}) {
  const progressColor = getProgressColor(book.progress);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-800">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Capa de ${book.bookTitle}`}
            className="h-44 rounded shadow-sm object-contain"
          />
        ) : (
          <div className="flex h-44 w-28 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-700">
            <BookOpen className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold leading-snug">{book.bookTitle}</h3>
        <p className="text-sm text-neutral-500">{book.author}</p>

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Progresso</span>
            <span className="text-xs font-medium" style={{ color: progressColor }}>
              {book.progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${book.progress}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
