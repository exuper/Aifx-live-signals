
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Clock, ShieldX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitBrokerDetails } from './actions';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const submissionSchema = z.object({
  brokerName: z.string().min(2, "Broker name is required."),
  accountNumber: z.string().min(3, "Account number is required."),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface SubmissionStatus {
    id: string;
    status: 'pending' | 'verified' | 'rejected';
    submittedAt: Timestamp;
    brokerName: string;
    accountNumber: string;
}

const statusConfig = {
    pending: {
        title: "Submission Pending",
        description: "Your broker details are under review. This usually takes up to 24 hours.",
        Icon: Clock,
        className: 'bg-orange-500/20 text-orange-400'
    },
    verified: {
        title: "Account Verified",
        description: "Your broker account has been successfully verified. Thank you!",
        Icon: ShieldCheck,
        className: 'bg-green-500/20 text-green-400'
    },
    rejected: {
        title: "Submission Rejected",
        description: "Your submission could not be verified. Please check the details and submit again.",
        Icon: ShieldX,
        className: 'bg-red-500/20 text-red-400'
    }
};

export default function BrokerVerificationPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<SubmissionFormData>({
        resolver: zodResolver(submissionSchema),
    });

    useEffect(() => {
        if (!user) return;
        
        setIsLoadingStatus(true);
        const q = query(collection(db, 'brokerSubmissions'), where('userId', '==', user.uid));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const latestSubmission = querySnapshot.docs.sort((a, b) => b.data().submittedAt - a.data().submittedAt)[0];
                setSubmissionStatus(latestSubmission.data() as SubmissionStatus);
            } else {
                 setSubmissionStatus(null);
            }
            setIsLoadingStatus(false);
        });

        return () => unsubscribe();
    }, [user]);

    const onSubmit = async (data: SubmissionFormData) => {
        if (!user) {
            toast({ title: "Not logged in", description: "You must be logged in to submit.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        const result = await submitBrokerDetails({ ...data, userId: user.uid, userEmail: user.email! });
        if (result.success) {
            toast({ title: "Submitted!", description: "Your broker details have been submitted for verification." });
            reset();
        } else {
            toast({ title: "Submission Failed", description: result.error, variant: "destructive" });
        }
        setIsSubmitting(false);
    };

    const StatusDisplay = () => {
        if (!submissionStatus) return null;
        const config = statusConfig[submissionStatus.status];
        
        return (
            <Card>
                <CardHeader className="text-center">
                    <div className={cn("mx-auto p-3 rounded-full w-fit", config.className)}>
                        <config.Icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline pt-2">{config.title}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="text-sm p-3 border rounded-md bg-muted/50 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Broker:</span>
                            <span className="font-semibold">{submissionStatus.brokerName}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Account #:</span>
                            <span className="font-mono">{submissionStatus.accountNumber}</span>
                        </div>
                     </div>
                     {submissionStatus.status === 'rejected' && (
                        <Button className="w-full mt-4" onClick={() => setSubmissionStatus(null)}>
                            Submit Again
                        </Button>
                     )}
                </CardContent>
            </Card>
        )
    }

    if (isLoadingStatus) {
        return <Skeleton className="w-full h-64" />;
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Sponsor Broker Verification"
                description="Submit your broker account details for verification."
            />

            {submissionStatus && submissionStatus.status !== 'rejected' ? (
                <StatusDisplay />
            ) : (
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Submit Your Details</CardTitle>
                        <CardDescription>
                            Please provide the exact details of your trading account with our sponsoring broker.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="brokerName">Broker Name</Label>
                                <Input id="brokerName" {...register('brokerName')} placeholder="e.g. Acme Broker" />
                                {errors.brokerName && <p className="text-red-500 text-xs">{errors.brokerName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accountNumber">Trading Account Number</Label>
                                <Input id="accountNumber" {...register('accountNumber')} placeholder="e.g. 12345678" />
                                {errors.accountNumber && <p className="text-red-500 text-xs">{errors.accountNumber.message}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit for Verification
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
