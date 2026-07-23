"use client";

import { useState } from "react";
import { useAuth } from "@/lib/firebase-provider";
import { AuthGuard } from "@/components/auth-guard";
import { ReviewForm } from "@/components/review-form";
import { AdminReviewList } from "@/components/admin-review-list";
import { CollectionForm } from "@/components/collection-form";
import { CollectionList } from "@/components/collection-list";
import { CurrentlyReadingForm } from "@/components/currently-reading-form";
import { CurrentlyReadingList } from "@/components/currently-reading-admin-list";
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

  const handleReviewSaved = () => {
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

  const handleBookSaved = () => {
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
              <button
                onClick={handleNewReview}
                className="mb-8 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                + Novo Review
              </button>
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
              <button
                onClick={handleNewBook}
                className="mb-8 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                + Novo Livro
              </button>
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
