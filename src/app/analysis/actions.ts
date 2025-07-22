'use server';

import { analyzeTechnicalChart, AnalyzeTechnicalChartInput, AnalyzeTechnicalChartOutput } from "@/ai/flows/analyze-technical-chart";

export async function analyzeTechnicalChartAction(
  input: AnalyzeTechnicalChartInput
): Promise<AnalyzeTechnicalChartOutput> {
  // Here you could add user authentication checks
  // to ensure only authorized users can use this feature.
  
  try {
    const result = await analyzeTechnicalChart(input);
    return result;
  } catch (error) {
    console.error("Error in analyzeTechnicalChartAction:", error);
    // You might want to return a more structured error object
    throw new Error("Failed to analyze the technical chart.");
  }
}
