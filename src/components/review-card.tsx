"use client";

import Link from "next/link";
import { Heart, ArrowRight, Folder } from "lucide-react";
import type { Review } from "@/types/review";
import { RatingStars } from "./rating-stars";

export function ReviewCard({
  review,
  collectionsMap,
}: {
  review: Review;
  collectionsMap?: Record<string, string>;
}) {
  const date = review.createdAt?.toDate?.();
  const formatted = date
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date)
    : "";

  const collectionName = review.collectionId
    ? collectionsMap?.[review.collectionId] ?? null
    : null;

  return (
    <Link
      href={`/reviews/${review.id}`}
      className="group relative block rounded-lg border border-neutral-200 bg-white p-4 transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      {review.isFavorite && (
        <Heart className="absolute right-3 top-3 h-4 w-4 fill-red-500 text-red-500" aria-label="Queridinho" />
      )}

      <div className="flex gap-4">
        {review.coverUrl && (
          <img
            src={review.coverUrl}
            alt={`Capa de ${review.bookTitle}`}
            className="h-28 w-20 shrink-0 rounded-md object-cover"
          />
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {review.bookTitle}
          </h3>
          <p className="text-sm text-neutral-500">{review.author}</p>
          <div className="mt-1.5">
            <RatingStars rating={review.rating} />
          </div>
          {collectionName && (
            <span className="mt-2 inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
              <Folder className="h-3 w-3" />
              {collectionName}
            </span>
          )}
          {review.title && (
            <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
              {review.title}
            </p>
          )}
          {formatted && (
            <time className="mt-2 block text-xs text-neutral-400">{formatted}</time>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-opacity dark:text-blue-400 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
            Ver mais <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
