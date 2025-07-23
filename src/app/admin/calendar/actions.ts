
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

const eventSchema = z.object({
  date: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  currency: z.string().min(3).toUpperCase(),
  impact: z.enum(['High', 'Medium', 'Low']),
  event: z.string().min(1),
  actual: z.string().optional(),
  forecast: z.string().optional(),
  previous: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export async function createCalendarEvent(data: EventFormData) {
  const validatedData = eventSchema.parse(data);
  try {
    await addDoc(collection(db, 'calendarEvents'), {
      ...validatedData,
      date: Timestamp.fromDate(validatedData.date),
    });
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Could not create event in the database.");
  }
}

export async function updateCalendarEvent(id: string, data: EventFormData) {
  if (!id) {
    throw new Error("Event ID is required.");
  }
  const validatedData = eventSchema.parse(data);

  try {
    const eventRef = doc(db, "calendarEvents", id);
    await updateDoc(eventRef, {
      ...validatedData,
      date: Timestamp.fromDate(validatedData.date),
    });
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Could not update event in the database.");
  }
}

export async function deleteCalendarEvent(id: string) {
  if (!id) {
    throw new Error("Event ID is required.");
  }
  try {
    await deleteDoc(doc(db, "calendarEvents", id));
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Could not delete event from the database.");
  }
}
