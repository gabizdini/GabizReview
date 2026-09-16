"use client";

import { useState, type FormEvent } from "react";
import { BookOpen } from "lucide-react";
import {
  createCurrentlyReading,
  updateCurrentlyReading,
} from "@/services/currently-reading";
import type {
  CurrentlyReading,
  CreateCurrentlyReadingInput,
  UpdateCurrentlyReadingInput,
} from "@/types/currently-reading";

interface CurrentlyReadingFormProps {
  book: CurrentlyReading | null;
  onSaved: (asDraft?: boolean) => void;
  onCancel: () => void;
}

function buildForm(book: CurrentlyReading | null): CreateCurrentlyReadingInput {
  if (book) {
    return {
      bookTitle: book.bookTitle,
      author: book.author,
      coverUrl: book.coverUrl ?? "",
      progress: book.progress,
      order: book.order,
      isDraft: book.isDraft ?? false,
    };
  }
  return { bookTitle: "", author: "", coverUrl: "", progress: 0, order: 0, isDraft: false };
}

function getProgressColor(progress: number): string {
  if (progress <= 30) return "#F97316";
  if (progress <= 70) return "#EAB308";
  return "#22C55E";
}

export function CurrentlyReadingForm({
  book,
  onSaved,
  onCancel,
}: CurrentlyReadingFormProps) {
  const [form, setForm] = useState<CreateCurrentlyReadingInput>(() =>
    buildForm(book)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent, asDraft = false) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      if (book) {
        const data: UpdateCurrentlyReadingInput = {
          bookTitle: form.bookTitle,
          author: form.author,
          coverUrl: form.coverUrl || undefined,
          progress: form.progress,
          order: form.order,
          isDraft: asDraft,
        };
        await updateCurrentlyReading(book.id, data);
      } else {
        const data: CreateCurrentlyReadingInput = {
          ...form,
          isDraft: asDraft,
          coverUrl: form.coverUrl || undefined,
        };
        await createCurrentlyReading(data);
      }
      setSuccess(true);
      if (!book) {
        setForm({ bookTitle: "", author: "", coverUrl: "", progress: 0, order: 0, isDraft: false });
      }
      onSaved(asDraft);
    } catch {
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    field: keyof CreateCurrentlyReadingInput,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      key={book?.id ?? "new"}
      onSubmit={(e) => handleSubmit(e, false)}
      className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      {book?.isDraft && (
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Rascunho
        </div>
      )}

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reading-bookTitle" className="mb-1 block text-sm font-medium">
              Título do Livro <span className="text-red-500">*</span>
            </label>
            <input
              id="reading-bookTitle"
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
            <label htmlFor="reading-author" className="mb-1 block text-sm font-medium">
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              id="reading-author"
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
          <label htmlFor="reading-coverUrl" className="mb-1 block text-sm font-medium">
            URL da Capa (opcional)
          </label>
          <input
            id="reading-coverUrl"
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
              className="mt-2 h-32 rounded-md border border-neutral-200 object-cover dark:border-neutral-700"
            />
          )}
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium">
            Progresso ({form.progress}%)
          </span>
          <div className="flex items-center gap-3">
            <input
              id="reading-progress"
              name="progress"
              type="range"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => handleChange("progress", Number(e.target.value))}
              className="flex-1"
            />
            <span
              className="w-12 text-center text-sm font-medium"
              style={{ color: getProgressColor(form.progress) }}
            >
              {form.progress}%
            </span>
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="mt-3 text-sm text-green-600">
          Livro salvo com sucesso!
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
            : book
              ? "Salvar Alterações"
              : "Adicionar Livro"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={(e) => handleSubmit(e as unknown as FormEvent, true)}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          {book?.isDraft ? "Salvar Rascunho" : "Salvar como Rascunho"}
        </button>

        {book?.isDraft && (
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
