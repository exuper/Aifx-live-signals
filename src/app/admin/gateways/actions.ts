
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const gatewayDetailSchema = z.object({
  label: z.string().min(1, "Label is required."),
  value: z.string().min(1, "Value is required."),
});

const gatewaySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  details: z.array(gatewayDetailSchema).min(1, "At least one detail field is required."),
});

const formSchema = z.object({
  crypto: z.array(gatewaySchema),
  transfer: z.array(gatewaySchema),
  mobile: z.array(gatewaySchema),
});

export type PaymentGatewaysData = z.infer<typeof formSchema>;

const defaultGateways: PaymentGatewaysData = {
    crypto: [
        { id: 'usdt', title: 'USDT (TRC20)', details: [{ label: 'USDT Address (TRC20)', value: 'Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }] },
        { id: 'btc', title: 'BTC', details: [{ label: 'BTC Address', value: 'bc1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }] },
    ],
    transfer: [
        { id: 'western', title: 'Western Union', details: [{ label: 'Recipient Name', value: 'Forex Signals Inc.' }, { label: 'Location', value: 'New York, USA' }] },
        { id: 'bank', title: 'Bank Transfer', details: [{ label: 'Bank Name', value: 'Global Trade Bank' }, { label: 'Account Number', value: '1234567890' }, { label: 'SWIFT/BIC', value: 'GTBIUS33' }] },
        { id: 'skrill', title: 'Skrill', details: [{ label: 'Skrill Email', value: 'payment@forexsignals.com' }] },
    ],
    mobile: [
        { id: 'tigo', title: 'Tigo/Yass', details: [{ label: 'Tigo/Yass Number', value: '+255 712 345 678' }] },
        { id: 'airtel', title: 'Airtel', details: [{ label: 'Airtel Number', value: '+255 789 012 345' }] },
        { id: 'mpesa', title: 'M-Pesa', details: [{ label: 'M-Pesa Number', value: '+255 756 789 012' }] },
    ]
}


export async function getPaymentGateways(): Promise<PaymentGatewaysData> {
  const docRef = doc(db, 'settings', 'paymentGateways');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const result = formSchema.safeParse(docSnap.data());
    if (result.success) {
        return result.data;
    }
  }
  // Initialize with default data if doc doesn't exist or is invalid
  await setDoc(docRef, defaultGateways);
  return defaultGateways;
}


export async function updatePaymentGateways(data: PaymentGatewaysData) {
  const validatedData = formSchema.parse(data);

  try {
    const docRef = doc(db, 'settings', 'paymentGateways');
    await setDoc(docRef, validatedData);
  } catch (error) {
    console.error("Error updating payment gateways:", error);
    throw new Error("Could not update gateways in the database.");
  }
}
