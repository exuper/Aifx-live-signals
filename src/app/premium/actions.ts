
'use server';

import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const paymentSchema = z.object({
  userId: z.string(),
  userEmail: z.string(),
  serviceId: z.string(),
  serviceTitle: z.string(),
  priceAmount: z.coerce.number(),
  paymentMethod: z.string(),
  senderName: z.string().optional(),
  receipt: z.any().refine(file => file === undefined || (file instanceof File && file.size > 0), {
    message: "Receipt must be a valid file.",
  }).optional(),
});


export async function submitPayment(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  // If no file is selected, the browser sends an empty File object. Remove it.
  if (rawData.receipt && (rawData.receipt as File).size === 0) {
      delete rawData.receipt;
  }

  const validatedData = paymentSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error("Zod validation error:", validatedData.error.errors);
    return { success: false, error: 'Invalid data provided. Please check your inputs.' };
  }

  const { receipt, ...paymentData } = validatedData.data;

  try {
    let receiptUrl: string | undefined = undefined;

    if (receipt) {
        const storageRef = ref(storage, `receipts/${Date.now()}_${receipt.name}`);
        const snapshot = await uploadBytes(storageRef, receipt);
        receiptUrl = await getDownloadURL(snapshot.ref);
    }

    await addDoc(collection(db, 'payments'), {
      ...paymentData,
      receiptUrl,
      status: 'pending', // All submissions are pending until manually verified
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting payment:", error);
    return { success: false, error: "Could not save payment submission." };
  }
}
