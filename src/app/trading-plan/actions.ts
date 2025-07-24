
'use server';

import { generateTradingPlan, GenerateTradingPlanInput, GenerateTradingPlanOutput } from "@/ai/flows/generate-trading-plan";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function generateTradingPlanAction(
  input: GenerateTradingPlanInput
): Promise<GenerateTradingPlanOutput> {
  try {
    const result = await generateTradingPlan(input);
    return result;
  } catch (error) {
    console.error("Error in generateTradingPlanAction:", error);
    throw new Error("Failed to generate the trading plan.");
  }
}

export async function getSavedTradingPlan(userId: string): Promise<GenerateTradingPlanOutput | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists() && userDoc.data().tradingPlan) {
      return userDoc.data().tradingPlan as GenerateTradingPlanOutput;
    }
    return null;
  } catch (error) {
    console.error("Error fetching saved trading plan:", error);
    return null; // Return null on error so the user can still generate a new plan
  }
}
