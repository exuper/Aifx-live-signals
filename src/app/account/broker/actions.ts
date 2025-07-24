
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const submissionSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  brokerName: z.string().min(2, "Broker name is required."),
  accountNumber: z.string().min(3, "Account number is required."),
});

export async function submitBrokerDetails(data: z.infer<typeof submissionSchema>) {
  const validatedData = submissionSchema.parse(data);

  // Check if a user already has a pending or verified submission
  const q = query(
    collection(db, 'brokerSubmissions'), 
    where('userId', '==', validatedData.userId),
    where('status', 'in', ['pending', 'verified'])
  );

  const existingSubmissions = await getDocs(q);
  if (!existingSubmissions.empty) {
    return { success: false, error: 'You already have an active or pending submission.' };
  }

  try {
    await addDoc(collection(db, 'brokerSubmissions'), {
      ...validatedData,
      status: 'pending',
      submittedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting broker details:", error);
    return { success: false, error: "Could not save submission. Please try again." };
  }
}
