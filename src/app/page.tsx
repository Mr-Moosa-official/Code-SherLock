'use client';

import { useEffect, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { performAnalysis, type AnalysisState } from '@/app/actions';
import { AppHeader } from '@/components/app-header';
import { CodeInput } from '@/components/code-input';
import { AnalysisView } from '@/components/analysis-view';

const initialState: AnalysisState = {
  error: null,
  analysis: null,
  fieldErrors: null,
};

export default function Home() {
  const [state, formAction] = useFormState(performAnalysis, initialState);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFormAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <CodeInput
            action={handleFormAction}
            fieldErrors={state.fieldErrors}
            isPending={isPending}
          />
          <AnalysisView
            analysis={state.analysis}
            isPending={isPending}
          />
        </div>
      </main>
    </div>
  );
}
