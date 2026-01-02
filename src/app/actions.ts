
'use server';

import { z } from 'zod';
import { analyzeCodeForIssues, type AnalyzeCodeForIssuesOutput } from '@/ai/flows/analyze-code-for-issues';
import { generateImprovementSuggestions, type GenerateImprovementSuggestionsOutput } from '@/ai/flows/generate-improvement-suggestions';

const FormSchema = z.object({
  code: z.string().min(20, { message: "Please provide a code snippet of at least 20 characters." }),
  language: z.string({ required_error: "Please select a language."}).min(1, { message: "Please select a language." }),
  question: z.string().optional(),
});

export type CombinedAnalysis = AnalyzeCodeForIssuesOutput & {
  improvementSuggestions: GenerateImprovementSuggestionsOutput;
};

export interface AnalysisState {
  error?: string | null;
  analysis?: CombinedAnalysis | null;
  fieldErrors?: {
    code?: string[];
    language?: string[];
    question?: string[];
  } | null;
}

export async function performAnalysis(prevState: AnalysisState, formData: FormData): Promise<AnalysisState> {
  const validatedFields = FormSchema.safeParse({
    code: formData.get('code'),
    language: formData.get('language'),
    question: formData.get('question'),
  });

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      error: 'Invalid input provided. Please check the fields below.',
      analysis: null,
    };
  }

  const { code, language, question } = validatedFields.data;

  try {
    const [analysisResult, improvementResult] = await Promise.all([
      analyzeCodeForIssues({ code, language }),
      generateImprovementSuggestions({ code, language, question: question || undefined }),
    ]);

    const combinedResult: CombinedAnalysis = {
      ...analysisResult,
      improvementSuggestions: improvementResult,
    };

    return {
      analysis: combinedResult,
      error: null,
      fieldErrors: null,
    };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred while analyzing the code. Please try again later.',
      analysis: null,
      fieldErrors: null,
    };
  }
}
