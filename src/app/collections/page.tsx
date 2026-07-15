"use client";

import { useEffect, useState } from "react";
import {
  getAllCollections,
  getCollectionReviewCount,
} from "@/services/collections";
import { CollectionCard } from "@/components/collection-card";
import type { Collection } from "@/types/collection";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllCollections()
      .then(async (data) => {
        setCollections(data);
        const countEntries = await Promise.all(
          data.map(async (c) => {
            const count = await getCollectionReviewCount(c.id);
            return [c.id, count] as const;
          })
        );
        setCounts(Object.fromEntries(countEntries));
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar coleções.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-4">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Coleções</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-60 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="py-4 text-center text-red-500">{error}</p>;
  }

  if (collections.length === 0) {
    return (
      <div className="py-4">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Coleções</h1>
        <p className="text-center text-neutral-400">
          Nenhuma coleção encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Coleções</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <CollectionCard
            key={col.id}
            collection={col}
            reviewCount={counts[col.id] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
