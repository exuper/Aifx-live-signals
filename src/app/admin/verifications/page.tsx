
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Clock, ShieldX, MoreVertical, CheckCircle, XCircle } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { updateVerificationStatus } from './actions';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BrokerSubmission {
    id: string;
    userId: string;
    userEmail: string;
    brokerName: string;
    accountNumber: string;
    status: 'pending' | 'verified' | 'rejected';
    submittedAt: Timestamp;
}

export default function ManageVerificationsPage() {
    const [submissions, setSubmissions] = useState<BrokerSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "brokerSubmissions"), orderBy("submittedAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const submissionsData: BrokerSubmission[] = [];
            querySnapshot.forEach((doc) => {
                submissionsData.push({ id: doc.id, ...doc.data() } as BrokerSubmission);
            });
            setSubmissions(submissionsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching submissions:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (submissionId: string, status: 'verified' | 'rejected') => {
        try {
            await updateVerificationStatus(submissionId, status);
            toast({
                title: "Status Updated",
                description: `Submission has been marked as ${status}.`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update submission status.",
                variant: "destructive"
            });
        }
    };

    const pendingSubmissions = submissions.filter(p => p.status === 'pending');
    const verifiedSubmissions = submissions.filter(p => p.status === 'verified');
    const rejectedSubmissions = submissions.filter(p => p.status === 'rejected');

    return (
        <div className="space-y-8">
            <PageHeader
                title="Manage Verifications"
                description="Review and manage user broker account submissions."
            />
            <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">
                        <Clock className="mr-2"/>Pending ({pendingSubmissions.length})
                    </TabsTrigger>
                    <TabsTrigger value="verified">
                        <ShieldCheck className="mr-2"/>Verified ({verifiedSubmissions.length})
                    </TabsTrigger>
                     <TabsTrigger value="rejected">
                        <ShieldX className="mr-2"/>Rejected ({rejectedSubmissions.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <SubmissionTable
                        title="Pending Submissions"
                        submissions={pendingSubmissions}
                        isLoading={isLoading}
                        onStatusUpdate={handleStatusUpdate}
                    />
                </TabsContent>
                <TabsContent value="verified">
                     <SubmissionTable
                        title="Verified Submissions"
                        submissions={verifiedSubmissions}
                        isLoading={isLoading}
                        onStatusUpdate={handleStatusUpdate}
                    />
                </TabsContent>
                 <TabsContent value="rejected">
                     <SubmissionTable
                        title="Rejected Submissions"
                        submissions={rejectedSubmissions}
                        isLoading={isLoading}
                        onStatusUpdate={handleStatusUpdate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function SubmissionTable({ title, submissions, isLoading, onStatusUpdate }: {
    title: string;
    submissions: BrokerSubmission[];
    isLoading: boolean;
    onStatusUpdate: (id: string, status: 'verified' | 'rejected') => void;
}) {
    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    const statusConfig = {
        pending: { Icon: Clock, className: 'bg-orange-500/20 text-orange-400' },
        verified: { Icon: ShieldCheck, className: 'bg-green-500/20 text-green-400' },
        rejected: { Icon: ShieldX, className: 'bg-red-500/20 text-red-400' },
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No submissions found in this category.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Broker</TableHead>
                                <TableHead>Account #</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((sub) => {
                                const { Icon, className } = statusConfig[sub.status];
                                return (
                                    <TableRow key={sub.id}>
                                        <TableCell className="text-xs">{formatTimestamp(sub.submittedAt)}</TableCell>
                                        <TableCell className="text-xs">{sub.userEmail}</TableCell>
                                        <TableCell>{sub.brokerName}</TableCell>
                                        <TableCell className="font-mono">{sub.accountNumber}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={className}>
                                                <Icon className="mr-2 w-4 h-4"/>
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {sub.status !== 'verified' && (
                                                        <DropdownMenuItem onClick={() => onStatusUpdate(sub.id, 'verified')}>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Mark as Verified
                                                        </DropdownMenuItem>
                                                    )}
                                                    {sub.status !== 'rejected' && (
                                                        <DropdownMenuItem onClick={() => onStatusUpdate(sub.id, 'rejected')}>
                                                            <XCircle className="w-4 h-4 mr-2"/>
                                                            Mark as Rejected
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
