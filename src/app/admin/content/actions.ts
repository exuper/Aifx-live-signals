
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, writeBatch, addDoc } from 'firebase/firestore';

// Schema for a single community link when receiving data from the form
const communityLinkSchema = z.object({
  id: z.string(), // This can be a Firestore ID or a temporary 'new_' ID
  name: z.string().min(1, "Link name is required."),
  description: z.string().min(1, "Description is required."),
  url: z.string().url("Must be a valid URL."),
  cta: z.string().min(1, "CTA text is required."),
  icon: z.string().min(1, "Icon is required, e.g., 'MessageCircle' or 'Rss'"),
});

// The form schema is an array of links
const formSchema = z.object({
  links: z.array(communityLinkSchema),
});

export type CommunityLinkData = z.infer<typeof communityLinkSchema>;
export type CommunityLinksFormData = z.infer<typeof formSchema>;

const defaultLinks: Omit<CommunityLinkData, 'id'>[] = [
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

// Fetches the current community links from Firestore
export async function getCommunityLinks(): Promise<CommunityLinkData[]> {
  const linksCollectionRef = collection(db, 'communityLinks');
  const snapshot = await getDocs(linksCollectionRef);
  
  if (snapshot.empty) {
    // If no links exist, create the default ones and return them
    const batch = writeBatch(db);
    const createdLinks: CommunityLinkData[] = [];
    defaultLinks.forEach(linkData => {
        const newDocRef = doc(linksCollectionRef);
        batch.set(newDocRef, linkData);
        createdLinks.push({ id: newDocRef.id, ...linkData });
    });
    await batch.commit();
    return createdLinks;
  }

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as CommunityLinkData));

  // Sort to maintain a consistent order if needed, e.g., by name
  data.sort((a, b) => a.name.localeCompare(b.name));

  return data;
}

// Replaces all community links with the new set from the form
export async function updateCommunityLinks(data: CommunityLinksFormData) {
  const validatedData = formSchema.parse(data);

  try {
    const batch = writeBatch(db);
    const linksCollectionRef = collection(db, 'communityLinks');

    // 1. Get all existing links and delete them
    const existingLinksSnapshot = await getDocs(linksCollectionRef);
    existingLinksSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // 2. Add all links from the form as new documents
    validatedData.links.forEach(link => {
      const { id, ...linkData } = link; // Exclude the temporary ID from the data
      const newDocRef = doc(linksCollectionRef); // Create a new document reference with a new ID
      batch.set(newDocRef, linkData);
    });

    // 3. Commit the atomic operation
    await batch.commit();

  } catch (error) {
    console.error("Error updating community links:", error);
    throw new Error("Could not update links in the database.");
  }
}
