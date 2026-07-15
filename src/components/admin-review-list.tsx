"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getAllReviews, deleteReview } from "@/services/reviews";
import { getAllCollections } from "@/services/collections";
import { RatingStars } from "@/components/rating-stars";
import type { Review } from "@/types/review";
import type { Collection } from "@/types/collection";

interface AdminReviewListProps {
  onEdit: (review: Review) => void;
  refreshKey?: number;
}

export function AdminReviewList({ onEdit, refreshKey }: AdminReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAllReviews(), getAllCollections()])
      .then(([reviewsData, collectionsData]) => {
        if (!cancelled) {
          setReviews(reviewsData);
          setCollections(collectionsData);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este review?")) return;
    setDeleting(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Erro ao excluir review.");
    } finally {
      setDeleting(null);
    }
  };

  const getCollectionName = (collectionId?: string) => {
    if (!collectionId) return null;
    const col = collections.find((c) => c.id === collectionId);
    return col?.name ?? null;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-center text-neutral-400">
        Nenhum review encontrado.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const date = review.createdAt?.toDate?.();
        const formatted = date
          ? new Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(date)
          : "";

        return (
          <div
            key={review.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex min-w-0 flex-1 gap-3">
              {review.coverUrl && (
                <img
                  src={review.coverUrl}
                  alt={`Capa de ${review.bookTitle}`}
                  className="h-16 w-12 shrink-0 rounded object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="flex items-center gap-1.5 truncate font-medium">
                  {review.isFavorite && (
                    <Heart className="h-4 w-4 shrink-0 fill-red-500 text-red-500" />
                  )}
                  {review.bookTitle}
                </h3>
                <p className="text-sm text-neutral-500">{review.author}</p>
                <div className="mt-1 flex items-center gap-2 whitespace-nowrap">
                  <RatingStars rating={review.rating} />
                  {formatted && (
                    <time className="text-xs text-neutral-400">{formatted}</time>
                  )}
                  {getCollectionName(review.collectionId) && (
                    <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
                      {getCollectionName(review.collectionId)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => onEdit(review)}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(review.id)}
                disabled={deleting === review.id}
                className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-950"
              >
                {deleting === review.id ? "..." : "Excluir"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
