
'use server';

import { z } from 'zod';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const emailSchema = z.string().email();

// A new function to ensure a user document exists in Firestore.
// This is useful for social sign-ins where the user is created on the client.
export async function ensureUserDocument(uid: string, email: string | null) {
  if (!uid || !email) {
    return { success: false, error: 'User ID and email are required.' };
  }

  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // User document doesn't exist, create it.
    try {
      await setDoc(userRef, {
        email: email,
        createdAt: new Date(),
        subscriptions: {}, // Initialize with no subscriptions
      });
      return { success: true, isNew: true };
    } catch (error) {
       if (error instanceof FirebaseError) {
        return { success: false, error: error.code };
      }
      return { success: false, error: 'An unknown error occurred while creating user document.' };
    }
  }

  // User document already exists.
  return { success: true, isNew: false };
}


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
