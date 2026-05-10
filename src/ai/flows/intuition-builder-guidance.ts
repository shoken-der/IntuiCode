'use server';
/**
 * @fileOverview An AI mentor that guides users step-by-step through DSA problems, asking adaptive questions and providing hints.
 *
 * - intuitionBuilderGuidance - A function that handles the AI mentor's guidance process.
 * - IntuitionBuilderGuidanceInput - The input type for the intuitionBuilderGuidance function.
 * - IntuitionBuilderGuidanceOutput - The return type for the intuitionBuilderGuidance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntuitionBuilderGuidanceInputSchema = z.object({
  problemStatement: z
    .string()
    .describe('The full problem statement for the Data Structures and Algorithms question.'),
  userCurrentSolutionOrThoughts: z
    .string()
    .describe(
      'The user\u2019s current thought process, partial code, or proposed solution. This helps the AI understand the user\u2019s current state.'
    ),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .optional()
    .describe('Optional: Previous turns of the conversation to maintain context and adapt guidance.'),
});
export type IntuitionBuilderGuidanceInput = z.infer<
  typeof IntuitionBuilderGuidanceInputSchema
>;

const IntuitionBuilderGuidanceOutputSchema = z.object({
  guidanceMessage: z
    .string()
    .describe('The AI mentor\u2019s guiding question, hint, or explanation.'),
  suggestedNextSteps: z
    .array(z.string())
    .describe('An array of suggested quick reply chips for the user.'),
});
export type IntuitionBuilderGuidanceOutput = z.infer<
  typeof IntuitionBuilderGuidanceOutputSchema
>;

export async function intuitionBuilderGuidance(
  input: IntuitionBuilderGuidanceInput
): Promise<IntuitionBuilderGuidanceOutput> {
  return intuitionBuilderGuidanceFlow(input);
}

const intuitionBuilderGuidancePrompt = ai.definePrompt({
  name: 'intuitionBuilderGuidancePrompt',
  input: { schema: IntuitionBuilderGuidanceInputSchema },
  output: { schema: IntuitionBuilderGuidanceOutputSchema },
  prompt: `You are IntuiCode, an expert senior engineering mentor specializing in Data Structures and Algorithms (DSA).
Your goal is to guide the user step-by-step to build their intuition and understanding of the problem and its solution.

Critically, DO NOT give away the direct solution. Instead, ask adaptive questions and provide subtle hints that encourage the user to think critically, optimize their solution, and discover the path themselves.

Consider the user's current thought process and the problem statement to formulate your response.
If there is conversation history, adapt your response based on the previous turns.

Problem Statement:
"""
{{{problemStatement}}}
"""

User's Current Thoughts/Solution:
"""
{{{userCurrentSolutionOrThoughts}}}
"""

Conversation History:
{{#if conversationHistory}}
{{#each conversationHistory}}
{{this.role}}: {{this.content}}
{{/each}}
{{else}}
No prior conversation.
{{/if}}

Your response should always be structured as a JSON object with two fields:
1.  'guidanceMessage': Your adaptive question, hint, or explanation.
2.  'suggestedNextSteps': An array of quick reply suggestions for the user to choose from. These should be relevant to the current stage of guidance.

Examples of guiding questions:
- "What brute force approach comes to your mind first for this problem?"
- "Thinking about time complexity, why might that brute force approach be inefficient?"
- "Can you identify any repeated work that could be avoided to improve efficiency?"
- "What data structure might help us manage elements more efficiently for this type of operation?"
- "Consider the constraints of the input. Do any edge cases immediately stand out?"
- "If we track a certain state, how does that change the problem's requirements?"

Examples of quick reply suggestions:
- "I think brute force works."
- "Give me a hint."
- "How can we optimize?"
- "Ask another question."
- "What about this approach...?"
- "Can you explain the current inefficiency?"
- "I'm stuck on edge cases."
- "What data structure should I consider?"

Now, provide your adaptive guidance and suggested next steps based on the above.
`,
});

const intuitionBuilderGuidanceFlow = ai.defineFlow(
  {
    name: 'intuitionBuilderGuidanceFlow',
    inputSchema: IntuitionBuilderGuidanceInputSchema,
    outputSchema: IntuitionBuilderGuidanceOutputSchema,
  },
  async (input) => {
    const { output } = await intuitionBuilderGuidancePrompt(input);
    if (!output) {
      throw new Error('Failed to get guidance from AI mentor.');
    }
    return output;
  }
);
