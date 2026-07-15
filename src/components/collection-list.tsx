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
import { Folder, GripVertical } from "lucide-react";
import {
  getAllCollections,
  deleteCollection,
  getCollectionReviewCount,
  updateCollectionsOrder,
} from "@/services/collections";
import type { Collection } from "@/types/collection";

interface CollectionListProps {
  onEdit: (collection: Collection) => void;
  refreshKey?: number;
}

function SortableCollectionItem({
  collection,
  reviewCount,
  onEdit,
  onDelete,
  deleting,
}: {
  collection: Collection;
  reviewCount: number;
  onEdit: (collection: Collection) => void;
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
  } = useSortable({ id: collection.id });

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
        {collection.coverUrl ? (
          <img
            src={collection.coverUrl}
            alt={`Capa de ${collection.name}`}
            className="h-16 w-12 shrink-0 rounded object-cover"
          />
        ) : (
          <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-800">
            <Folder className="h-6 w-6 text-neutral-400" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: collection.color ?? "#6B7280" }}
            />
            <h3 className="truncate font-medium">{collection.name}</h3>
          </div>
          {collection.description && (
            <p className="truncate text-sm text-neutral-500">
              {collection.description}
            </p>
          )}
          <p className="mt-1 text-xs text-neutral-400">
            {reviewCount} review(s)
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onEdit(collection)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(collection.id)}
          disabled={deleting === collection.id}
          className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-950"
        >
          {deleting === collection.id ? "..." : "Excluir"}
        </button>
      </div>
    </div>
  );
}

export function CollectionList({ onEdit, refreshKey }: CollectionListProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
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
    getAllCollections()
      .then(async (data) => {
        if (!cancelled) {
          setCollections(data);
          const countEntries = await Promise.all(
            data.map(async (c) => {
              const count = await getCollectionReviewCount(c.id);
              return [c.id, count] as const;
            })
          );
          if (!cancelled) {
            setCounts(Object.fromEntries(countEntries));
            setLoading(false);
          }
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
      !confirm(
        "Tem certeza que deseja excluir esta coleção? Os reviews não serão excluídos."
      )
    )
      return;
    setDeleting(id);
    try {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Erro ao excluir coleção.");
    } finally {
      setDeleting(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = collections.findIndex((c) => c.id === active.id);
    const newIndex = collections.findIndex((c) => c.id === over.id);

    const newOrder = arrayMove(collections, oldIndex, newIndex);
    setCollections(newOrder);

    try {
      await updateCollectionsOrder(newOrder.map((c) => c.id));
    } catch {
      setCollections(collections);
      alert("Erro ao reordenar coleções.");
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

  if (collections.length === 0) {
    return (
      <p className="text-center text-neutral-400">
        Nenhuma coleção encontrada.
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
        items={collections.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {collections.map((col) => (
            <SortableCollectionItem
              key={col.id}
              collection={col}
              reviewCount={counts[col.id] ?? 0}
              onEdit={onEdit}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
