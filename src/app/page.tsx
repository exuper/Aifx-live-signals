
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { SignalCard } from "@/components/signal-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Signal } from "@/lib/mock-data";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Query for signals that are NOT premium
    const q = query(
      collection(db, "signals"), 
      where("isPremium", "==", false),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const signalsData: Signal[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        signalsData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now()
        } as Signal);
      });
      setSignals(signalsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching signals:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeSignals = signals.filter((signal) => signal.status === 'Active');
  const expiredSignals = signals.filter((signal) => signal.status === 'Expired');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Signals"
        description="Real-time Forex signals. Stay updated with the latest market movements."
      />

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="active">Active Signals</TabsTrigger>
          <TabsTrigger value="expired">Signal History</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[150px] w-full" />)}
            </div>
          ) : activeSignals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
              {activeSignals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center text-muted-foreground">
              No active signals at the moment.
            </div>
          )}
        </TabsContent>
        <TabsContent value="expired">
           {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[150px] w-full" />)}
            </div>
          ) : expiredSignals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
              {expiredSignals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center text-muted-foreground">
              No expired signals found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
