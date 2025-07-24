
'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ContentLock } from '@/components/layout/content-lock';

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
    
    if (!user || !hasSubscription(service.id)) {
        return <ContentLock service={service} />;
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
