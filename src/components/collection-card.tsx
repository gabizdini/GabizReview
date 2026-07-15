"use client";

import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";
import type { Collection } from "@/types/collection";

interface CollectionCardProps {
  collection: Collection;
  reviewCount: number;
}

export function CollectionCard({ collection, reviewCount }: CollectionCardProps) {
  const borderColor = collection.color ?? "#6B7280";

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group relative block overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      style={{ borderLeftColor: borderColor, borderLeftWidth: "4px" }}
    >
      {collection.coverUrl ? (
        <img
          src={collection.coverUrl}
          alt={`Capa de ${collection.name}`}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
          <Folder className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
            {collection.description}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400 max-sm:opacity-100">
            Ver mais <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
