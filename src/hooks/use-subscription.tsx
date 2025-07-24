
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';

export interface Subscription {
    status: 'active' | 'inactive';
    startedAt: Timestamp;
    expiresAt: Timestamp;
}

interface SubscriptionContextType {
  subscriptions: { [key: string]: Subscription };
  loading: boolean;
  hasSubscription: (serviceId: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptions: {},
  loading: true,
  hasSubscription: () => false,
});

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<{ [key: string]: Subscription }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setSubscriptions({});
      return;
    }

    const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSubscriptions(data.subscriptions || {});
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user, authLoading]);

  const hasSubscription = (serviceId: string): boolean => {
    const sub = subscriptions[serviceId];
    if (!sub) return false;
    
    const now = new Date();
    const expires = sub.expiresAt.toDate();
    
    return sub.status === 'active' && expires > now;
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptions, loading, hasSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};
