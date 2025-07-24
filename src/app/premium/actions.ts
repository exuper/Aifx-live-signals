
'use server';

import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// We will not use Zod here to avoid FormData parsing complexities.
// Validation will be done manually.

export async function submitPayment(formData: FormData) {
  try {
    const userId = formData.get('userId') as string;
    const userEmail = formData.get('userEmail') as string;
    const serviceId = formData.get('serviceId') as string;
    const serviceTitle = formData.get('serviceTitle') as string;
    const priceAmount = Number(formData.get('priceAmount'));
    const paymentMethod = formData.get('paymentMethod') as string;
    const senderName = formData.get('senderName') as string | undefined;
    const receiptFile = formData.get('receipt') as File | null;

    // Manual validation
    if (!userId || !userEmail || !serviceId || !serviceTitle || !priceAmount || !paymentMethod) {
        throw new Error('Invalid data provided. Please check your inputs.');
    }

    let receiptUrl: string | undefined = undefined;

    // Handle file upload
    if (receiptFile && receiptFile.size > 0) {
        const storageRef = ref(storage, `receipts/${Date.now()}_${receiptFile.name}`);
        const snapshot = await uploadBytes(storageRef, receiptFile);
        receiptUrl = await getDownloadURL(snapshot.ref);
    }

    // Prepare data for Firestore
    const paymentData: any = {
      userId,
      userEmail,
      serviceId,
      serviceTitle,
      priceAmount,
      paymentMethod,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    if (senderName) {
      paymentData.senderName = senderName;
    }
    if (receiptUrl) {
      paymentData.receiptUrl = receiptUrl;
    }

    // Add document to Firestore
    await addDoc(collection(db, 'payments'), paymentData);

    return { success: true };
  } catch (error) {
    console.error("Error submitting payment:", error);
    // Return a more specific error if possible, otherwise generic.
    const errorMessage = error instanceof Error ? error.message : "Could not save payment submission.";
    return { success: false, error: errorMessage };
  }
}
