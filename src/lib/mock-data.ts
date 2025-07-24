
import type { Timestamp } from "firebase/firestore";

export type Signal = {
  id: string; // Changed to string to support Firestore document IDs
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  status: 'Active' | 'Expired';
  isPremium?: boolean;
  createdAt: Timestamp | Date;
};

export type CalendarEvent = {
  id: string;
  time: string;
  currency: string;
  impact: 'High' | 'Medium' | 'Low';
  event: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  date: Date;
};
