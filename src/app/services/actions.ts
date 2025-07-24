
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, writeBatch, doc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { add } from 'date-fns';

const redeemCodeSchema = z.object({
  code: z.string().min(1, 'Code is required.').toUpperCase(),
});

export async function redeemAccessCode(userId: string, userEmail: string, code: string) {
  if (!userId || !userEmail) {
    return { success: false, error: 'User is not authenticated.' };
  }
  
  const validation = redeemCodeSchema.safeParse({ code });
  if (!validation.success) {
      return { success: false, error: 'Invalid code format.'};
  }
  
  const validatedCode = validation.data.code;

  const codesRef = collection(db, 'accessCodes');
  const q = query(codesRef, where('code', '==', validatedCode));

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'Invalid or non-existent access code.' };
    }

    const codeDoc = querySnapshot.docs[0];
    const codeData = codeDoc.data();

    if (codeData.isUsed) {
      return { success: false, error: 'This code has already been used.' };
    }
    
    // Convert Firestore Timestamp to Date for comparison
    const expiresAt = (codeData.expiresAt as Timestamp).toDate();
    if (expiresAt < new Date()) {
      return { success: false, error: 'This code has expired.' };
    }

    // Prepare a batch write to update both user and code documents atomically
    const batch = writeBatch(db);

    // 1. Update the access code document
    const codeDocRef = doc(db, 'accessCodes', codeDoc.id);
    batch.update(codeDocRef, {
      isUsed: true,
      usedBy: userId,
      usedByEmail: userEmail,
      usedAt: serverTimestamp(),
    });

    // 2. Update the user's subscription record
    const userRef = doc(db, 'users', userId);
    const serviceId = codeData.serviceId;
    const durationDays = codeData.durationDays;
    
    // Calculate new expiration date for the subscription
    const newSubscriptionExpiresAt = add(new Date(), { days: durationDays });

    const subscriptionData = {
      status: 'active',
      startedAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(newSubscriptionExpiresAt),
    };
    
    batch.set(userRef, { 
      subscriptions: {
        [serviceId]: subscriptionData
      } 
    }, { merge: true });

    // Commit the batch write
    await batch.commit();

    return { success: true, serviceId: codeData.serviceId };

  } catch (error) {
    console.error("Error redeeming code:", error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
