
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';

const alertSchema = z.object({
  title: z.string().min(3).max(50),
  message: z.string().min(10).max(200),
});

export async function createAlert(data: z.infer<typeof alertSchema>) {
  const validatedData = alertSchema.parse(data);

  try {
    await addDoc(collection(db, 'alerts'), {
      ...validatedData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating alert:", error);
    throw new Error("Could not create alert in the database.");
  }
}

export async function deleteAlert(id: string) {
  if (!id) {
    throw new Error("Alert ID is required.");
  }
  try {
    await deleteDoc(doc(db, "alerts", id));
  } catch (error) {
    console.error("Error deleting alert:", error);
    throw new Error("Could not delete alert from the database.");
  }
}
