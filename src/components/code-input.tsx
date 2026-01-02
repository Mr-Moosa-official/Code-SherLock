'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';

interface CodeInputProps {
  action: (formData: FormData) => void;
  fieldErrors?: {
    code?: string[];
    language?: string[];
  } | null;
  isPending: boolean;
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full" size="lg">
      {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
      Analyze Code
    </Button>
  );
}

export function CodeInput({ action, fieldErrors, isPending }: CodeInputProps) {
  return (
    <Card className="sticky top-8 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Submit Your Code</CardTitle>
        <CardDescription>Paste your code, select the language, and let our AI assistant review it.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="font-semibold">Code Snippet</Label>
            <Textarea
              id="code"
              name="code"
              placeholder="function helloWorld() { console.log('Hello, World!'); }"
              className="min-h-[300px] font-code text-sm leading-relaxed rounded-xl"
              required
            />
            {fieldErrors?.code && <p className="text-sm font-medium text-destructive">{fieldErrors.code[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="font-semibold">Language</Label>
              <Select name="language" required>
                <SelectTrigger id="language" className="rounded-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors?.language && <p className="text-sm font-medium text-destructive">{fieldErrors.language[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="question" className="font-semibold">Ask a question (optional)</Label>
              <Input
                id="question"
                name="question"
                placeholder="e.g., How can I improve this?"
                className="rounded-full"
              />
            </div>
          </div>
          
          <SubmitButton isPending={isPending} />
        </form>
      </CardContent>
    </Card>
  );
}
