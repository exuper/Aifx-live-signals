
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
  // Receipt is handled separately now
});


export async function submitPayment(formData: FormData) {
  const rawData = {
      userId: formData.get('userId'),
      userEmail: formData.get('userEmail'),
      serviceId: formData.get('serviceId'),
      serviceTitle: formData.get('serviceTitle'),
      priceAmount: formData.get('priceAmount'),
      paymentMethod: formData.get('paymentMethod'),
      senderName: formData.get('senderName') || undefined,
  };

  const validatedData = paymentSchema.safeParse(rawData);
  const receiptFile = formData.get('receipt') as File | null;

  if (!validatedData.success) {
    console.error("Zod validation error:", validatedData.error.errors);
    return { success: false, error: 'Invalid data provided. Please check your inputs.' };
  }

  const paymentData = validatedData.data;

  try {
    let receiptUrl: string | undefined = undefined;

    // Check if a valid file was uploaded
    if (receiptFile && receiptFile.size > 0) {
        const storageRef = ref(storage, `receipts/${Date.now()}_${receiptFile.name}`);
        const snapshot = await uploadBytes(storageRef, receiptFile);
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
