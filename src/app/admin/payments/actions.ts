
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function updatePaymentStatus(id: string, status: 'pending' | 'completed') {
    if (!id) {
        throw new Error("Payment ID is required.");
    }
    const validStatus = z.enum(['pending', 'completed']).parse(status);

    try {
        const paymentRef = doc(db, "payments", id);
        await updateDoc(paymentRef, {
            status: validStatus
        });
    } catch (error) {
        console.error("Error updating payment status:", error);
        throw new Error("Could not update payment status in the database.");
    }
}
