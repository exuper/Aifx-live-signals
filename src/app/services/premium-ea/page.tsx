
'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { AccessDenied } from '@/components/layout/access-denied';
import { PageHeader } from '@/components/page-header';
import { PaymentForm } from '@/components/payment-form';

const service = {
    id: "premium_ea",
    title: "Premium EA",
    priceAmount: 100
};

export default function PremiumEaPage() {
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

    return (
        <div className="space-y-8">
            <PageHeader
                title={service.title}
                description="Download and get instructions for the Premium Expert Advisor."
            />
            {/* TODO: Add the actual content for this service here */}
            <div className="text-center p-16 border-2 border-dashed rounded-lg">
                <p>EA Download and Instructions Go Here</p>
            </div>
        </div>
    );
}
