import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bug, Lightbulb, ShieldAlert, FileCode2 } from "lucide-react";
import type { CombinedAnalysis } from "@/app/actions";
import { ScrollArea } from "./ui/scroll-area";

const categoryIcons: { [key: string]: React.ReactNode } = {
  errors: <Bug className="h-4 w-4" />,
  vulnerabilities: <ShieldAlert className="h-4 w-4" />,
  styleViolations: <AlertTriangle className="h-4 w-4" />,
  suggestions: <Lightbulb className="h-4 w-4" />,
};

const categoryColors: { [key: string]: string } = {
  errors: "bg-red-500 hover:bg-red-600",
  vulnerabilities: "bg-orange-500 hover:bg-orange-600",
  styleViolations: "bg-blue-500 hover:bg-blue-500",
  suggestions: "bg-green-500 hover:bg-green-600",
};

const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2 p-4 border rounded-md">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-2 p-4 border rounded-md">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </CardContent>
  </Card>
);

const InitialState = () => (
  <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[500px] border-dashed shadow-none">
    <div className="p-4 bg-primary/10 rounded-full mb-4">
      <FileCode2 className="h-12 w-12 text-primary" />
    </div>
    <CardTitle className="font-headline text-2xl mb-2">Ready for Review</CardTitle>
    <CardDescription className="max-w-sm">
      Paste your code on the left, select the language, and our AI will provide a detailed analysis and suggestions for improvement.
    </CardDescription>
  </Card>
);

const AnalysisItem = ({ text }: { text: string }) => {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-sm text-foreground/90 py-2">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```/g, '').trim();
          return (
            <pre key={index}>
              <code>{code}</code>
            </pre>
          );
        }
        return <p key={index} className="whitespace-pre-wrap">{part}</p>;
      })}
    </div>
  );
};

interface AnalysisCategoryProps {
  title: string;
  items: string[];
  categoryKey: string;
}

const AnalysisCategory = ({ title, items, categoryKey }: AnalysisCategoryProps) => {
  if (items.length === 0) return null;

  return (
    <AccordionItem value={categoryKey}>
      <AccordionTrigger className="text-base font-semibold hover:no-underline">
        <div className="flex items-center gap-3">
          {categoryIcons[categoryKey]}
          <span>{title}</span>
          <Badge variant="secondary" className={cn("text-white", categoryColors[categoryKey])}>
            {items.length}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 divide-y">
          {items.map((item, index) => (
            <AnalysisItem key={index} text={item} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};


export function AnalysisView({ analysis, isPending }: { analysis: CombinedAnalysis | null, isPending: boolean }) {
  if (isPending) {
    return <LoadingSkeleton />;
  }

  if (!analysis) {
    return <InitialState />;
  }

  const { errors, vulnerabilities, styleViolations, suggestions, improvementSuggestions } = analysis;

  const categories = [
    { title: "Errors", items: errors, key: "errors" },
    { title: "Vulnerabilities", items: vulnerabilities, key: "vulnerabilities" },
    { title: "Style Violations", items: styleViolations, key: "styleViolations" },
    { title: "Suggestions", items: suggestions, key: "suggestions" },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Analysis Report</CardTitle>
        <CardDescription>Review the AI-generated feedback for your code.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="review">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="review">Automated Review</TabsTrigger>
            <TabsTrigger value="improvements">AI Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="review">
            <ScrollArea className="h-[500px] pr-4">
              <Accordion type="multiple" defaultValue={["errors", "vulnerabilities"]}>
                {categories.map(cat => (
                  <AnalysisCategory key={cat.key} title={cat.title} items={cat.items} categoryKey={cat.key} />
                ))}
              </Accordion>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="improvements">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Explanation</h3>
                  <p className="text-sm text-muted-foreground">{improvementSuggestions.explanation}</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Suggestions for Improvement</h3>
                  <div className="space-y-2 divide-y">
                    {improvementSuggestions.suggestions.map((item, index) => (
                      <AnalysisItem key={index} text={item} />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
