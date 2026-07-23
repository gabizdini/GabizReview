import { Timestamp } from "firebase/firestore";

export interface CurrentlyReading {
  id: string;
  bookTitle: string;
  author: string;
  coverUrl?: string;
  progress: number;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateCurrentlyReadingInput = Omit<
  CurrentlyReading,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateCurrentlyReadingInput = Partial<
  Omit<CurrentlyReading, "id" | "createdAt" | "updatedAt">
>;
