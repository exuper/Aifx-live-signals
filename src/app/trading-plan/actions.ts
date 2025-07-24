
'use server';

import { generateTradingPlan, GenerateTradingPlanInput, GenerateTradingPlanOutput } from "@/ai/flows/generate-trading-plan";
import { auth } from '@/lib/firebase';

export async function generateTradingPlanAction(
  input: GenerateTradingPlanInput
): Promise<GenerateTradingPlanOutput> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error("You must be logged in to generate a trading plan.");
  }
  
  try {
    const result = await generateTradingPlan(input);
    return result;
  } catch (error) {
    console.error("Error in generateTradingPlanAction:", error);
    throw new Error("Failed to generate the trading plan.");
  }
}
