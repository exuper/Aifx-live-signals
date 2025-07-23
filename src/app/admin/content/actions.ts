
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';

// Schema for a single community link
const communityLinkSchema = z.object({
  name: z.string().min(1, "Link name is required."),
  description: z.string().min(1, "Description is required."),
  url: z.string().url("Must be a valid URL."),
  cta: z.string().min(1, "CTA text is required."),
});

// We expect an object where keys are the document IDs ('whatsapp_group', 'whatsapp_channel')
// and values match the communityLinkSchema.
const formSchema = z.object({
  whatsapp_group: communityLinkSchema,
  whatsapp_channel: communityLinkSchema,
});

export type CommunityLinksData = z.infer<typeof formSchema>;

// Fetches the current community links from Firestore
export async function getCommunityLinks(): Promise<CommunityLinksData> {
  const snapshot = await getDocs(collection(db, 'communityLinks'));
  
  const defaultData: CommunityLinksData = {
    whatsapp_group: {
        name: "WhatsApp Group",
        description: "Join our interactive community group to discuss strategies, share insights, and connect with other traders.",
        url: "https://chat.whatsapp.com/yourgroupinvite",
        cta: "Join Group"
    },
    whatsapp_channel: {
        name: "WhatsApp Channel",
        description: "Subscribe to our channel for important announcements, market updates, and exclusive content from our analysts.",
        url: "https://whatsapp.com/channel/yourchannelinvite",
        cta: "Subscribe to Channel"
    }
  };

  if (snapshot.empty) {
    // If the collection doesn't exist or is empty, save the default data.
    // This is a good way to initialize the content for the admin.
    const batch = writeBatch(db);
    Object.entries(defaultData).forEach(([id, data]) => {
        const docRef = doc(db, "communityLinks", id);
        batch.set(docRef, data);
    });
    await batch.commit();
    return defaultData;
  }

  const data = snapshot.docs.reduce((acc, doc) => {
    acc[doc.id as keyof CommunityLinksData] = doc.data() as any;
    return acc;
  }, {} as CommunityLinksData);

  return data;
}

// Updates the community links in Firestore
export async function updateCommunityLinks(data: CommunityLinksData) {
  const validatedData = formSchema.parse(data);

  try {
    // Use a batch write to update all documents atomically
    const batch = writeBatch(db);

    Object.entries(validatedData).forEach(([id, linkData]) => {
      const docRef = doc(db, 'communityLinks', id);
      batch.set(docRef, linkData, { merge: true }); // Use set with merge to be safe
    });

    await batch.commit();
  } catch (error) {
    console.error("Error updating community links:", error);
    throw new Error("Could not update links in the database.");
  }
}
