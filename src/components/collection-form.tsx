"use client";

import { useState, type FormEvent } from "react";
import {
  createCollection,
  updateCollection,
} from "@/services/collections";
import { ColorPickerModal } from "./color-picker-modal";
import type {
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "@/types/collection";

interface CollectionFormProps {
  collection: Collection | null;
  onSaved: () => void;
  onCancel: () => void;
}

function buildForm(collection: Collection | null): CreateCollectionInput {
  if (collection) {
    return {
      name: collection.name,
      description: collection.description ?? "",
      coverUrl: collection.coverUrl ?? "",
      color: collection.color ?? "#6B7280",
      order: collection.order,
    };
  }
  return { name: "", description: "", coverUrl: "", color: "#6B7280", order: 0 };
}

export function CollectionForm({
  collection,
  onSaved,
  onCancel,
}: CollectionFormProps) {
  const [form, setForm] = useState<CreateCollectionInput>(() =>
    buildForm(collection)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      if (collection) {
        const data: UpdateCollectionInput = {
          name: form.name,
          description: form.description,
          coverUrl: form.coverUrl,
          color: form.color,
          order: form.order,
        };
        await updateCollection(collection.id, data);
      } else {
        await createCollection(form);
      }
      setSuccess(true);
      if (!collection) {
        setForm({ name: "", description: "", coverUrl: "", color: "#6B7280", order: 0 });
      }
      onSaved();
    } catch {
      setError("Erro ao salvar coleção. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    field: keyof CreateCollectionInput,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      key={collection?.id ?? "new"}
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nome da Coleção <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ex: Ficção Científica"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Descrição (opcional)
          </label>
          <textarea
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Breve descrição sobre esta coleção..."
            className="w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            URL da Capa (opcional)
          </label>
          <input
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
          <label className="mb-1 block text-sm font-medium">
            Cor da Coleção (opcional)
          </label>
          <button
            type="button"
            onClick={() => setIsColorPickerOpen(true)}
            className="flex items-center gap-3 rounded-lg border border-neutral-300 bg-white px-3 py-2 transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
          >
            <span
              className="h-8 w-8 shrink-0 rounded-lg shadow-inner"
              style={{ backgroundColor: form.color ?? "#6B7280" }}
            />
            <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
              {form.color ?? "#6B7280"}
            </span>
            <span className="ml-auto text-xs text-neutral-400">Editar</span>
          </button>
          <ColorPickerModal
            isOpen={isColorPickerOpen}
            initialColor={form.color ?? "#6B7280"}
            onSave={(color) => {
              handleChange("color", color);
              setIsColorPickerOpen(false);
            }}
            onCancel={() => setIsColorPickerOpen(false)}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="mt-3 text-sm text-green-600">
          Coleção salva com sucesso!
        </p>
      )}

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {saving
            ? "Salvando..."
            : collection
              ? "Salvar Alterações"
              : "Criar Coleção"}
        </button>

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
