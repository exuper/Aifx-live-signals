
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const hslColorRegex = /^(\d{1,3})\s+(\d{1,3})%\s+(\d{1,3})%$/;

const themeSchema = z.object({
  primary: z.string().regex(hslColorRegex, "Primary color must be a valid HSL string (e.g., '72 100% 50%')"),
  background: z.string().regex(hslColorRegex, "Background color must be a valid HSL string"),
  accent: z.string().regex(hslColorRegex, "Accent color must be a valid HSL string"),
});

export type ThemeData = z.infer<typeof themeSchema>;

const defaultTheme: ThemeData = {
    primary: '72 100% 50%',
    background: '224 71.4% 4.1%',
    accent: '120 61% 34%',
};

export async function getThemeData(): Promise<ThemeData> {
  const docRef = doc(db, 'settings', 'theme');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Basic validation to ensure data from DB is in the correct format
    const data = docSnap.data();
    const result = themeSchema.safeParse(data);
    if (result.success) {
        return result.data;
    }
  }
  
  // Return default theme if doc doesn't exist or data is invalid
  return defaultTheme;
}

export async function updateThemeData(data: ThemeData) {
  const validatedData = themeSchema.parse(data);

  try {
    const docRef = doc(db, 'settings', 'theme');
    await setDoc(docRef, validatedData);

    // This is crucial for Next.js to re-render the layout with the new theme
    revalidatePath('/', 'layout');
    
  } catch (error) {
    console.error("Error updating theme:", error);
    throw new Error("Could not update theme in the database.");
  }
}
