
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { add } from 'date-fns';

const redeemCodeSchema = z.object({
  code: z.string().min(1, 'Code is required.').toUpperCase(),
});

export async function redeemAccessCode(userId: string, userEmail: string, data: { code: string }) {
  if (!userId || !userEmail) {
    return { success: false, error: 'User is not authenticated.' };
  }

  const validatedData = redeemCodeSchema.safeParse(data);
  if (!validatedData.success) {
    return { success: false, error: 'Invalid code format.' };
  }
  
  const { code } = validatedData.data;

  try {
    const codesRef = collection(db, 'accessCodes');
    const q = query(codesRef, where('code', '==', code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'Invalid or non-existent access code.' };
    }

    const codeDoc = querySnapshot.docs[0];
    const codeData = codeDoc.data();

    if (codeData.isUsed) {
      return { success: false, error: 'This code has already been used.' };
    }
    
    const expiresAt = codeData.expiresAt.toDate();
    if (new Date() > expiresAt) {
      return { success: false, error: 'This code has expired.' };
    }

    // Code is valid, not used, and not expired. Let's redeem it.
    const batch = writeBatch(db);

    // 1. Update the code document
    const codeDocRef = doc(db, 'accessCodes', codeDoc.id);
    batch.update(codeDocRef, {
      isUsed: true,
      usedBy: userId,
      usedByEmail: userEmail,
      usedAt: Timestamp.now(),
    });

    // 2. Update the user's subscription
    const userRef = doc(db, 'users', userId);
    const serviceId = codeData.serviceId;
    const subscriptionField = `subscriptions.${serviceId}`;

    const newExpiresAt = add(new Date(), { days: codeData.durationDays });

    batch.set(userRef, {
      [subscriptionField]: {
        status: 'active',
        expiresAt: Timestamp.fromDate(newExpiresAt),
        startedAt: Timestamp.now(),
      }
    }, { merge: true });

    await batch.commit();

    return { success: true, serviceId };

  } catch (error) {
    console.error('Error redeeming code:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
