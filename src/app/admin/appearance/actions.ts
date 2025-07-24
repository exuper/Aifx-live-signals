
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const hslColorRegex = /^(\d{1,3})\s+(\d{1,3})%\s+(\d{1,3})%$/;

const appearanceSchema = z.object({
  primary: z.string().regex(hslColorRegex, "Primary color must be a valid HSL string (e.g., '72 100% 50%')"),
  backgroundHsl: z.string().regex(hslColorRegex, "Background color must be a valid HSL string"),
  accent: z.string().regex(hslColorRegex, "Accent color must be a valid HSL string"),
  background: z.enum(['lines', 'particles', 'aurora']),
  fontBody: z.string().min(1, "Body font is required."),
  fontHeadline: z.string().min(1, "Headline font is required."),
});

export type AppearanceData = z.infer<typeof appearanceSchema>;

const defaultAppearance: AppearanceData = {
    primary: '72 100% 50%',
    backgroundHsl: '224 71.4% 4.1%',
    accent: '120 61% 34%',
    background: 'lines',
    fontBody: 'Inter',
    fontHeadline: 'Space Grotesk',
};

export async function getAppearanceData(): Promise<AppearanceData> {
  const docRef = doc(db, 'settings', 'appearance');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const result = appearanceSchema.safeParse(data);
    if (result.success) {
        return result.data;
    } else {
        console.warn("Invalid appearance data in Firestore, returning defaults.", result.error);
    }
  }
  
  return defaultAppearance;
}

export async function updateAppearanceData(data: AppearanceData) {
  const validatedData = appearanceSchema.parse(data);

  try {
    const docRef = doc(db, 'settings', 'appearance');
    await setDoc(docRef, validatedData);
    revalidatePath('/', 'layout');
    
  } catch (error) {
    console.error("Error updating appearance:", error);
    throw new Error("Could not update appearance in the database.");
  }
}
