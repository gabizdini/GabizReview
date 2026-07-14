import { Suspense } from "react";
import { ReviewList } from "./review-list";

export default function ReviewsPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="mt-1 text-neutral-500">
          Minhas leituras e impressões sobre livros.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
              />
            ))}
          </div>
        }
      >
        <ReviewList />
      </Suspense>
    </div>
  );
}
