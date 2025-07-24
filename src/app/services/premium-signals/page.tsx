
'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ContentLock } from '@/components/layout/content-lock';
import { SignalCard } from '@/components/signal-card';
import { Signal } from '@/lib/mock-data';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const service = {
    id: "premium_signals",
    title: "Premium Signals",
    priceAmount: 15
};

export default function PremiumSignalsPage() {
    const { user, loading: authLoading } = useAuth();
    const { hasSubscription, loading: subLoading } = useSubscription();
    const [signals, setSignals] = useState<Signal[]>([]);
    const [contentLoading, setContentLoading] = useState(true);
    
    const isLoading = authLoading || subLoading || contentLoading;

    useEffect(() => {
        // Only fetch signals if the user is authenticated, to avoid unnecessary reads.
        if (user) {
            const q = query(collection(db, "signals"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const signalsData: Signal[] = [];
                querySnapshot.forEach((doc) => {
                    signalsData.push({ id: doc.id, ...doc.data() } as Signal);
                });
                setSignals(signalsData);
                setContentLoading(false);
            }, (error) => {
                console.error("Error fetching signals:", error);
                setContentLoading(false);
            });

            return () => unsubscribe();
        } else {
            setContentLoading(false);
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user || !hasSubscription(service.id)) {
        return <ContentLock service={service} />;
    }

    // User is subscribed, show the premium content
    return (
        <div className="space-y-8">
            <PageHeader
                title={service.title}
                description="This is the exclusive content for Premium Signals subscribers."
            />
            {contentLoading ? (
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[150px] w-full" />)}
                 </div>
            ) : signals.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                    {signals.map((signal) => (
                        <SignalCard key={signal.id} signal={signal} />
                    ))}
                </div>
            ) : (
                 <div className="mt-8 text-center text-muted-foreground">
                    No active premium signals at the moment.
                </div>
            )}
        </div>
    );
}
