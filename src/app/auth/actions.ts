
'use server';

import { z } from 'zod';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function handleSignUp(data: z.infer<typeof signupSchema>) {
  const validatedData = signupSchema.parse(data);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      validatedData.email,
      validatedData.password
    );
    return { success: true, userId: userCredential.user.uid };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error.code };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}

export async function handleSignOut() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error.code };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}
