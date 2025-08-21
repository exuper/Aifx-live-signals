
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function updatePaymentStatus(paymentId: string, status: 'pending' | 'completed') {
    if (!paymentId) throw new Error("Payment ID is required.");

    const validStatus = z.enum(['pending', 'completed']).parse(status);

    try {
        const paymentRef = doc(db, "payments", paymentId);
        await updateDoc(paymentRef, { status: validStatus });

    } catch (error) {
        console.error("Error updating payment status:", error);
        throw new Error("Could not update payment status in the database.");
    }
}


export async function deletePayment(paymentId: string) {
    if (!paymentId) {
        throw new Error("Payment ID is required.");
    }
    try {
        await deleteDoc(doc(db, "payments", paymentId));
    } catch (error) {
        console.error("Error deleting payment:", error);
        throw new Error("Could not delete payment from the database.");
    }
}
