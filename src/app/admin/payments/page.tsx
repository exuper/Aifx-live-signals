
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckCircle, Clock } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Payment {
    id: string;
    userId: string;
    userEmail: string;
    serviceTitle: string;
    priceAmount: number;
    paymentMethod: string;
    status: 'pending' | 'completed';
    createdAt: Timestamp;
    receiptUrl?: string;
}

export default function ViewPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const paymentsData: Payment[] = [];
            querySnapshot.forEach((doc) => {
                paymentsData.push({ id: doc.id, ...doc.data() } as Payment);
            });
            setPayments(paymentsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching payments:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="View Payments"
                description="Review and manage user payment submissions."
            />
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">All Payments</CardTitle>
                    <CardDescription>
                        This is a log of all payment submissions from users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <DollarSign className="w-12 h-12 mx-auto mb-2" />
                            <p>No payment submissions yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Receipt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="text-xs">{formatTimestamp(payment.createdAt)}</TableCell>
                                        <TableCell>{payment.userEmail}</TableCell>
                                        <TableCell>{payment.serviceTitle}</TableCell>
                                        <TableCell className="font-mono">${payment.priceAmount}</TableCell>
                                        <TableCell>{payment.paymentMethod}</TableCell>
                                        <TableCell>
                                            <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {payment.receiptUrl ? (
                                                <Button asChild variant="link" size="sm">
                                                    <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">View</a>
                                                </Button>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
