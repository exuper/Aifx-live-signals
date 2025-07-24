
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const premiumContentSchema = z.object({
  eaDownloadUrl: z.string().url("Must be a valid URL."),
  mentorshipContent: z.string().min(1, "Mentorship content is required."),
  elitePremiumContent: z.string().min(1, "Elite Premium content is required."),
});

export type PremiumContentData = z.infer<typeof premiumContentSchema>;

const defaultContent: PremiumContentData = {
    eaDownloadUrl: "https://example.com/not-configured",
    mentorshipContent: "Welcome to Mentorship! Please contact us to schedule your first session.",
    elitePremiumContent: "Welcome to Elite Premium! You have access to all our services. Please contact us for more details.",
};

export async function getPremiumContent(): Promise<PremiumContentData> {
  const docRef = doc(db, 'settings', 'premiumContent');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const result = premiumContentSchema.safeParse(data);
    if (result.success) {
        return result.data;
    }
  }
  
  // If no data or invalid data, return defaults and don't write them yet.
  return defaultContent;
}

export async function updatePremiumContent(data: PremiumContentData) {
  const validatedData = premiumContentSchema.parse(data);

  try {
    const docRef = doc(db, 'settings', 'premiumContent');
    await setDoc(docRef, validatedData, { merge: true });
  } catch (error) {
    console.error("Error updating premium content:", error);
    throw new Error("Could not update premium content in the database.");
  }
}
