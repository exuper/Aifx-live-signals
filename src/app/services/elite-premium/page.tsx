
'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { PaymentForm } from '@/components/payment-form';
import { ContentLock } from '@/components/layout/content-lock';

const service = {
    id: "elite_premium",
    title: "Elite Premium",
    priceAmount: 100
};

export default function ElitePremiumPage() {
    const { user, loading: authLoading } = useAuth();
    const { hasSubscription, loading: subLoading } = useSubscription();
    
    const isLoading = authLoading || subLoading;

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

    return (
        <div className="space-y-8">
            <PageHeader
                title={service.title}
                description="This is the exclusive content for Elite Premium members."
            />
            {/* TODO: Add the actual content for this service here */}
            <div className="text-center p-16 border-2 border-dashed rounded-lg">
                <p>Elite Content (Premium Signals + Mentorship) Goes Here</p>
            </div>
        </div>
    );
}
