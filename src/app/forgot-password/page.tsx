
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck } from 'lucide-react';
import { AppLogo } from '@/components/layout/app-logo';
import { handlePasswordReset } from '../auth/actions';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const handleResetRequest = async (data: ResetFormData) => {
    setIsLoading(true);
    const result = await handlePasswordReset(data.email);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
            <AppLogo />
            </div>
            <CardTitle className="font-headline text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
            {isSubmitted 
                ? "Check your inbox for the reset link."
                : "Enter your email and we'll send you a link to reset your password."
            }
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isSubmitted ? (
                 <div className="text-center space-y-4">
                    <MailCheck className="w-16 h-16 text-green-500 mx-auto" />
                    <p className="text-muted-foreground">
                        If an account exists for this email, you will receive a password reset link shortly.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                 </div>
            ) : (
                <form onSubmit={handleSubmit(handleResetRequest)} className="space-y-6">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...register('email')}
                        disabled={isLoading}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Remember your password?{' '}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </form>
            )}
        </CardContent>
    </Card>
  );
}
