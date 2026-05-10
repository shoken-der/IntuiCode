'use server';
/**
 * @fileOverview A Genkit flow for simulating a viva interview.
 *
 * - simulateVivaInterview - A function that handles the viva interview process.
 * - VivaInterviewInput - The input type for the simulateVivaInterview function.
 * - VivaInterviewOutput - The return type for the simulateVivaInterview function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VivaInterviewInputSchema = z.object({
  problemStatement: z.string().describe('The original DSA problem statement.'),
  // Initial AI analysis can be provided for context, but is optional
  previousAiAnalysis: z.object({
    pattern: z.string().describe('The detected coding pattern, e.g., "Sliding Window".'),
    difficulty: z.string().describe('The problem difficulty, e.g., "Medium".'),
    whyPatternFits: z.string().describe('Explanation of why the pattern fits this problem.'),
    bruteForceThinking: z.string().optional().describe('Initial brute-force thoughts for the problem.'),
    optimizationHint: z.string().optional().describe('A hint towards optimization for the problem.'),
    edgeCases: z.array(z.string()).optional().describe('List of common edge cases for the problem.'),
  }).optional().describe('Optional previous AI analysis of the problem to provide context for the interviewer.'),
  latestUserAnswer: z.string().describe('The user\u0027s latest answer to the previous interview question or their initial solution summary.'),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      message: z.string(),
    })
  ).describe('The full conversation history (AI questions and user answers) leading up to the current turn.'),
});
export type VivaInterviewInput = z.infer<typeof VivaInterviewInputSchema>;

const VivaInterviewOutputSchema = z.object({
  question: z.string().describe('The AI interviewer\u0027s next challenging viva question, focusing on the user\u0027s understanding and solution.'),
  hint: z.string().optional().describe('An optional hint provided by the AI if requested or deemed helpful, to guide the user without giving away the solution.'),
});
export type VivaInterviewOutput = z.infer<typeof VivaInterviewOutputSchema>;

export async function simulateVivaInterview(input: VivaInterviewInput): Promise<VivaInterviewOutput> {
  return vivaInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'vivaInterviewPrompt',
  input: { schema: VivaInterviewInputSchema },
  output: { schema: VivaInterviewOutputSchema },
  prompt: `You are an AI technical interviewer for IntuiCode, specializing in Data Structures and Algorithms. Your goal is to simulate a viva interview based on the provided DSA problem, the user's latest answer, and the conversation history. Your questions should be challenging, adaptive, and designed to evaluate the user's understanding of their proposed solution's complexity (time and space), edge cases, potential optimizations, and alternative approaches.

Encourage deep thinking and clear technical communication. Do NOT give away the final solution or direct code. Your questions should guide the user towards better understanding and optimization, acting as a mentor and coach.

Here is the context for the interview:

Problem Statement:
\`\`\`
{{{problemStatement}}}
\`\`\`

{{#if previousAiAnalysis}}
Previous AI Analysis (for your internal context, do not directly reveal to the user unless it's critical for a teaching point):
Pattern: {{{previousAiAnalysis.pattern}}}
Difficulty: {{{previousAiAnalysis.difficulty}}}
Why Pattern Fits: {{{previousAiAnalysis.whyPatternFits}}}
{{#if previousAiAnalysis.bruteForceThinking}}
Brute Force Thinking: {{{previousAiAnalysis.bruteForceThinking}}}
{{/if}}
{{#if previousAiAnalysis.optimizationHint}}
Optimization Hint: {{{previousAiAnalysis.optimizationHint}}}
{{/if}}
{{#if previousAiAnalysis.edgeCases}}
Edge Cases: {{#each previousAiAnalysis.edgeCases}}- {{{this}}}
{{/each}}
{{/if}}
{{/if}}

Conversation History:
{{#each conversationHistory}}
{{this.role}}: {{this.message}}
{{/each}}
user: {{{latestUserAnswer}}}

Based on the above, especially considering the user's latest answer and the overall flow of the conversation, what is the NEXT challenging viva question you would ask? Focus on deepening their understanding of their proposed solution, guiding them towards improvements, or exploring related concepts.

Your response MUST be a JSON object conforming to the following structure:
{{jsonSchema output.schema}}`
});

const vivaInterviewFlow = ai.defineFlow(
  {
    name: 'vivaInterviewFlow',
    inputSchema: VivaInterviewInputSchema,
    outputSchema: VivaInterviewOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      throw new Error('AI did not return a valid viva interview question.');
    }
    return output;
  }
);
