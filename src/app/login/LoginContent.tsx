'use client';

import React, { useState, useEffect } from 'react';
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
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Debug logging
  React.useEffect(() => {
    const addDebug = (msg: string) => {
      setDebugInfo(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${msg}`]);
    };
    
    addDebug(`Auth loading: ${authLoading}, User: ${user ? user.email : 'none'}`);
  }, [authLoading, user]);

  // Check welcome screen on mount - but only if not in the middle of auth
  useEffect(() => {
    // Don't check welcome if we're loading auth state
    if (authLoading) return;
    
    // Don't check welcome if user is already logged in
    if (user) return;
    
    const hasSeenWelcome = localStorage.getItem('daypilot-welcome-seen');
    if (!hasSeenWelcome) {
      router.replace('/welcome');
    }
  }, [authLoading, user, router]);

  // Redirect if already logged in
  useEffect(() => {
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
    try {
      await signInWithGoogle();
      // Don't show toast here for mobile redirect - it will be lost
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) {
        toast({ title: "Logged in with Google" });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Google Sign-In Failed", 
        description: error.message 
      });
      setLoading(false);
    }
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

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
    try {
      await signInWithGoogle();
      toast({ title: "Logged in with Google" });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Google Sign-In Failed", 
        description: error.message 
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Debug info - remove after testing */}
      {debugInfo.length > 0 && (
        <div className="fixed top-4 left-4 right-4 bg-black text-white text-xs p-2 rounded z-50 max-h-32 overflow-auto">
          {debugInfo.map((info, i) => (
            <div key={i}>{info}</div>
          ))}
        </div>
      )}
      
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
