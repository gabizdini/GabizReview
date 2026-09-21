"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Heart, Star } from "lucide-react";
import {
  createReview,
  updateReview,
} from "@/services/reviews";
import { getAllCollections } from "@/services/collections";
import { deleteCurrentlyReading } from "@/services/currently-reading";
import type {
  Review,
  CreateReviewInput,
  UpdateReviewInput,
} from "@/types/review";
import type { Collection } from "@/types/collection";

interface ReviewFormProps {
  review: Review | null;
  initialData?: {
    bookId: string;
    bookTitle: string;
    author: string;
    coverUrl?: string;
  } | null;
  onSaved: (asDraft?: boolean) => void;
  onCancel: () => void;
}

function buildForm(
  review: Review | null,
  initialData?: { bookTitle: string; author: string; coverUrl?: string } | null
): CreateReviewInput {
  if (review) {
    return {
      title: review.title,
      bookTitle: review.bookTitle,
      author: review.author,
      content: review.content,
      rating: review.rating,
      coverUrl: review.coverUrl ?? "",
      isFavorite: review.isFavorite,
      isDraft: review.isDraft ?? false,
      collectionId: review.collectionId ?? "",
    };
  }
  if (initialData) {
    return {
      title: "",
      bookTitle: initialData.bookTitle,
      author: initialData.author,
      content: "",
      rating: 3,
      coverUrl: initialData.coverUrl ?? "",
      isFavorite: false,
      isDraft: false,
      collectionId: "",
    };
  }
  return { title: "", bookTitle: "", author: "", content: "", rating: 3, coverUrl: "", isFavorite: false, isDraft: false, collectionId: "" };
}

export function ReviewForm({ review, initialData, onSaved, onCancel }: ReviewFormProps) {
  const [form, setForm] = useState<CreateReviewInput>(() => buildForm(review, initialData));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    getAllCollections()
      .then(setCollections)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent, asDraft = false) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      if (review) {
        const data: UpdateReviewInput = {
          title: form.title,
          bookTitle: form.bookTitle,
          author: form.author,
          content: form.content,
          rating: form.rating,
          coverUrl: form.coverUrl || undefined,
          isFavorite: form.isFavorite,
          isDraft: asDraft,
          collectionId: form.collectionId || undefined,
        };
        await updateReview(review.id, data);
      } else {
        const data: CreateReviewInput = {
          ...form,
          isDraft: asDraft,
          coverUrl: form.coverUrl || undefined,
          collectionId: form.collectionId || undefined,
        };
        await createReview(data);
        if (!asDraft && initialData?.bookId) {
          await deleteCurrentlyReading(initialData.bookId).catch(() => {});
        }
      }
      setSuccess(true);
      if (!review) {
        setForm({ title: "", bookTitle: "", author: "", content: "", rating: 3, coverUrl: "", isFavorite: false, isDraft: false, collectionId: "" });
      }
      onSaved(asDraft);
    } catch (err) {
      console.error("Erro ao salvar review:", err);
      setError("Erro ao salvar review. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    field: keyof CreateReviewInput,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      key={review?.id ?? "new"}
      onSubmit={(e) => handleSubmit(e, false)}
      className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      {review?.isDraft && (
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
          Rascunho
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="review-title" className="mb-1 block text-sm font-medium">
            Título do Review (opcional)
          </label>
          <input
            id="review-title"
            name="title"
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Minha opinião sobre o livro"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="review-bookTitle" className="mb-1 block text-sm font-medium">
              Título do Livro <span className="text-red-500">*</span>
            </label>
            <input
              id="review-bookTitle"
              name="bookTitle"
              type="text"
              required
              value={form.bookTitle}
              onChange={(e) => handleChange("bookTitle", e.target.value)}
              placeholder="O Hobbit"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          <div>
            <label htmlFor="review-author" className="mb-1 block text-sm font-medium">Autor <span className="text-red-500">*</span></label>
            <input
              id="review-author"
              name="author"
              type="text"
              required
              value={form.author}
              onChange={(e) => handleChange("author", e.target.value)}
              placeholder="J.R.R. Tolkien"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>

        <div>
          <label htmlFor="review-coverUrl" className="mb-1 block text-sm font-medium">
            URL da Capa (opcional)
          </label>
          <input
            id="review-coverUrl"
            name="coverUrl"
            type="url"
            value={form.coverUrl ?? ""}
            onChange={(e) => handleChange("coverUrl", e.target.value)}
            placeholder="https://exemplo.com/capa.jpg"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
          />
          {form.coverUrl && (
            <img
              src={form.coverUrl}
              alt="Preview da capa"
              className="mt-2 h-40 rounded-md border border-neutral-200 object-cover dark:border-neutral-700"
            />
          )}
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium">
            Nota ({form.rating}/5)
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => {
              const starValue = i + 1;
              const isFull = i < Math.floor(form.rating);
              const isHalf = !isFull && i === Math.floor(form.rating) && form.rating % 1 !== 0;

              const handleClick = () => {
                if (form.rating === starValue) {
                  handleChange("rating", starValue - 0.5);
                } else {
                  handleChange("rating", starValue);
                }
              };

              return (
                <button
                  key={i}
                  type="button"
                  onClick={handleClick}
                  className="relative h-6 w-6 shrink-0 transition"
                >
                  <Star className="absolute inset-0 h-6 w-6 fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700" />
                  {(isFull || isHalf) && (
                    <span className="absolute inset-0 overflow-hidden" style={{ width: isHalf ? "50%" : "100%" }}>
                      <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFavorite"
            checked={!!form.isFavorite}
            onChange={(e) => handleChange("isFavorite", e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-red-500 focus:ring-red-500"
          />
          <label htmlFor="isFavorite" className="flex items-center gap-1.5 text-sm font-medium">
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            Marcar como queridinho
          </label>
        </div>

        {collections.length > 0 && (
          <div>
            <label htmlFor="review-collectionId" className="mb-1 block text-sm font-medium">
              Coleção (opcional)
            </label>
            <select
              id="review-collectionId"
              name="collectionId"
              value={form.collectionId ?? ""}
              onChange={(e) => handleChange("collectionId", e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <option value="">Nenhuma coleção</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="review-content" className="mb-1 block text-sm font-medium">
            Conteúdo (opcional)
          </label>
          <textarea
            id="review-content"
            name="content"
            rows={8}
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Escreva sua review aqui..."
            className="w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="mt-3 text-sm text-green-600">
          Review salvo com sucesso!
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {saving
            ? "Salvando..."
            : review
              ? "Salvar Alterações"
              : "Criar Review"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={(e) => handleSubmit(e as unknown as FormEvent, true)}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          {review?.isDraft ? "Salvar Rascunho" : "Salvar como Rascunho"}
        </button>

        {review?.isDraft && (
          <button
            type="button"
            disabled={saving}
            onClick={(e) => handleSubmit(e as unknown as FormEvent, false)}
            className="rounded-md border border-green-300 px-4 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950 disabled:opacity-50"
          >
            Publicar
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
