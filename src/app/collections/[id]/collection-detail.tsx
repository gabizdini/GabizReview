"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Folder } from "lucide-react";
import {
  getCollectionById,
  getReviewsByCollectionId,
} from "@/services/collections";
import { ReviewCard } from "@/components/review-card";
import type { Collection } from "@/types/collection";
import type { Review } from "@/types/review";

export function CollectionDetail({ id }: { id: string }) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getCollectionById(id),
      getReviewsByCollectionId(id),
    ])
      .then(([col, revs]) => {
        if (!col) {
          setError("Coleção não encontrada.");
        } else {
          setCollection(col);
          setReviews(revs);
        }
      })
      .catch(() => setError("Erro ao carregar coleção."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-4">
        <div className="mb-6 h-8 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">{error || "Coleção não encontrada."}</p>
        <Link
          href="/collections"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Link
        href="/collections"
        className="mb-6 inline-block text-sm text-neutral-400 hover:text-neutral-600"
      >
        ← Voltar
      </Link>

      <header
        className="mb-8 rounded-t-lg border-l-4 border-t-4 pt-4"
        style={{ borderColor: collection.color ?? "#6B7280" }}
      >
        <div className="flex items-start gap-4">
          {collection.coverUrl ? (
            <img
              src={collection.coverUrl}
              alt={`Capa de ${collection.name}`}
              className="h-24 w-24 shrink-0 rounded-lg object-cover shadow-md"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <Folder className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="mt-2 text-neutral-500">{collection.description}</p>
            )}
            <p className="mt-2 text-sm text-neutral-400">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </header>

      {reviews.length === 0 ? (
        <p className="py-4 text-center text-neutral-400">
          Nenhum review nesta coleção.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
