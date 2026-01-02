'use server';

/**
 * @fileOverview A flow that answers questions about a codebase in natural language.
 *
 * - answerCodebaseQuestion - A function that answers questions about a codebase.
 * - AnswerCodebaseQuestionInput - The input type for the answerCodebaseQuestion function.
 * - AnswerCodebaseQuestionOutput - The return type for the answerCodebaseQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerCodebaseQuestionInputSchema = z.object({
  codebase: z.string().describe('The codebase to ask questions about.'),
  question: z.string().describe('The question to ask about the codebase.'),
});

export type AnswerCodebaseQuestionInput = z.infer<
  typeof AnswerCodebaseQuestionInputSchema
>;

const AnswerCodebaseQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});

export type AnswerCodebaseQuestionOutput = z.infer<
  typeof AnswerCodebaseQuestionOutputSchema
>;

export async function answerCodebaseQuestion(
  input: AnswerCodebaseQuestionInput
): Promise<AnswerCodebaseQuestionOutput> {
  return answerCodebaseQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerCodebaseQuestionPrompt',
  input: {schema: AnswerCodebaseQuestionInputSchema},
  output: {schema: AnswerCodebaseQuestionOutputSchema},
  prompt: `You are an AI assistant helping a developer understand a codebase.

  Here is the codebase:
  {{codebase}}

  Answer the following question about the codebase:
  {{question}}`,
});

const answerCodebaseQuestionFlow = ai.defineFlow(
  {
    name: 'answerCodebaseQuestionFlow',
    inputSchema: AnswerCodebaseQuestionInputSchema,
    outputSchema: AnswerCodebaseQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
