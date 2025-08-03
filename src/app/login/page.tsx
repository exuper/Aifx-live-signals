
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { AppLogo } from '@/components/layout/app-logo';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';
import { ensureUserDocument } from '../auth/actions';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.1v2.7h5.1c-.2 1.9-1.6 3.3-3.6 3.3-2.2 0-4-1.8-4-4s1.8-4 4-4c1 0 1.9.4 2.6 1.1l2.1-2.1C17.2 6.5 15 5.5 12.45 5.5c-3.8 0-7 3.1-7 7s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8.1-1.1-.3-1.6-.5-2.1z"></path></svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful',
        description: "You're now logged in.",
      });
      const redirectUrl = searchParams.get('redirect') || '/';
      router.replace(redirectUrl);
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          errorMessage = 'Login failed. Please try again.';
          break;
      }
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Ensure a user document exists in Firestore for this user
      await ensureUserDocument(user.uid, user.email);

      toast({
        title: 'Login Successful',
        description: "You're now logged in.",
      });
      const redirectUrl = searchParams.get('redirect') || '/';
      router.replace(redirectUrl);
    } catch (error: any) {
       let errorMessage = 'An unknown error occurred.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else {
        errorMessage = error.message || 'Could not sign in with Google. Please try again.';
      }
      toast({
        title: 'Login Failed',
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
        <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
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

            <form onSubmit={handleLogin} className="space-y-6">
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
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                        Forgot Password?
                    </Link>
                </div>
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
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="font-medium text-primary hover:underline">
                      Sign up
                  </Link>
              </p>
            </form>
        </div>
      </CardContent>
    </Card>
  );
}
