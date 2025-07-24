
'use server';

/**
 * @fileOverview An AI-powered trading plan generator that saves the result to the user's profile.
 *
 * - generateTradingPlan - A function that creates a personalized trading plan based on user inputs and saves it.
 * - GenerateTradingPlanInput - The input type for the generateTradingPlan function.
 * - GenerateTradingPlanOutput - The return type for the generateTradingPlan function.
 */

import {ai} from '@/ai/genkit';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import {z} from 'genkit';

const GenerateTradingPlanInputSchema = z.object({
  userId: z.string(), // Added to know which user to save the plan for
  riskTolerance: z.enum(['Low', 'Medium', 'High']),
  capital: z.coerce.number().positive(),
  experience: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  goals: z.string().min(10),
});
export type GenerateTradingPlanInput = z.infer<typeof GenerateTradingPlanInputSchema>;

const GenerateTradingPlanOutputSchema = z.object({
  planSummary: z.string().describe('A brief summary of the overall trading strategy.'),
  riskManagement: z.object({
    maxPositionSize: z.string().describe('Recommended maximum position size per trade as a percentage of capital.'),
    maxDailyLoss: z.string().describe('Recommended maximum daily loss limit as a percentage of capital.'),
    stopLossStrategy: z.string().describe('A clear strategy for setting stop-loss orders.'),
  }),
  tradeExecution: z.object({
    entryConditions: z.string().describe('Specific technical or fundamental conditions for entering a trade.'),
    exitConditions: z.string().describe('Specific conditions for exiting a trade, both for profit and loss.'),
    recommendedPairs: z.string().describe('Forex pairs that align with the described strategy.'),
  }),
  psychology: z.string().describe('Advice on maintaining discipline and managing emotions while trading.'),
});
export type GenerateTradingPlanOutput = z.infer<typeof GenerateTradingPlanOutputSchema>;

export async function generateTradingPlan(input: GenerateTradingPlanInput): Promise<GenerateTradingPlanOutput> {
  const plan = await generateTradingPlanFlow(input);
  
  // Save the generated plan to the user's document in Firestore
  try {
    const userRef = doc(db, 'users', input.userId);
    await updateDoc(userRef, {
      tradingPlan: {
        ...plan,
        generatedAt: new Date(), // Save generation timestamp
      },
    });
  } catch (error) {
    console.error("Error saving trading plan to user profile:", error);
    // We don't throw here, as returning the plan to the user is the primary goal.
  }
  
  return plan;
}

const prompt = ai.definePrompt({
  name: 'generateTradingPlanPrompt',
  input: {schema: GenerateTradingPlanInputSchema},
  output: {schema: GenerateTradingPlanOutputSchema},
  prompt: `You are an expert financial advisor and trading mentor. Your task is to generate a personalized trading plan for a user based on their profile.

The plan must be practical, actionable, and tailored to the user's specific inputs.

User Profile:
- Trading Experience: {{{experience}}}
- Risk Tolerance: {{{riskTolerance}}}
- Starting Capital: \${{{capital}}}
- Financial Goals: {{{goals}}}

Based on this profile, generate a comprehensive trading plan with the following sections:
1.  **Plan Summary**: A brief overview of the proposed strategy.
2.  **Risk Management**: Define clear rules for capital protection. Calculate max position size and daily loss limits based on their capital and risk tolerance. Provide a specific stop-loss strategy.
3.  **Trade Execution**: Detail the conditions for entering and exiting trades. Suggest suitable currency pairs.
4.  **Trading Psychology**: Offer advice on discipline, patience, and emotional control.

The output must be in the structured format defined. The tone should be professional, encouraging, and clear.`,
});

const generateTradingPlanFlow = ai.defineFlow(
  {
    name: 'generateTradingPlanFlow',
    inputSchema: GenerateTradingPlanInputSchema,
    outputSchema: GenerateTradingPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
