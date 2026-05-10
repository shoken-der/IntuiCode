'use server';
/**
 * @fileOverview A Genkit flow for generating a detailed feedback report after a user completes a problem-solving or interview session.
 *
 * - generateFeedbackReport - A function that handles the feedback report generation process.
 * - FeedbackReportInput - The input type for the generateFeedbackReport function.
 * - FeedbackReportOutput - The return type for the generateFeedbackReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FeedbackReportInputSchema = z.object({
  sessionType: z.enum(['DSA', 'Interview']).describe('Type of session: DSA problem-solving or Interview.'),
  problemStatement: z.string().describe('The problem statement the user attempted.'),
  difficulty: z.string().describe('The difficulty level of the problem (e.g., "Easy", "Medium", "Hard").'),
  userSolutionCode: z.string().optional().describe('The code submitted by the user for DSA problems.'),
  aiQuestionsAsked: z.array(z.string()).optional().describe('A list of questions asked by the AI during the session.'),
  userAnswersGiven: z.array(z.string()).optional().describe('A list of answers provided by the user to the AI questions.'),
});
export type FeedbackReportInput = z.infer<typeof FeedbackReportInputSchema>;

const FeedbackReportOutputSchema = z.object({
  overallScore: z.number().describe('An overall score for the session, from 1 to 100.'),
  technicalScore: z.number().describe('Score reflecting technical understanding and correctness, from 1 to 100.'),
  communicationScore: z.number().describe('Score reflecting clarity, conciseness, and articulation of ideas, from 1 to 100.'),
  optimizationScore: z.number().describe('Score reflecting ability to identify and apply optimizations, from 1 to 100.'),
  strengths: z.array(z.string()).describe('List of key strengths demonstrated by the user.'),
  weaknesses: z.array(z.string()).describe('List of areas where the user needs improvement.'),
  improvementRoadmap: z.array(z.string()).describe('Actionable steps and strategies for improvement.'),
  recommendedNextTopics: z.array(z.string()).describe('Specific topics or patterns recommended for further study.'),
});
export type FeedbackReportOutput = z.infer<typeof FeedbackReportOutputSchema>;

// Exported wrapper function
export async function generateFeedbackReport(input: FeedbackReportInput): Promise<FeedbackReportOutput> {
  return aiFeedbackReportGenerationFlow(input);
}

const feedbackReportPrompt = ai.definePrompt({
  name: 'feedbackReportPrompt',
  input: { schema: FeedbackReportInputSchema },
  output: { schema: FeedbackReportOutputSchema },
  prompt: `You are an expert technical interviewer, DSA coach, and AI mentor for "IntuiCode". Your goal is to provide a comprehensive, constructive, and highly detailed feedback report for a user's session.

The user completed a {{sessionType}} session for a {{difficulty}} problem.

Analyze the user's performance based on the provided information and generate a detailed feedback report focusing on:
- Technical understanding
- Communication skills
- Optimization thinking
- Strengths and weaknesses
- A clear improvement roadmap
- Recommended next topics for study.

Provide scores out of 100 for each category.

---
Problem Statement:
{{{problemStatement}}}

{{#if userSolutionCode}}
User's Solution Code:
    \`\`\`
{{{userSolutionCode}}}
    \`\`\`
{{/if}}

{{#if aiQuestionsAsked}}
AI Questions Asked:
{{#each aiQuestionsAsked}}- {{{this}}}
{{/each}}
{{/if}}

{{#if userAnswersGiven}}
User's Answers:
{{#each userAnswersGiven}}- {{{this}}}
{{/each}}
{{/if}}

---

Based on the above, provide the feedback report in the specified JSON format.
`,
});

const aiFeedbackReportGenerationFlow = ai.defineFlow(
  {
    name: 'aiFeedbackReportGenerationFlow',
    inputSchema: FeedbackReportInputSchema,
    outputSchema: FeedbackReportOutputSchema,
  },
  async (input) => {
    const { output } = await feedbackReportPrompt(input);
    return output!;
  }
);
