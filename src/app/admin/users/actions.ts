'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';

export interface UserData {
  id: string;
  email: string;
  createdAt?: string; // ISO string
  lastSeen?: string; // ISO string
}

// Convert Firestore Timestamps to serializable strings
const toSerializableObject = (docData: any) => {
  const data = { ...docData };
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate().toISOString();
    }
  }
  return data;
};


export async function getUsers(): Promise<UserData[]> {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...toSerializableObject(doc.data()),
    })) as UserData[];
    
    return users;

  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Could not fetch users from the database.");
  }
}
