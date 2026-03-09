'use client';

import React, { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginContent() {
  const { signIn, signUp, signInWithGoogle, user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check if we're coming back from a redirect
  React.useEffect(() => {
    const checkRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authInProgress = localStorage.getItem('daypilot-auth-in-progress');
      
      if (urlParams.get('redirect') === 'google' || authInProgress) {
        setIsRedirecting(true);
        setIsAuthenticating(true);
        
        // Set a timeout to clear the flag if authentication takes too long
        const timeout = setTimeout(() => {
          console.log('Authentication timeout - clearing flags');
          localStorage.removeItem('daypilot-auth-in-progress');
          setIsRedirecting(false);
          setIsAuthenticating(false);
          toast({
            variant: "destructive",
            title: "Authentication timeout",
            description: "Please try signing in again"
          });
        }, 10000); // 10 second timeout
        
        // Clear timeout if component unmounts
        return () => clearTimeout(timeout);
      }
    };
    checkRedirect();
  }, [toast]);

  // Check if user has seen welcome page (only for direct visits, not after auth)
  React.useEffect(() => {
    // Only check welcome if:
    // 1. Not currently authenticating
    // 2. No auth in progress flag
    // 3. Not coming from a redirect
    const authInProgress = localStorage.getItem('daypilot-auth-in-progress');
    const urlParams = new URLSearchParams(window.location.search);
    const isFromRedirect = urlParams.get('redirect') === 'google';
    
    if (!isAuthenticating && !authInProgress && !isFromRedirect && !authLoading && !user) {
      const hasSeenWelcome = localStorage.getItem('daypilot-welcome-seen');
      if (!hasSeenWelcome) {
        router.push('/welcome');
      }
    }
  }, [isAuthenticating, authLoading, user, router]);

  // Clear auth flag when user is successfully logged in
  React.useEffect(() => {
    if (user) {
      localStorage.removeItem('daypilot-auth-in-progress');
      setIsAuthenticating(false);
      setIsRedirecting(false);
    }
  }, [user]);

  // Mark as authenticating when auth is loading
  React.useEffect(() => {
    if (authLoading) {
      setIsAuthenticating(true);
    } else {
      // Small delay to ensure user state is fully updated
      setTimeout(() => setIsAuthenticating(false), 500);
    }
  }, [authLoading]);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        if (!displayName.trim()) {
          toast({ 
            variant: "destructive", 
            title: "Name required", 
            description: "Please enter your name" 
          });
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName);
        toast({ title: "Account created!", description: "Welcome to DayPilot." });
      } else {
        await signIn(email, password);
        toast({ title: "Logged in successfully" });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Authentication Error", 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setIsAuthenticating(true);
    
    // Mark that we're starting authentication with timestamp
    localStorage.setItem('daypilot-auth-in-progress', Date.now().toString());
    
    try {
      // Detect if mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        setIsRedirecting(true);
      }
      await signInWithGoogle();
      if (!isMobile) {
        toast({ title: "Logged in with Google" });
      }
      // Clear auth flag on success
      localStorage.removeItem('daypilot-auth-in-progress');
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Google Sign-In Failed", 
        description: error.message 
      });
      setLoading(false);
      setIsRedirecting(false);
      setIsAuthenticating(false);
      // Clear auth flag on error
      localStorage.removeItem('daypilot-auth-in-progress');
    }
  };

  // Show loading state during redirect
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-xl border-primary/10">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground text-center">
                Signing in with Google...
              </p>
              <p className="text-xs text-muted-foreground text-center">
                This may take a few seconds
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  localStorage.removeItem('daypilot-auth-in-progress');
                  setIsRedirecting(false);
                  setIsAuthenticating(false);
                  setLoading(false);
                }}
                className="mt-4"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold italic shadow-lg">
              D
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">DayPilot</CardTitle>
          </div>
          <CardDescription>
            {isRegistering ? "Create an account to start planning" : "Login to access your schedule"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required 
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder={isRegistering ? "Min. 6 characters" : "Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required 
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Processing..." : isRegistering ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter>
          <Button 
            variant="link" 
            className="w-full text-xs" 
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={loading}
          >
            {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
