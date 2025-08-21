
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Trash2 } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { updatePaymentStatus, deletePayment } from './actions';
import { toast } from '@/hooks/use-toast';
import { MoreVertical } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Payment {
    id: string;
    userId: string;
    userEmail: string;
    serviceId: string;
    serviceTitle: string;
    priceAmount: number;
    paymentMethod: string;
    status: 'pending' | 'completed';
    createdAt: Timestamp;
    receiptUrl?: string;
    senderName?: string;
}

export default function ViewPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

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

    const handleStatusUpdate = async (paymentId: string, status: 'pending' | 'completed') => {
        try {
            await updatePaymentStatus(paymentId, status);
            toast({
                title: "Status Updated",
                description: `Payment has been marked as ${status}.`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update payment status.",
                variant: "destructive"
            });
        }
    };
    
    const handleDelete = async () => {
        if (!paymentToDelete) return;
        try {
            await deletePayment(paymentToDelete);
            toast({ title: "Payment Deleted", description: "The payment record has been removed." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete the payment.", variant: "destructive" });
        } finally {
            setPaymentToDelete(null);
        }
    };

    const pendingPayments = payments.filter(p => p.status === 'pending');
    const completedPayments = payments.filter(p => p.status === 'completed');

    return (
        <div className="space-y-8">
            <PageHeader
                title="View Payments"
                description="Review and manage user payment submissions."
            />
            
            <AlertDialog open={!!paymentToDelete} onOpenChange={() => setPaymentToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this payment record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <PaymentTable
                title="Pending Payments"
                payments={pendingPayments}
                isLoading={isLoading}
                onStatusUpdate={handleStatusUpdate}
                onDelete={(id) => setPaymentToDelete(id)}
            />
             <PaymentTable
                title="Completed Payments"
                payments={completedPayments}
                isLoading={isLoading}
                onStatusUpdate={handleStatusUpdate}
                onDelete={(id) => setPaymentToDelete(id)}
            />
        </div>
    );
}


function PaymentTable({ title, payments, isLoading, onStatusUpdate, onDelete }: {
    title: string;
    payments: Payment[];
    isLoading: boolean;
    onStatusUpdate: (paymentId: string, status: 'pending' | 'completed') => void;
    onDelete: (id: string) => void;
}) {
     const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <Card>
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
                ) : payments.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <DollarSign className="w-12 h-12 mx-auto mb-2" />
                        <p>No {title.toLowerCase()} found.</p>
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
                                 <TableHead>Sender Info</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="text-xs">{formatTimestamp(payment.createdAt)}</TableCell>
                                    <TableCell className="text-xs">{payment.userEmail}</TableCell>
                                    <TableCell>{payment.serviceTitle}</TableCell>
                                    <TableCell className="font-mono">${payment.priceAmount}</TableCell>
                                    <TableCell>{payment.paymentMethod}</TableCell>
                                    <TableCell className="text-xs">{payment.senderName || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className={payment.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}>
                                            {payment.status}
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
                                                {payment.receiptUrl && (
                                                    <DropdownMenuItem asChild>
                                                        <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">View Receipt</a>
                                                    </DropdownMenuItem>
                                                )}
                                                {payment.status === 'pending' && (
                                                    <DropdownMenuItem onClick={() => onStatusUpdate(payment.id, 'completed')}>
                                                        Mark as Completed
                                                    </DropdownMenuItem>
                                                )}
                                                {payment.status === 'completed' && (
                                                     <DropdownMenuItem onClick={() => onStatusUpdate(payment.id, 'pending')}>
                                                        Mark as Pending
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => onDelete(payment.id)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
