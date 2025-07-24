
'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ContentLock } from '@/components/layout/content-lock';
import { getPremiumContent } from '@/app/admin/premium-content/actions';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const service = {
    id: "mentorship",
    title: "Mentorship",
    priceAmount: 50
};

export default function MentorshipPage() {
    const { user, loading: authLoading } = useAuth();
    const { hasSubscription, loading: subLoading } = useSubscription();
    const [content, setContent] = useState({ mentorshipContent: '' });
    const [contentLoading, setContentLoading] = useState(true);
    
    const isLoading = authLoading || subLoading || contentLoading;

    useEffect(() => {
        getPremiumContent().then(data => {
            setContent(data);
            setContentLoading(false);
        });
    }, []);

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
                description="Access your one-on-one mentorship resources here."
            />
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Welcome to the Mentorship Program</CardTitle>
                    <CardDescription>Find all the information you need to get started below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                        {content.mentorshipContent}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
