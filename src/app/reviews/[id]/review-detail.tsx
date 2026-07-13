"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReviewById } from "@/services/reviews";
import { RatingStars } from "@/components/rating-stars";
import type { Review } from "@/types/review";

export function ReviewDetail({ id }: { id: string }) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReviewById(id)
      .then(setReview)
      .catch(() => setError("Review não encontrado."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-64 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">{error || "Review não encontrado."}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  const date = review.createdAt?.toDate?.();
  const formatted = date
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date)
    : "";

  return (
    <div className="py-8">
      <Link href="/" className="mb-6 inline-block text-sm text-neutral-400 hover:text-neutral-600">
        ← Voltar
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row">
        {review.coverUrl && (
          <img
            src={review.coverUrl}
            alt={`Capa de ${review.bookTitle}`}
            className="mx-auto h-72 w-48 shrink-0 rounded-lg object-cover shadow-md sm:mx-0"
          />
        )}

        <div className="min-w-0 flex-1">
          <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{review.bookTitle}</h1>
            <p className="mt-1 text-lg text-neutral-500">{review.author}</p>
            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={review.rating} />
              {formatted && <time className="text-sm text-neutral-400">{formatted}</time>}
            </div>
          </header>

          <div className="mb-6">
            <h2 className="text-lg font-semibold">{review.title}</h2>
          </div>

          <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
            {review.content.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
