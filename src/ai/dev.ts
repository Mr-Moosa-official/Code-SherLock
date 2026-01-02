import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-code-for-issues.ts';
import '@/ai/flows/generate-improvement-suggestions.ts';
import '@/ai/flows/answer-codebase-questions.ts';