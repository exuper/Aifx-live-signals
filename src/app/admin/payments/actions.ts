
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { add } from 'date-fns';

const serviceDurations: { [key: string]: Duration } = {
    premium_signals: { months: 1 },
    elite_premium: { years: 99 }, // Effectively lifetime
    premium_ea: { years: 99 },
    mentorship: { days: 45 } // Assuming mentorship access lasts for a period
};

export async function updatePaymentStatus(paymentId: string, userId: string, serviceId: string, status: 'pending' | 'completed') {
    if (!paymentId) throw new Error("Payment ID is required.");
    if (!userId) throw new Error("User ID is required.");
    if (!serviceId) throw new Error("Service ID is required.");

    const validStatus = z.enum(['pending', 'completed']).parse(status);

    try {
        const paymentRef = doc(db, "payments", paymentId);
        await updateDoc(paymentRef, { status: validStatus });

        // If payment is completed, update the user's subscription
        if (validStatus === 'completed') {
            const userRef = doc(db, "users", userId);
            const duration = serviceDurations[serviceId];
            if (!duration) {
                console.warn(`No subscription duration found for serviceId: ${serviceId}. Defaulting to lifetime.`);
            }
            const expiresAt = duration ? Timestamp.fromDate(add(new Date(), duration)) : Timestamp.fromDate(add(new Date(), { years: 99 }));
            
            const subscriptionField = `subscriptions.${serviceId}`;
            await updateDoc(userRef, {
                [subscriptionField]: {
                    status: 'active',
                    expiresAt: expiresAt,
                    startedAt: Timestamp.now(),
                }
            });
        }
    } catch (error) {
        console.error("Error updating payment status:", error);
        throw new Error("Could not update payment status in the database.");
    }
}
