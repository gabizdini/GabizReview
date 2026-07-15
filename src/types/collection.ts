import { Timestamp } from "firebase/firestore";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  color?: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateCollectionInput = Omit<
  Collection,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateCollectionInput = Partial<
  Omit<Collection, "id" | "createdAt" | "updatedAt">
>;
