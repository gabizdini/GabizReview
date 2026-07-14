"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllReviews } from "@/services/reviews";
import { ReviewCard } from "@/components/review-card";
import type { Review } from "@/types/review";

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    getAllReviews()
      .then(setReviews)
      .catch(() => setError("Erro ao carregar reviews."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();

    const result = reviews.filter((r) => {
      const matchesSearch =
        !term ||
        r.bookTitle.toLowerCase().includes(term) ||
        r.author.toLowerCase().includes(term) ||
        r.title.toLowerCase().includes(term);

      const matchesRating =
        ratingFilter === "all" || r.rating === ratingFilter;

      const matchesFavorite = !favoritesOnly || r.isFavorite;

      return matchesSearch && matchesRating && matchesFavorite;
    });

    result.sort((a, b) => {
      switch (sort) {
        case "newest":
          return (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0);
        case "oldest":
          return (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
      }
    });

    return result;
  }, [reviews, search, ratingFilter, sort, favoritesOnly]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (reviews.length === 0) {
    return (
      <p className="text-center text-neutral-400">
        Nenhum review encontrado.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por título, autor ou review..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
          />
        </div>

        <select
          value={ratingFilter === "all" ? "all" : String(ratingFilter)}
          onChange={(e) =>
            setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="all">Todas as notas</option>
          <option value="5">★ 5</option>
          <option value="4">★ 4</option>
          <option value="3">★ 3</option>
          <option value="2">★ 2</option>
          <option value="1">★ 1</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
          <option value="highest">Melhor nota</option>
          <option value="lowest">Pior nota</option>
        </select>

        <button
          onClick={() => setFavoritesOnly((prev) => !prev)}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-2 text-sm font-medium transition ${
            favoritesOnly
              ? "border-red-300 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950"
              : "border-neutral-300 bg-white text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          ❤️ Queridinhos
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-neutral-400">
          Nenhum review encontrado com os filtros selecionados.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
