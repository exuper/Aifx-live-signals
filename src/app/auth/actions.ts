
'use server';

import { z } from 'zod';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const emailSchema = z.string().email();

export async function handleSignUp(data: z.infer<typeof signupSchema>) {
  const validatedData = signupSchema.parse(data);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      validatedData.email,
      validatedData.password
    );
    
    // Create a user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      createdAt: new Date(),
      subscriptions: {}, // Initialize with no subscriptions
    });

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

export async function handlePasswordReset(email: string) {
    const validatedEmail = emailSchema.parse(email);

    try {
        await sendPasswordResetEmail(auth, validatedEmail);
        return { success: true };
    } catch (error) {
        if (error instanceof FirebaseError) {
            // We don't want to reveal if an email exists or not for security reasons.
            // So, we'll return success even if the user is not found.
            if (error.code === 'auth/user-not-found') {
                return { success: true }; 
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred.' };
    }
}
