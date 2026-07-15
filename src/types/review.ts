import { Timestamp } from "firebase/firestore";

export interface Review {
  id: string;
  title: string;
  bookTitle: string;
  author: string;
  content: string;
  rating: number;
  coverUrl?: string;
  isFavorite: boolean;
  collectionId?: string;
  collectionOrder?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likesCount: number;
  commentsCount: number;
}

export type CreateReviewInput = Omit<
  Review,
  "id" | "createdAt" | "updatedAt" | "likesCount" | "commentsCount"
>;

export type UpdateReviewInput = Partial<
  Omit<Review, "id" | "createdAt" | "updatedAt">
>;
