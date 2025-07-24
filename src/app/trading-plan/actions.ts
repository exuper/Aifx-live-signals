
'use server';

import { generateTradingPlan, GenerateTradingPlanInput, GenerateTradingPlanOutput } from "@/ai/flows/generate-trading-plan";

export async function generateTradingPlanAction(
  input: GenerateTradingPlanInput
): Promise<GenerateTradingPlanOutput> {
  // The user authentication is handled by the layout.tsx,
  // which ensures only logged-in users can access this page and its actions.
  
  try {
    const result = await generateTradingPlan(input);
    return result;
  } catch (error) {
    console.error("Error in generateTradingPlanAction:", error);
    throw new Error("Failed to generate the trading plan.");
  }
}
