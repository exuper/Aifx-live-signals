
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound, Loader2, Lock } from "lucide-react";
import { PageHeader } from "../page-header";
import { PaymentForm } from '../payment-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { redeemAccessCode } from '@/app/services/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface ContentLockProps {
  service: {
    id: string;
    title: string;
    priceAmount: number;
  };
}

export function ContentLock({ service }: ContentLockProps) {
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRedeem = async () => {
        if (!user) {
            toast({ title: "Not Authenticated", description: "You must be logged in to redeem a code.", variant: "destructive" });
            router.push('/login');
            return;
        }
        if (!code) {
            toast({ title: "No Code Entered", description: "Please enter your access code.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await redeemAccessCode(user.uid, user.email!, code);
            if (result.success && result.serviceId) {
                toast({ title: "Success!", description: `You now have access to ${service.title}. The page will now reload.`});
                // Force a reload to re-check subscription status from the server
                setTimeout(() => window.location.reload(), 1500);
            } else {
                toast({ title: "Redemption Failed", description: result.error, variant: "destructive" });
                 setIsSubmitting(false);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "An unknown error occurred.", variant: "destructive" });
             setIsSubmitting(false);
        }
    };


    return (
        <div className="space-y-8">
            <PageHeader title={service.title} />
            <Card className="max-w-xl mx-auto border-primary/50">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                        <Lock className="w-12 h-12 text-primary" />
                    </div>
                     <CardTitle className="pt-4 font-headline text-3xl">Content Locked</CardTitle>
                    <CardDescription className="text-base">
                       This is a premium service. Please choose a method below to gain access.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="payment" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="payment">Make Payment</TabsTrigger>
                            <TabsTrigger value="code">Redeem Code</TabsTrigger>
                        </TabsList>
                        <TabsContent value="payment">
                             <PaymentForm service={service} />
                        </TabsContent>
                        <TabsContent value="code">
                            <Card className="bg-background/50 border-none shadow-none">
                                <CardHeader>
                                    <CardTitle className="font-headline flex items-center gap-2">
                                        <KeyRound />
                                        Enter Access Code
                                    </CardTitle>
                                    <CardDescription>
                                        If you have an access code from an admin, enter it below to unlock this service.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="access-code">Your Code</Label>
                                        <Input 
                                            id="access-code" 
                                            placeholder="XXXX-XXXX" 
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                                            className="font-mono text-center text-lg h-12"
                                        />
                                    </div>
                                    <Button onClick={handleRedeem} disabled={isSubmitting} className="w-full">
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Unlock Content
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
