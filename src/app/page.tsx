git init
git remote add origin https://github.com/Mr-Moosa-official/Code-SherLock.git
git add .
git commit -m "Brand polish and footer signature update"
git push -u origin main'use client';

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
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
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

      <footer className="border-t border-border/60 bg-background/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-medium">2026 DesignHub. All rights reserved.</p>

          <div className="inline-flex items-center gap-3 self-start rounded-full border border-border bg-card px-3 py-2 shadow-sm md:self-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-black text-white">
              M
            </div>
            <span className="text-sm font-semibold text-foreground">made by Mr Moosa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
