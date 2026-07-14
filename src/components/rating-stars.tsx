import { Star } from "lucide-react";

export function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex shrink-0 gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-yellow-500 text-yellow-500"
              : "fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700"
          }`}
        />
      ))}
    </span>
  );
}
