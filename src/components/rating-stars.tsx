export function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex shrink-0 gap-0.5 text-sm" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-yellow-500" : "text-neutral-300 dark:text-neutral-600"}>
          ★
        </span>
      ))}
    </span>
  );
}
