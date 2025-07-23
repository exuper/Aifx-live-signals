
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { AppLogo } from '@/components/layout/app-logo';
import { handleSignUp } from '../auth/actions';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await handleSignUp({ email, password });

    if (result.success) {
      toast({
        title: 'Account Created',
        description: "You've been successfully signed up!",
      });
      router.replace('/');
    } else {
      let errorMessage = 'An unknown error occurred.';
      switch (result.error) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use by another account.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
            errorMessage = 'Password is too weak. It should be at least 6 characters long.';
            break;
        default:
          errorMessage = 'Sign up failed. Please try again.';
          break;
      }
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <AppLogo />
            </div>
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Enter your email and password to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Log in
                </Link>
            </p>
          </form>
        </CardContent>
      </Card>
  );
}
