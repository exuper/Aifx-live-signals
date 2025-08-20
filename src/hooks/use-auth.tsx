
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// A debounced function to update the lastSeen timestamp.
// This prevents excessive writes to Firestore on every auth state change.
let lastSeenTimeout: NodeJS.Timeout;
const updateLastSeen = (uid: string) => {
    clearTimeout(lastSeenTimeout);
    lastSeenTimeout = setTimeout(() => {
        const userRef = doc(db, 'users', uid);
        setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true });
    }, 5000); // Update every 5 seconds of activity
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        // If user is logged in, update their last seen timestamp.
        updateLastSeen(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
