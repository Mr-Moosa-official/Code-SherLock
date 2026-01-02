// Implemented the GenerateImprovementSuggestions flow to provide AI-powered code improvement suggestions.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI-powered suggestions for code improvement.
 *
 * The flow analyzes code for potential refactoring opportunities, performance enhancements, and readability improvements.
 * It leverages a combination of static analysis tools and AI to provide actionable suggestions to developers.
 *
 * @interface GenerateImprovementSuggestionsInput - The input schema for the generateImprovementSuggestions flow.
 * @interface GenerateImprovementSuggestionsOutput - The output schema for the generateImprovementSuggestions flow.
 * @function generateImprovementSuggestions - The main function to trigger the code improvement suggestions flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImprovementSuggestionsInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
  language: z.string().describe('The programming language of the code snippet.'),
  rules: z
    .array(z.string())
    .optional()
    .describe('An optional array of rules and style guides to follow.'),
  question: z.string().optional().describe('Optional question about the code.'),
});
export type GenerateImprovementSuggestionsInput = z.infer<
  typeof GenerateImprovementSuggestionsInputSchema
>;

const GenerateImprovementSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of AI-powered suggestions for code improvement.'),
  explanation: z.string().describe('An explanation of the suggestions provided.'),
});
export type GenerateImprovementSuggestionsOutput = z.infer<
  typeof GenerateImprovementSuggestionsOutputSchema
>;

export async function generateImprovementSuggestions(
  input: GenerateImprovementSuggestionsInput
): Promise<GenerateImprovementSuggestionsOutput> {
  return generateImprovementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImprovementSuggestionsPrompt',
  input: {schema: GenerateImprovementSuggestionsInputSchema},
  output: {schema: GenerateImprovementSuggestionsOutputSchema},
  prompt: `You are an AI-powered code reviewer. Analyze the following code snippet and provide suggestions for improvement.

Language: {{{language}}}

{{#if question}}
Question: {{{question}}}
{{/if}}

{{#if rules}}
Follow these rules and style guides:
{{#each rules}}
- {{{this}}}
{{/each}}
{{/if}}

Code:
\`\`\`{{language}}
{{{code}}}
\`\`\`

Provide suggestions for refactoring, performance enhancements, and readability improvements.
Include explanation for suggestions.
`, 
});

const generateImprovementSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateImprovementSuggestionsFlow',
    inputSchema: GenerateImprovementSuggestionsInputSchema,
    outputSchema: GenerateImprovementSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
