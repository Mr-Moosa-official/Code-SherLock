'use server';
/**
 * @fileOverview Analyzes code for common errors, security vulnerabilities, and code style violations.
 *
 * - analyzeCodeForIssues - A function that handles the code analysis process.
 * - AnalyzeCodeForIssuesInput - The input type for the analyzeCodeForIssues function.
 * - AnalyzeCodeForIssuesOutput - The return type for the analyzeCodeForIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeForIssuesInputSchema = z.object({
  code: z.string().describe('The code to analyze.'),
  language: z.string().describe('The programming language of the code.'),
});
export type AnalyzeCodeForIssuesInput = z.infer<
  typeof AnalyzeCodeForIssuesInputSchema
>;

const AnalyzeCodeForIssuesOutputSchema = z.object({
  errors: z.array(z.string()).describe('A list of errors found in the code.'),
  vulnerabilities: z
    .array(z.string())
    .describe('A list of security vulnerabilities found in the code.'),
  styleViolations: z
    .array(z.string())
    .describe('A list of code style violations found in the code.'),
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions for code improvement.'),
});
export type AnalyzeCodeForIssuesOutput = z.infer<
  typeof AnalyzeCodeForIssuesOutputSchema
>;

export async function analyzeCodeForIssues(
  input: AnalyzeCodeForIssuesInput
): Promise<AnalyzeCodeForIssuesOutput> {
  return analyzeCodeForIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCodeForIssuesPrompt',
  input: {schema: AnalyzeCodeForIssuesInputSchema},
  output: {schema: AnalyzeCodeForIssuesOutputSchema},
  prompt: `You are a code analysis expert. Analyze the following code for errors, security vulnerabilities, and code style violations. Provide suggestions for improvement.

Language: {{{language}}}
Code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Errors:
{{#each errors}}
- {{this}}
{{/each}}

Vulnerabilities:
{{#each vulnerabilities}}
- {{this}}
{{/each}}

Style Violations:
{{#each styleViolations}}
- {{this}}
{{/each}}

Suggestions:
{{#each suggestions}}
- {{this}}
{{/each}}
`,
});

const analyzeCodeForIssuesFlow = ai.defineFlow(
  {
    name: 'analyzeCodeForIssuesFlow',
    inputSchema: AnalyzeCodeForIssuesInputSchema,
    outputSchema: AnalyzeCodeForIssuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
