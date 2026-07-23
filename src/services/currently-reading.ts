import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type {
  CurrentlyReading,
  CreateCurrentlyReadingInput,
  UpdateCurrentlyReadingInput,
} from "@/types/currently-reading";

const COLLECTION = "currentlyReading";

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );
}

export async function getAllCurrentlyReading(): Promise<CurrentlyReading[]> {
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() } as CurrentlyReading)
  );
}

export async function createCurrentlyReading(
  data: CreateCurrentlyReadingInput
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...stripUndefined(data as Record<string, unknown>),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateCurrentlyReading(
  id: string,
  data: UpdateCurrentlyReadingInput
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...stripUndefined(data as Record<string, unknown>),
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCurrentlyReading(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function updateCurrentlyReadingOrder(
  orderedIds: string[]
): Promise<void> {
  const updates = orderedIds.map((id, index) =>
    updateDoc(doc(db, COLLECTION, id), {
      order: index,
      updatedAt: Timestamp.now(),
    })
  );
  await Promise.all(updates);
}
