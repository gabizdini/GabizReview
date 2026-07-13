import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Review } from "@/types/review";

const COLLECTION = "reviews";

export async function getReviewsByBookTitle(
  bookTitle: string
): Promise<Review[]> {
  const q = query(
    collection(db, COLLECTION),
    where("bookTitle", "==", bookTitle)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

export async function getUniqueBooks(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const titles = snapshot.docs.map(
    (d) => (d.data() as Review).bookTitle
  );
  return [...new Set(titles)].sort();
}
