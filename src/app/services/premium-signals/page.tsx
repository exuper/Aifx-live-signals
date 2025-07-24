
'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { AccessDenied } from '@/components/layout/access-denied';
import { PageHeader } from '@/components/page-header';
import { PaymentForm } from '@/components/payment-form';

const service = {
    id: "premium_signals",
    title: "Premium Signals",
    priceAmount: 15
};

export default function PremiumSignalsPage() {
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
    
    if (!user) {
        // This case should be handled by the layout, but as a fallback
        return <AccessDenied serviceTitle={service.title} />;
    }

    if (!hasSubscription(service.id)) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title={`Subscribe to ${service.title}`}
                    description="Choose a payment method below to get instant access."
                />
                <PaymentForm service={service} />
            </div>
        );
    }

    // User is subscribed, show the premium content
    return (
        <div className="space-y-8">
            <PageHeader
                title={service.title}
                description="This is the exclusive content for Premium Signals subscribers."
            />
            {/* TODO: Add the actual content for this service here */}
            <div className="text-center p-16 border-2 border-dashed rounded-lg">
                <p>Premium Content Goes Here</p>
            </div>
        </div>
    );
}
