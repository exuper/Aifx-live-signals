
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateTradingPlanAction, getSavedTradingPlan } from './actions';
import { GenerateTradingPlanOutput } from '@/ai/flows/generate-trading-plan';
import { Loader2, BotMessageSquare, Sparkles, Shield, Target, BrainCircuit, FilePlus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

const tradingPlanSchema = z.object({
  riskTolerance: z.enum(['Low', 'Medium', 'High'], { required_error: "Risk tolerance is required." }),
  capital: z.coerce.number().min(100, "Capital must be at least $100."),
  experience: z.enum(['Beginner', 'Intermediate', 'Advanced'], { required_error: "Experience level is required." }),
  goals: z.string().min(10, "Please describe your goals in at least 10 characters.").max(500),
});

type TradingPlanFormData = z.infer<typeof tradingPlanSchema>;

const PlanDisplayCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <Card className="bg-secondary/50">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="p-3 rounded-full bg-primary/20">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-headline text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">{children}</div>
      </CardContent>
  </Card>
);

const PlanSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
    </div>
);

export default function TradingPlanPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<GenerateTradingPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors } } = useForm<TradingPlanFormData>({
    resolver: zodResolver(tradingPlanSchema),
  });

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getSavedTradingPlan(user.uid)
        .then(savedPlan => {
          if (savedPlan) {
            setPlan(savedPlan);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  const onSubmit = async (data: TradingPlanFormData) => {
    if (!user) return;
    setIsGenerating(true);
    setPlan(null);
    try {
      const result = await generateTradingPlanAction({ ...data, userId: user.uid });
      setPlan(result);
      toast({ title: "Your Plan is Ready!", description: "The AI has generated your personalized trading plan." });
    } catch (error) {
      toast({
        title: 'Failed to Generate Plan',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const showForm = () => {
    setPlan(null);
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Trading Plan Generator"
        description="Answer a few questions to get a personalized trading plan crafted by AI."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        {!plan && !isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Your Trading Profile</CardTitle>
              <CardDescription>Fill out your details below to generate your plan.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Risk Tolerance</Label>
                          <Controller
                              name="riskTolerance"
                              control={control}
                              render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                  <SelectValue placeholder="Select your risk level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                  </SelectContent>
                              </Select>
                              )}
                          />
                           {errors.riskTolerance && <p className="text-red-500 text-xs">{errors.riskTolerance.message as string}</p>}
                      </div>
                       <div className="space-y-2">
                          <Label>Trading Experience</Label>
                          <Controller
                              name="experience"
                              control={control}
                              render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                  <SelectValue placeholder="Select your experience" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  <SelectItem value="Beginner">Beginner (0-1 years)</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate (1-3 years)</SelectItem>
                                  <SelectItem value="Advanced">Advanced (3+ years)</SelectItem>
                                  </SelectContent>
                              </Select>
                              )}
                          />
                          {errors.experience && <p className="text-red-500 text-xs">{errors.experience.message as string}</p>}
                      </div>
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="capital">Starting Capital ($)</Label>
                      <Input id="capital" type="number" {...register('capital')} placeholder="e.g., 1000" />
                      {errors.capital && <p className="text-red-500 text-xs">{errors.capital.message as string}</p>}
                  </div>
                  
                   <div className="space-y-2">
                      <Label htmlFor="goals">Trading Goals</Label>
                      <Textarea id="goals" {...register('goals')} placeholder="e.g., I want to grow my account by 10% per month..." />
                      {errors.goals && <p className="text-red-500 text-xs">{errors.goals.message as string}</p>}
                  </div>
                
                <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isGenerating ? 'Generating Plan...' : 'Generate My AI Plan'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Your Current Plan</CardTitle>
                        <CardDescription>This is your most recently generated trading plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={showForm} className="w-full">
                            <FilePlus className="mr-2"/>
                            Generate New Plan
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}

        <div className="space-y-8">
            {isLoading || isGenerating ? (
                 <PlanSkeleton />
            ) : plan ? (
                <>
                    <PlanDisplayCard icon={Sparkles} title="Plan Summary">
                        {plan.planSummary}
                    </PlanDisplayCard>

                    <PlanDisplayCard icon={Shield} title="Risk Management">
                        <p><strong>Max Position Size:</strong> {plan.riskManagement.maxPositionSize}</p>
                        <p><strong>Max Daily Loss:</strong> {plan.riskManagement.maxDailyLoss}</p>
                        <p><strong>Stop Loss Strategy:</strong> {plan.riskManagement.stopLossStrategy}</p>
                    </PlanDisplayCard>

                     <PlanDisplayCard icon={Target} title="Trade Execution">
                        <p><strong>Entry Conditions:</strong> {plan.tradeExecution.entryConditions}</p>
                        <p><strong>Exit Conditions:</strong> {plan.tradeExecution.exitConditions}</p>
                        <p><strong>Recommended Pairs:</strong> {plan.tradeExecution.recommendedPairs}</p>
                    </PlanDisplayCard>

                    <PlanDisplayCard icon={BrainCircuit} title="Trading Psychology">
                       {plan.psychology}
                    </PlanDisplayCard>
                </>
            ) : (
              <Card className="flex flex-col items-center justify-center h-full text-center border-dashed lg:min-h-[600px]">
                  <CardContent className="p-10">
                      <BotMessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold font-headline">Your Plan Awaits</h3>
                      <p className="text-muted-foreground">Fill out the form to see your personalized AI-generated trading plan.</p>
                  </CardContent>
              </Card>
          )}
        </div>
      </div>
    </div>
  );
}
