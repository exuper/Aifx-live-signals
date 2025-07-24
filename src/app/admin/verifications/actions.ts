
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function updateVerificationStatus(submissionId: string, status: 'verified' | 'rejected') {
    if (!submissionId) throw new Error("Submission ID is required.");

    const validStatus = z.enum(['verified', 'rejected']).parse(status);

    try {
        const submissionRef = doc(db, "brokerSubmissions", submissionId);
        await updateDoc(submissionRef, { status: validStatus });
        return { success: true };
    } catch (error) {
        console.error("Error updating verification status:", error);
        throw new Error("Could not update verification status in the database.");
    }
}
