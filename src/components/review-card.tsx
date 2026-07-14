"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Review } from "@/types/review";
import { RatingStars } from "./rating-stars";

export function ReviewCard({ review }: { review: Review }) {
  const date = review.createdAt?.toDate?.();
  const formatted = date
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date)
    : "";

  return (
    <Link
      href={`/reviews/${review.id}`}
      className="group flex gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      {review.coverUrl && (
        <img
          src={review.coverUrl}
          alt={`Capa de ${review.bookTitle}`}
          className="h-28 w-20 shrink-0 rounded-md object-cover"
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {review.bookTitle}
          </h3>
          <div className="flex shrink-0 items-center gap-1">
            {review.isFavorite && (
              <Heart className="h-4 w-4 fill-red-500 text-red-500" aria-label="Queridinho" />
            )}
            <RatingStars rating={review.rating} />
          </div>
        </div>
        <p className="text-sm text-neutral-500">{review.author}</p>
        {review.title && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
            {review.title}
          </p>
        )}
        {formatted && (
          <time className="mt-2 block text-xs text-neutral-400">{formatted}</time>
        )}
      </div>
    </Link>
  );
}
