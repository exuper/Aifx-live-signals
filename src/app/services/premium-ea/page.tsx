
'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { Bot, Download, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ContentLock } from '@/components/layout/content-lock';
import { getPremiumContent } from '@/app/admin/premium-content/actions';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const service = {
    id: "premium_ea",
    title: "Premium EA",
    priceAmount: 100
};

export default function PremiumEaPage() {
    const { user, loading: authLoading } = useAuth();
    const { hasSubscription, loading: subLoading } = useSubscription();
    const [content, setContent] = useState({ eaDownloadUrl: '' });
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
                description="Download and get instructions for the Premium Expert Advisor."
            />
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Bot />Download Your EA</CardTitle>
                    <CardDescription>Click the button below to download your exclusive Expert Advisor file.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full" size="lg">
                        <a href={content.eaDownloadUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2" />
                            Download Premium EA
                        </a>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                        Note: Ensure you have the correct trading platform version installed. Follow the included instructions for installation.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
