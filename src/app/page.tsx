import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        GabizReview
      </h1>
      <p className="mt-4 max-w-md text-lg text-neutral-500">
        Um espaço pessoal onde eu compartilho minhas leituras e impressões
        sobre livros que marcaram minha vida.
      </p>
      <Link
        href="/reviews"
        className="mt-8 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        Ver Reviews
      </Link>
    </div>
  );
}
