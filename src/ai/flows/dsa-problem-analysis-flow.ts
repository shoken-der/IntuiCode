'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing Data Structures and Algorithms (DSA) problems.
 *
 * - dsaProblemAnalysis - A function that analyzes a given DSA problem.
 * - DsaProblemAnalysisInput - The input type for the dsaProblemAnalysis function.
 * - DsaProblemAnalysisOutput - The return type for the dsaProblemAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DsaProblemAnalysisInputSchema = z
  .object({
    problemStatement: z
      .string()
      .optional()
      .describe('The textual statement of the DSA problem.'),
    problemImageUrl: z
      .string()
      .optional()
      .describe(
        "An optional screenshot of the problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
    problemUrl: z
      .string()
      .optional()
      .describe('An optional URL to the DSA problem (e.g., LeetCode).'),
  })
  .refine(
    data =>
      data.problemStatement !== undefined ||
      data.problemImageUrl !== undefined ||
      data.problemUrl !== undefined,
    'At least one of problemStatement, problemImageUrl, or problemUrl must be provided.'
  );

export type DsaProblemAnalysisInput = z.infer<
  typeof DsaProblemAnalysisInputSchema
>;

const DsaProblemAnalysisOutputSchema = z.object({
  pattern: z
    .string()
    .describe('The core coding pattern detected (e.g., "Sliding Window", "Dynamic Programming").'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The estimated difficulty of the problem.'),
  whyPatternFits: z
    .string()
    .describe('A detailed explanation of why the detected pattern is suitable for this problem.'),
  bruteForceThinking: z
    .string()
    .describe('An initial thought process for a brute-force approach, if applicable.'),
  optimizationHint: z
    .string()
    .describe('A hint or direction for optimizing the brute-force solution towards the optimal pattern.'),
  edgeCases: z
    .array(z.string())
    .describe('A list of important edge cases to consider for the problem.'),
});

export type DsaProblemAnalysisOutput = z.infer<
  typeof DsaProblemAnalysisOutputSchema
>;

export async function dsaProblemAnalysis(
  input: DsaProblemAnalysisInput
): Promise<DsaProblemAnalysisOutput> {
  return dsaProblemAnalysisFlow(input);
}

const dsaProblemAnalysisPrompt = ai.definePrompt({
  name: 'dsaProblemAnalysisPrompt',
  input: {schema: DsaProblemAnalysisInputSchema},
  output: {schema: DsaProblemAnalysisOutputSchema},
  prompt: `You are an expert DSA mentor and interviewer named IntuiCode AI. Your task is to analyze the provided Data Structures and Algorithms problem, identify the core coding pattern, explain why this pattern is suitable, suggest initial brute-force thinking, guide towards optimization, and list common edge cases.

Your analysis should be comprehensive and act as a foundation for building intuition.

Analyze the following problem details. Prioritize understanding the core problem from the provided text, image, or URL. If multiple sources are provided, synthesize the information.

Problem Statement:
{{#if problemStatement}}
{{{problemStatement}}}
{{else}}
[No explicit problem statement text provided, please rely on image/URL if available.]
{{/if}}

{{#if problemUrl}}
Problem URL: {{{problemUrl}}}
{{/if}}

{{#if problemImageUrl}}
Problem Screenshot: {{media url=problemImageUrl}}
{{/if}}

Provide your analysis in the following JSON format. Ensure all fields are populated comprehensively, strictly adhering to the schema.
`,
});

const dsaProblemAnalysisFlow = ai.defineFlow(
  {
    name: 'dsaProblemAnalysisFlow',
    inputSchema: DsaProblemAnalysisInputSchema,
    outputSchema: DsaProblemAnalysisOutputSchema,
  },
  async input => {
    const {output} = await dsaProblemAnalysisPrompt(input);
    if (!output) {
      throw new Error('Failed to get an analysis from the AI.');
    }
    return output;
  }
);
