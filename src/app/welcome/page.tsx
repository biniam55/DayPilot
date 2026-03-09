'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Calendar, Brain, TrendingUp, Zap } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleGetStarted = () => {
    if (agreedToTerms) {
      localStorage.setItem('daypilot-welcome-seen', 'true');
      router.push('/login');
    }
  };

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: "Smart Planning",
      description: "Organize your day with intelligent task scheduling"
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "AI Assistant",
      description: "Get AI-powered suggestions for optimal productivity"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Track Progress",
      description: "Monitor your productivity with detailed analytics"
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Stay Focused",
      description: "Pomodoro timer and reminders keep you on track"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-primary/10">
        <CardContent className="p-6 sm:p-8 md:p-10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl font-bold text-primary-foreground">D</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Welcome to DayPilot
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Your AI-powered daily planner and task management companion
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex gap-3 p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* What You Get */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              What you get:
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Unlimited tasks and categories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>AI-powered schedule optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Productivity analytics and insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Works offline with local storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Secure authentication with Google or Email</span>
              </li>
            </ul>
          </div>

          {/* Terms Agreement */}
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-card">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-0.5"
              />
              <label 
                htmlFor="terms" 
                className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
              >
                I agree to the{' '}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('/terms', '_blank');
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('/privacy', '_blank');
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Privacy Policy
                </button>
                . I understand that my data is stored locally on my device and I can delete it anytime.
              </label>
            </div>
          </div>

          {/* Get Started Button */}
          <Button 
            className="w-full h-12 text-base font-semibold shadow-lg"
            onClick={handleGetStarted}
            disabled={!agreedToTerms}
          >
            Get Started
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Free to use • No credit card required • Your data stays private
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
