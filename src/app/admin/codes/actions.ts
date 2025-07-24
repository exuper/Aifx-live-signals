
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { addDays } from 'date-fns';

const generateCodeSchema = z.object({
  serviceId: z.string().min(1, "Service is required."),
  durationDays: z.coerce.number().min(1, "Duration must be at least 1 day."),
});

export type GenerateCodeFormData = z.infer<typeof generateCodeSchema>;

function generateRandomCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createAccessCode(data: GenerateCodeFormData) {
  const validatedData = generateCodeSchema.parse(data);
  const { serviceId, durationDays } = validatedData;
  
  const code = generateRandomCode();
  const expiresAt = addDays(new Date(), durationDays);

  try {
    await addDoc(collection(db, 'accessCodes'), {
      code,
      serviceId,
      expiresAt,
      durationDays,
      isUsed: false,
      usedBy: null,
      usedByEmail: null,
      usedAt: null,
      createdAt: serverTimestamp(),
    });
    return { success: true, code };
  } catch (error) {
    console.error("Error creating access code:", error);
    return { success: false, error: "Could not create access code." };
  }
}

export async function getAccessCodes() {
   try {
    const q = query(collection(db, 'accessCodes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching access codes:", error);
    throw new Error("Could not fetch access codes from the database.");
  }
}
