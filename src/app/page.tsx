import { ReviewList } from "./review-list";

export default function HomePage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="mt-1 text-neutral-500">
          Minhas leituras e impressões sobre livros.
        </p>
      </header>
      <ReviewList />
    </div>
  );
}
