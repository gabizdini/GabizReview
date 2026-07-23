import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type {
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "@/types/collection";
import type { Review } from "@/types/review";

const COLLECTIONS = "collections";
const REVIEWS = "reviews";

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );
}

export async function getAllCollections(): Promise<Collection[]> {
  const q = query(
    collection(db, COLLECTIONS),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Collection));
}

export async function getCollectionById(
  id: string
): Promise<Collection | null> {
  const snap = await getDoc(doc(db, COLLECTIONS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Collection;
}

export async function createCollection(
  data: CreateCollectionInput
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS), {
    ...stripUndefined(data as Record<string, unknown>),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateCollection(
  id: string,
  data: UpdateCollectionInput
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS, id), {
    ...stripUndefined(data as Record<string, unknown>),
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCollection(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS, id));
}

export async function getReviewsByCollectionId(
  collectionId: string
): Promise<Review[]> {
  const q = query(
    collection(db, REVIEWS),
    where("collectionId", "==", collectionId)
  );
  const snapshot = await getDocs(q);
  const reviews = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Review)
  );
  return reviews.sort(
    (a, b) => (a.collectionOrder ?? 0) - (b.collectionOrder ?? 0)
  );
}

export async function getCollectionReviewCount(
  collectionId: string
): Promise<number> {
  const q = query(
    collection(db, REVIEWS),
    where("collectionId", "==", collectionId)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function updateCollectionsOrder(
  orderedIds: string[]
): Promise<void> {
  const updates = orderedIds.map((id, index) =>
    updateDoc(doc(db, COLLECTIONS, id), {
      order: index,
      updatedAt: Timestamp.now(),
    })
  );
  await Promise.all(updates);
}
