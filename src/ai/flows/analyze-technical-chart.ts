'use server';

/**
 * @fileOverview AI-powered technical chart analysis flow.
 *
 * - analyzeTechnicalChart - A function that analyzes technical analysis chart images and provides a summary.
 * - AnalyzeTechnicalChartInput - The input type for the analyzeTechnicalChart function.
 * - AnalyzeTechnicalChartOutput - The return type for the analyzeTechnicalChart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTechnicalChartInputSchema = z.object({
  chartDataUri: z
    .string()
    .describe(
      "A photo of a technical analysis chart, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeTechnicalChartInput = z.infer<typeof AnalyzeTechnicalChartInputSchema>;

const AnalyzeTechnicalChartOutputSchema = z.object({
  summary: z.string().describe('A summary of the key observations from the technical analysis chart.'),
  tradingSignals: z.string().describe('Potential trading signals derived from the chart analysis.'),
});
export type AnalyzeTechnicalChartOutput = z.infer<typeof AnalyzeTechnicalChartOutputSchema>;

export async function analyzeTechnicalChart(input: AnalyzeTechnicalChartInput): Promise<AnalyzeTechnicalChartOutput> {
  return analyzeTechnicalChartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTechnicalChartPrompt',
  input: {schema: AnalyzeTechnicalChartInputSchema},
  output: {schema: AnalyzeTechnicalChartOutputSchema},
  prompt: `You are an expert technical analyst specializing in financial markets.

You will analyze the provided technical analysis chart image and provide a summary of the key observations and potential trading signals.

Consider aspects like trend lines, support and resistance levels, chart patterns, and technical indicators.

Provide both a summary of the chart and specific trading signals that a user might take based on the analysis.

Chart Image: {{media url=chartDataUri}}`,
});

const analyzeTechnicalChartFlow = ai.defineFlow(
  {
    name: 'analyzeTechnicalChartFlow',
    inputSchema: AnalyzeTechnicalChartInputSchema,
    outputSchema: AnalyzeTechnicalChartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
