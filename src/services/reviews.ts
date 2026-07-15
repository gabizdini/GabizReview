import {
  collection,
  increment,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Review, CreateReviewInput, UpdateReviewInput } from "@/types/review";

const COLLECTION = "reviews";

export async function getAllReviews(): Promise<Review[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

export async function getReviewById(id: string): Promise<Review | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Review;
}

export async function createReview(data: CreateReviewInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    isFavorite: data.isFavorite ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    likesCount: 0,
    commentsCount: 0,
  });
  return docRef.id;
}

export async function updateReview(
  id: string,
  data: UpdateReviewInput
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function likeReview(reviewId: string): Promise<void> {
  try {
    const reviewRef = doc(db, COLLECTION, reviewId);
    await updateDoc(reviewRef, {
      likesCount: increment(1),
    });
  } catch (error) {
    console.error("Erro ao curtir review:", error);
    throw error;
  }
}

export async function unlikeReview(reviewId: string): Promise<void> {
  try {
    const reviewRef = doc(db, COLLECTION, reviewId);
    await updateDoc(reviewRef, {
      likesCount: increment(-1),
    });
  } catch (error) {
    console.error("Erro ao descurtir review:", error);
    throw error;
  }
}
