"use client";

import { useEffect, useState } from "react";
import { FileText, BookOpen, Heart, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/firebase-provider";
import { AuthGuard } from "@/components/auth-guard";
import { ReviewForm } from "@/components/review-form";
import { AdminReviewList } from "@/components/admin-review-list";
import { CollectionForm } from "@/components/collection-form";
import { CollectionList } from "@/components/collection-list";
import { CurrentlyReadingForm } from "@/components/currently-reading-form";
import { CurrentlyReadingList } from "@/components/currently-reading-admin-list";
import { RatingStars } from "@/components/rating-stars";
import {
  getDraftReviews,
  deleteReview,
  updateReview,
} from "@/services/reviews";
import {
  getDraftCurrentlyReading,
  deleteCurrentlyReading,
  updateCurrentlyReading,
} from "@/services/currently-reading";
import type { Review } from "@/types/review";
import type { Collection } from "@/types/collection";
import type { CurrentlyReading } from "@/types/currently-reading";

type Tab = "reviews" | "collections" | "reading";

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("reviews");

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  const [editingCollection, setEditingCollection] =
    useState<Collection | null>(null);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [collectionRefreshKey, setCollectionRefreshKey] = useState(0);

  const [editingBook, setEditingBook] = useState<CurrentlyReading | null>(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [bookRefreshKey, setBookRefreshKey] = useState(0);

  const [reviewInitialData, setReviewInitialData] = useState<{
    bookId: string;
    bookTitle: string;
    author: string;
    coverUrl?: string;
  } | null>(null);

  const [reviewDrafts, setReviewDrafts] = useState<Review[]>([]);
  const [showReviewDrafts, setShowReviewDrafts] = useState(false);
  const [publishingReview, setPublishingReview] = useState<string | null>(null);

  const [bookDrafts, setBookDrafts] = useState<CurrentlyReading[]>([]);
  const [showBookDrafts, setShowBookDrafts] = useState(false);
  const [publishingBook, setPublishingBook] = useState<string | null>(null);

  useEffect(() => {
    getDraftReviews().then(setReviewDrafts).catch(() => {});
  }, [reviewRefreshKey]);

  useEffect(() => {
    getDraftCurrentlyReading().then(setBookDrafts).catch(() => {});
  }, [bookRefreshKey]);

  const handleReviewSaved = (asDraft?: boolean) => {
    setEditingReview(null);
    setShowReviewForm(false);
    setReviewInitialData(null);
    setReviewRefreshKey((k) => k + 1);
  };

  const handleReviewEdit = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReviewCancel = () => {
    setEditingReview(null);
    setShowReviewForm(false);
    setReviewInitialData(null);
  };

  const handleNewReview = () => {
    setEditingReview(null);
    setShowReviewForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePublishReview = async (id: string) => {
    setPublishingReview(id);
    try {
      await updateReview(id, { isDraft: false });
      setReviewDrafts((prev) => prev.filter((r) => r.id !== id));
      setReviewRefreshKey((k) => k + 1);
    } catch {
      alert("Erro ao publicar review.");
    } finally {
      setPublishingReview(null);
    }
  };

  const handleDeleteReviewDraft = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este rascunho?")) return;
    try {
      await deleteReview(id);
      setReviewDrafts((prev) => prev.filter((r) => r.id !== id));
      setReviewRefreshKey((k) => k + 1);
    } catch {
      alert("Erro ao excluir rascunho.");
    }
  };

  const handleCollectionSaved = () => {
    setEditingCollection(null);
    setShowCollectionForm(false);
    setCollectionRefreshKey((k) => k + 1);
  };

  const handleCollectionEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setShowCollectionForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCollectionCancel = () => {
    setEditingCollection(null);
    setShowCollectionForm(false);
  };

  const handleNewCollection = () => {
    setEditingCollection(null);
    setShowCollectionForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookSaved = (asDraft?: boolean) => {
    setEditingBook(null);
    setShowBookForm(false);
    setBookRefreshKey((k) => k + 1);
  };

  const handleBookEdit = (book: CurrentlyReading) => {
    setEditingBook(book);
    setShowBookForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookCancel = () => {
    setEditingBook(null);
    setShowBookForm(false);
  };

  const handleNewBook = () => {
    setEditingBook(null);
    setShowBookForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWriteReview = (book: CurrentlyReading) => {
    setReviewInitialData({
      bookId: book.id,
      bookTitle: book.bookTitle,
      author: book.author,
      coverUrl: book.coverUrl,
    });
    setTab("reviews");
    setShowReviewForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePublishBook = async (id: string) => {
    setPublishingBook(id);
    try {
      await updateCurrentlyReading(id, { isDraft: false });
      setBookDrafts((prev) => prev.filter((b) => b.id !== id));
      setBookRefreshKey((k) => k + 1);
    } catch {
      alert("Erro ao publicar livro.");
    } finally {
      setPublishingBook(null);
    }
  };

  const handleDeleteBookDraft = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este rascunho?")) return;
    try {
      await deleteCurrentlyReading(id);
      setBookDrafts((prev) => prev.filter((b) => b.id !== id));
      setBookRefreshKey((k) => k + 1);
    } catch {
      alert("Erro ao excluir rascunho.");
    }
  };

  return (
    <AuthGuard>
      <div className="py-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Painel Admin</h1>
          <p className="mt-1 text-neutral-500">
            Bem-vindo, {user?.displayName || user?.email}.
          </p>
        </header>

        <div className="mb-6 flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setTab("reviews")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === "reviews"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setTab("collections")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === "collections"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Coleções
          </button>
          <button
            onClick={() => setTab("reading")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === "reading"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Lendo Agora
          </button>
        </div>

        {tab === "reviews" && (
          <>
            {showReviewForm ? (
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold">
                  {editingReview ? "Editar Review" : "Novo Review"}
                </h2>
                <ReviewForm
                  review={editingReview}
                  initialData={reviewInitialData}
                  onSaved={handleReviewSaved}
                  onCancel={handleReviewCancel}
                />
              </div>
            ) : (
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleNewReview}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  + Novo Review
                </button>
                <button
                  onClick={() => setShowReviewDrafts((prev) => !prev)}
                  className={`flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition ${
                    showReviewDrafts
                      ? "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-400"
                      : "border-neutral-300 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Rascunhos ({reviewDrafts.length})
                </button>
              </div>
            )}

            {showReviewDrafts && reviewDrafts.length > 0 && (
              <div className="mb-8 rounded-lg border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-900/50 dark:bg-violet-950/20">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-300">
                  <FileText className="h-4 w-4" />
                  Rascunhos Salvos
                </h3>
                <div className="space-y-2">
                  {reviewDrafts.map((draft) => {
                    const date = draft.createdAt?.toDate?.();
                    const formatted = date
                      ? new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(date)
                      : "";
                    return (
                      <div
                        key={draft.id}
                        className="flex items-center justify-between gap-3 rounded-md border border-violet-200/50 bg-white p-3 dark:border-violet-800/30 dark:bg-neutral-900"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {draft.coverUrl && (
                            <img
                              src={draft.coverUrl}
                              alt={`Capa de ${draft.bookTitle}`}
                              className="h-10 w-8 shrink-0 rounded object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="truncate text-sm font-medium">
                                {draft.bookTitle}
                              </h4>
                              <span className="hidden sm:block">
                                <RatingStars rating={draft.rating} size="sm" />
                              </span>
                            </div>
                            <p className="truncate text-xs text-neutral-500">
                              {draft.author}
                            </p>
                            {formatted && (
                              <time className="text-xs text-neutral-400">
                                {formatted}
                              </time>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-center gap-1.5">
                          <span className="sm:hidden">
                            <RatingStars rating={draft.rating} size="sm" />
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePublishReview(draft.id)}
                              disabled={publishingReview === draft.id}
                              className="rounded-md border border-green-300 px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-green-50 disabled:opacity-50 dark:border-green-800 dark:hover:bg-green-950"
                            >
                              {publishingReview === draft.id
                                ? "..."
                                : "Publicar"}
                            </button>
                            <button
                              onClick={() => handleReviewEdit(draft)}
                              className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteReviewDraft(draft.id)}
                              className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h2 className="mb-4 text-lg font-semibold">Reviews</h2>
              <AdminReviewList
                onEdit={handleReviewEdit}
                refreshKey={reviewRefreshKey}
              />
            </div>
          </>
        )}

        {tab === "collections" && (
          <>
            {showCollectionForm ? (
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold">
                  {editingCollection
                    ? "Editar Coleção"
                    : "Nova Coleção"}
                </h2>
                <CollectionForm
                  collection={editingCollection}
                  onSaved={handleCollectionSaved}
                  onCancel={handleCollectionCancel}
                />
              </div>
            ) : (
              <button
                onClick={handleNewCollection}
                className="mb-8 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                + Nova Coleção
              </button>
            )}

            <div>
              <h2 className="mb-4 text-lg font-semibold">Coleções</h2>
              <CollectionList
                onEdit={handleCollectionEdit}
                refreshKey={collectionRefreshKey}
              />
            </div>
          </>
        )}

        {tab === "reading" && (
          <>
            {showBookForm ? (
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold">
                  {editingBook ? "Editar Livro" : "Novo Livro"}
                </h2>
                <CurrentlyReadingForm
                  book={editingBook}
                  onSaved={handleBookSaved}
                  onCancel={handleBookCancel}
                />
              </div>
            ) : (
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleNewBook}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  + Novo Livro
                </button>
                <button
                  onClick={() => setShowBookDrafts((prev) => !prev)}
                  className={`flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition ${
                    showBookDrafts
                      ? "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-400"
                      : "border-neutral-300 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Rascunhos ({bookDrafts.length})
                </button>
              </div>
            )}

            {showBookDrafts && bookDrafts.length > 0 && (
              <div className="mb-8 rounded-lg border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-900/50 dark:bg-violet-950/20">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-300">
                  <FileText className="h-4 w-4" />
                  Rascunhos Salvos
                </h3>
                <div className="space-y-2">
                  {bookDrafts.map((draft) => {
                    const date = draft.createdAt?.toDate?.();
                    const formatted = date
                      ? new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(date)
                      : "";
                    return (
                      <div
                        key={draft.id}
                        className="flex items-center justify-between gap-3 rounded-md border border-violet-200/50 bg-white p-3 dark:border-violet-800/30 dark:bg-neutral-900"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {draft.coverUrl ? (
                            <img
                              src={draft.coverUrl}
                              alt={`Capa de ${draft.bookTitle}`}
                              className="h-10 w-8 shrink-0 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-800">
                              <BookOpen className="h-4 w-4 text-neutral-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-medium">
                              {draft.bookTitle}
                            </h4>
                            <p className="truncate text-xs text-neutral-500">
                              {draft.author}
                            </p>
                            {formatted && (
                              <time className="text-xs text-neutral-400">
                                {formatted}
                              </time>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handlePublishBook(draft.id)}
                            disabled={publishingBook === draft.id}
                            className="rounded-md border border-green-300 px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-green-50 disabled:opacity-50 dark:border-green-800 dark:hover:bg-green-950"
                          >
                            {publishingBook === draft.id ? "..." : "Publicar"}
                          </button>
                          <button
                            onClick={() => handleBookEdit(draft)}
                            className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteBookDraft(draft.id)}
                            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h2 className="mb-4 text-lg font-semibold">Lendo Agora</h2>
              <CurrentlyReadingList
                onEdit={handleBookEdit}
                onWriteReview={handleWriteReview}
                refreshKey={bookRefreshKey}
              />
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
