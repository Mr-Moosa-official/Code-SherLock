'use client';

import { useEffect, useTransition } from 'react';
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
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />

      <main className="mx-auto flex-1 w-full max-w-7xl p-4 md:p-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <CodeInput
            action={handleFormAction}
            fieldErrors={state.fieldErrors}
            isPending={isPending}
          />
          <AnalysisView analysis={state.analysis} isPending={isPending} />
        </div>
      </main>

      <footer className="border-t border-border/60 bg-background/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-medium">2026 DesignHub. All rights reserved.</p>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <a
              href="https://github.com/Mr-Moosa-official"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 self-start rounded-full border border-border bg-card px-3 py-2 shadow-sm transition hover:scale-[1.01] md:self-auto"
            >
              <img
                src="/mr-moosa-logo.svg"
                alt="Mr Moosa official logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-foreground">made by Mr Moosa</span>
            </a>

            <a
              href="mailto:mr.moosa.13@gmail.com"
              className="text-xs font-semibold text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              mr.moosa.13@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
