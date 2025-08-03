
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const signalSchema = z.object({
  pair: z.string().min(3).toUpperCase(),
  action: z.enum(['BUY', 'SELL']),
  entry: z.coerce.number(),
  stopLoss: z.coerce.number(),
  takeProfit1: z.coerce.number(),
  takeProfit2: z.coerce.number(),
  isPremium: z.boolean().optional(),
});

export async function createSignal(data: z.infer<typeof signalSchema>) {
  const validatedData = signalSchema.parse(data);

  try {
    await addDoc(collection(db, 'signals'), {
      ...validatedData,
      isPremium: validatedData.isPremium || false,
      status: 'Active',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating signal:", error);
    throw new Error("Could not create signal in the database.");
  }
}

export async function updateSignalStatus(id: string, status: 'Active' | 'Expired') {
    if (!id) {
        throw new Error("Signal ID is required.");
    }

    try {
        const signalRef = doc(db, "signals", id);
        await updateDoc(signalRef, {
            status: status,
            outcome: null, // Reset outcome when re-activating
        });
    } catch (error) {
        console.error("Error updating signal status:", error);
        throw new Error("Could not update signal status in the database.");
    }
}

export async function updateSignalOutcome(id: string, outcome: 'Profit' | 'Loss') {
    if (!id) {
        throw new Error("Signal ID is required.");
    }

    try {
        const signalRef = doc(db, "signals", id);
        await updateDoc(signalRef, {
            status: 'Expired',
            outcome: outcome
        });
    } catch (error) {
        console.error("Error updating signal outcome:", error);
        throw new Error("Could not update signal outcome in the database.");
    }
}

export async function deleteSignal(id: string) {
    if (!id) {
        throw new Error("Signal ID is required.");
    }

    try {
        await deleteDoc(doc(db, "signals", id));
    } catch (error) {
        console.error("Error deleting signal:", error);
        throw new Error("Could not delete signal from the database.");
    }
}
