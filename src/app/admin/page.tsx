"use client";

import { useState } from "react";
import { useAuth } from "@/lib/firebase-provider";
import { AuthGuard } from "@/components/auth-guard";
import { ReviewForm } from "@/components/review-form";
import { AdminReviewList } from "@/components/admin-review-list";
import type { Review } from "@/types/review";

export default function AdminPage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setEditing(null);
    setShowForm(false);
    setRefreshKey((k) => k + 1);
  };

  const handleEdit = (review: Review) => {
    setEditing(review);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleNewReview = () => {
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AuthGuard>
      <div>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Painel Admin</h1>
          <p className="mt-1 text-neutral-500">
            Bem-vindo, {user?.displayName || user?.email}.
          </p>
        </header>

        {showForm ? (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">
              {editing ? "Editar Review" : "Novo Review"}
            </h2>
            <ReviewForm
              review={editing}
              onSaved={handleSaved}
              onCancel={handleCancelEdit}
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
            onEdit={handleEdit}
            refreshKey={refreshKey}
          />
        </div>
      </div>
    </AuthGuard>
  );
}
