
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, writeBatch, addDoc, deleteDoc } from 'firebase/firestore';

// Schema for a single community link, now including an ID
const communityLinkSchema = z.object({
  id: z.string(), // Firestore document ID
  name: z.string().min(1, "Link name is required."),
  description: z.string().min(1, "Description is required."),
  url: z.string().url("Must be a valid URL."),
  cta: z.string().min(1, "CTA text is required."),
  icon: z.string().min(1, "Icon is required, e.g., 'MessageCircle' or 'Rss'"),
});

// The form now deals with an array of links
const formSchema = z.object({
  links: z.array(communityLinkSchema),
});

export type CommunityLinkData = z.infer<typeof communityLinkSchema>;
export type CommunityLinksFormData = z.infer<typeof formSchema>;

// Fetches the current community links from Firestore
export async function getCommunityLinks(): Promise<CommunityLinkData[]> {
  const snapshot = await getDocs(collection(db, 'communityLinks'));
  
  const defaultData: Omit<CommunityLinkData, 'id'>[] = [
    {
        name: "WhatsApp Group",
        description: "Join our interactive community group to discuss strategies, share insights, and connect with other traders.",
        url: "https://chat.whatsapp.com/yourgroupinvite",
        cta: "Join Group",
        icon: "MessageCircle"
    },
    {
        name: "WhatsApp Channel",
        description: "Subscribe to our channel for important announcements, market updates, and exclusive content from our analysts.",
        url: "https://whatsapp.com/channel/yourchannelinvite",
        cta: "Subscribe to Channel",
        icon: "Rss"
    }
  ];

  if (snapshot.empty) {
    // If the collection doesn't exist or is empty, save the default data.
    const batch = writeBatch(db);
    const createdDocs: CommunityLinkData[] = [];
    for (const link of defaultData) {
        const docRef = doc(collection(db, "communityLinks"));
        batch.set(docRef, link);
        createdDocs.push({ id: docRef.id, ...link });
    }
    await batch.commit();
    return createdDocs;
  }

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as CommunityLinkData));

  // Sort to maintain a consistent order if needed
  data.sort((a, b) => a.name.localeCompare(b.name));

  return data;
}

// Updates the community links in Firestore
export async function updateCommunityLinks(data: CommunityLinksFormData) {
  const validatedData = formSchema.parse(data);

  try {
    const batch = writeBatch(db);
    
    // Get current links from DB to find out which ones to delete
    const existingLinksSnapshot = await getDocs(collection(db, 'communityLinks'));
    const existingIds = existingLinksSnapshot.docs.map(d => d.id);
    const newIds = validatedData.links.map(l => l.id.startsWith('new_') ? '' : l.id).filter(Boolean);

    // Delete links that are no longer in the form data
    for (const id of existingIds) {
        if (!newIds.includes(id)) {
            batch.delete(doc(db, 'communityLinks', id));
        }
    }

    // Add or update links from the form data
    for (const link of validatedData.links) {
        const { id, ...linkData } = link;
        if (id.startsWith('new_')) {
            // This is a new link, create a new document
            const newDocRef = doc(collection(db, 'communityLinks'));
            batch.set(newDocRef, linkData);
        } else {
            // This is an existing link, update it
            const docRef = doc(db, 'communityLinks', id);
            batch.set(docRef, linkData, { merge: true });
        }
    }

    await batch.commit();
  } catch (error) {
    console.error("Error updating community links:", error);
    throw new Error("Could not update links in the database.");
  }
}
