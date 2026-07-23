"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BookOpen, GripVertical, PenLine } from "lucide-react";
import {
  getAllCurrentlyReading,
  deleteCurrentlyReading,
  updateCurrentlyReadingOrder,
} from "@/services/currently-reading";
import type { CurrentlyReading } from "@/types/currently-reading";

interface CurrentlyReadingListProps {
  onEdit: (book: CurrentlyReading) => void;
  onWriteReview: (book: CurrentlyReading) => void;
  refreshKey?: number;
}

function getProgressColor(progress: number): string {
  if (progress <= 30) return "#F97316";
  if (progress <= 70) return "#EAB308";
  return "#22C55E";
}

function SortableBookItem({
  book,
  onEdit,
  onWriteReview,
  onDelete,
  deleting,
}: {
  book: CurrentlyReading;
  onEdit: (book: CurrentlyReading) => void;
  onWriteReview: (book: CurrentlyReading) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <button
          className="mt-1 cursor-grab touch-none text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Capa de ${book.bookTitle}`}
            className="h-16 w-12 shrink-0 rounded object-cover"
          />
        ) : (
          <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-800">
            <BookOpen className="h-6 w-6 text-neutral-400" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{book.bookTitle}</h3>
          <p className="truncate text-sm text-neutral-500">{book.author}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${book.progress}%`,
                  backgroundColor: getProgressColor(book.progress),
                }}
              />
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: getProgressColor(book.progress) }}
            >
              {book.progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onWriteReview(book)}
          className="rounded-md border border-green-300 px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950"
          title="Escrever review para este livro"
        >
          <PenLine className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onEdit(book)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(book.id)}
          disabled={deleting === book.id}
          className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-950"
        >
          {deleting === book.id ? "..." : "Excluir"}
        </button>
      </div>
    </div>
  );
}

export function CurrentlyReadingList({
  onEdit,
  onWriteReview,
  refreshKey,
}: CurrentlyReadingListProps) {
  const [books, setBooks] = useState<CurrentlyReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    let cancelled = false;
    getAllCurrentlyReading()
      .then((data) => {
        if (!cancelled) {
          setBooks(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    if (
      !confirm("Tem certeza que deseja excluir este livro da lista de leitura?")
    )
      return;
    setDeleting(id);
    try {
      await deleteCurrentlyReading(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Erro ao excluir livro.");
    } finally {
      setDeleting(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = books.findIndex((b) => b.id === active.id);
    const newIndex = books.findIndex((b) => b.id === over.id);

    const newOrder = arrayMove(books, oldIndex, newIndex);
    setBooks(newOrder);

    try {
      await updateCurrentlyReadingOrder(newOrder.map((b) => b.id));
    } catch {
      setBooks(books);
      alert("Erro ao reordenar livros.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
          />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <p className="text-center text-neutral-400">
        Nenhum livro na lista de leitura.
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={books.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {books.map((book) => (
            <SortableBookItem
              key={book.id}
              book={book}
              onEdit={onEdit}
              onWriteReview={onWriteReview}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
