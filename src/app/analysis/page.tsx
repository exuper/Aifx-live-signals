
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeTechnicalChartAction } from './actions';
import { AnalyzeTechnicalChartOutput } from '@/ai/flows/analyze-technical-chart';
import { Loader2, UploadCloud, BotMessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [userCommand, setUserCommand] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeTechnicalChartOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysis(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setAnalysis(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload a chart image to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        const chartDataUri = event.target?.result as string;
        if (chartDataUri) {
          const result = await analyzeTechnicalChartAction({ chartDataUri, userCommand });
          setAnalysis(result);
        } else {
          throw new Error('Could not read file.');
        }
      };
      reader.onerror = (error) => {
        throw error;
      };
    } catch (error) {
      console.error(error);
      toast({
        title: 'Analysis Failed',
        description: 'An error occurred while analyzing the chart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Chart Analysis"
        description="Upload a technical analysis chart and get an instant AI-powered breakdown."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Upload & Command</CardTitle>
            <CardDescription>Drag & drop an image and provide an optional command.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-muted hover:border-primary transition-colors"
            >
              {filePreview ? (
                <Image src={filePreview} alt="Chart preview" width={300} height={200} className="object-contain h-full w-full p-2" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                </div>
              )}
              <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>

            <div className="space-y-2">
              <Label htmlFor="user-command">Command (Optional)</Label>
              <Textarea
                id="user-command"
                placeholder="e.g., 'Focus on the RSI and MACD indicators' or 'What is the current trend?'"
                value={userCommand}
                onChange={(e) => setUserCommand(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Analyzing...' : 'Analyze Chart'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Analyzing...</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-16">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                </CardContent>
            </Card>
          )}

          {analysis && (
            <>
              <Card className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="font-headline text-primary">Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{analysis.summary}</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="font-headline text-primary">Potential Trading Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{analysis.tradingSignals}</p>
                </CardContent>
              </Card>
            </>
          )}

          {!analysis && !isLoading && (
              <Card className="flex flex-col items-center justify-center h-full text-center border-dashed">
                  <CardContent className="p-10">
                      <BotMessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold font-headline">Awaiting Analysis</h3>
                      <p className="text-muted-foreground">Upload a chart and add a command to see the AI's insights here.</p>
                  </CardContent>
              </Card>
          )}
        </div>
      </div>
    </div>
  );
}
