
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
import { handleSignUp, ensureUserDocument } from '../auth/actions';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.1v2.7h5.1c-.2 1.9-1.6 3.3-3.6 3.3-2.2 0-4-1.8-4-4s1.8-4 4-4c1 0 1.9.4 2.6 1.1l2.1-2.1C17.2 6.5 15 5.5 12.45 5.5c-3.8 0-7 3.1-7 7s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8.1-1.1-.3-1.6-.5-2.1z"></path></svg>
)

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
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
  
   const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Ensure a user document exists in Firestore for this user
      await ensureUserDocument(user.uid, user.email);

      toast({
        title: 'Sign Up Successful',
        description: "You're now logged in.",
      });
      router.replace('/');
    } catch (error: any) {
       let errorMessage = 'An unknown error occurred.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-up popup was closed. Please try again.';
      } else {
        errorMessage = error.message || 'Could not sign up with Google. Please try again.';
      }
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <AppLogo />
            </div>
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Choose your preferred method to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
                    {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                    Continue with Google
                </Button>
                
                <div className="flex items-center gap-4">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading || isGoogleLoading}
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
                        disabled={isLoading || isGoogleLoading}
                    />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Creating Account...' : 'Create Account with Email'}
                    </Button>
                </form>

                 <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </CardContent>
      </Card>
  );
}
