import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

export function RatingStars({ rating, size = "md" }: RatingStarsProps) {
  const className = sizeMap[size];

  return (
    <span className="flex shrink-0 gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i === Math.floor(rating) && rating % 1 !== 0;

        if (half) {
          return (
            <span key={i} className={`relative ${className}`}>
              <Star className={`absolute inset-0 fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700 ${className}`} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className={`fill-yellow-500 text-yellow-500 ${className}`} />
              </span>
            </span>
          );
        }

        return (
          <Star
            key={i}
            className={`${className} ${
              filled
                ? "fill-yellow-500 text-yellow-500"
                : "fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700"
            }`}
          />
        );
      })}
    </span>
  );
}
