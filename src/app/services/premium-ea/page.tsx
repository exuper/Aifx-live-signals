
'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { AccessDenied } from '@/components/layout/access-denied';
import { PageHeader } from '@/components/page-header';

const SERVICE_ID = 'premium_ea';
const SERVICE_TITLE = 'Premium EA';

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

    if (!user || !hasSubscription(SERVICE_ID)) {
        return <AccessDenied serviceTitle={SERVICE_TITLE} />;
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title={SERVICE_TITLE}
                description="Download and get instructions for the Premium Expert Advisor."
            />
            {/* TODO: Add the actual content for this service here */}
            <div className="text-center p-16 border-2 border-dashed rounded-lg">
                <p>EA Download and Instructions Go Here</p>
            </div>
        </div>
    );
}
