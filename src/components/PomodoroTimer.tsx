"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  currentTask?: string;
  onComplete?: () => void;
}

const TIMER_DURATIONS = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export function PomodoroTimer({ currentTask, onComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleTimerComplete = React.useCallback(() => {
    setIsRunning(false);
    
    if (mode === 'focus') {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);
      
      toast({
        title: "🎉 Pomodoro Complete!",
        description: `Great work! Time for a ${newCount % 4 === 0 ? 'long' : 'short'} break.`,
      });

      // Suggest break type
      if (newCount % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(TIMER_DURATIONS.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(TIMER_DURATIONS.shortBreak);
      }

      onComplete?.();
      
      // Browser notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete! 🎉', {
          body: 'Time for a break. Great work!',
          icon: '/favicon.ico',
        });
      }
    } else {
      toast({
        title: "Break Complete!",
        description: "Ready to focus again?",
      });
      
      setMode('focus');
      setTimeLeft(TIMER_DURATIONS.focus);
    }
  }, [mode, pomodorosCompleted, toast, onComplete]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion separately
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
  }, [timeLeft, isRunning, handleTimerComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_DURATIONS[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode]) * 100;

  return (
    <Card className={cn(
      "border-2 transition-all",
      mode === 'focus' ? "border-red-500 bg-red-50 dark:bg-red-950/20" :
      mode === 'shortBreak' ? "border-green-500 bg-green-50 dark:bg-green-950/20" :
      "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            {mode === 'focus' ? <Zap className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
            Pomodoro Timer
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {pomodorosCompleted} 🍅 completed
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mode Selector */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'focus' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchMode('focus')}
            className="flex-1 text-xs h-8"
          >
            Focus
          </Button>
          <Button
            variant={mode === 'shortBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchMode('shortBreak')}
            className="flex-1 text-xs h-8"
          >
            Short Break
          </Button>
          <Button
            variant={mode === 'longBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchMode('longBreak')}
            className="flex-1 text-xs h-8"
          >
            Long Break
          </Button>
        </div>

        {/* Timer Display */}
        <div className="relative">
          <div className="text-center py-6">
            <div className="text-5xl font-bold tabular-nums mb-2">
              {formatTime(timeLeft)}
            </div>
            {currentTask && mode === 'focus' && (
              <p className="text-xs text-muted-foreground truncate px-4">
                Working on: {currentTask}
              </p>
            )}
          </div>
          
          {/* Progress Ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted opacity-20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={cn(
                  "transition-all duration-1000",
                  mode === 'focus' ? "text-red-500" :
                  mode === 'shortBreak' ? "text-green-500" :
                  "text-blue-500"
                )}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={toggleTimer}
            className="flex-1 gap-2"
            variant={isRunning ? 'secondary' : 'default'}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Start
              </>
            )}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="icon"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-bold">{pomodorosCompleted}</div>
            <div className="text-[10px] text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{Math.floor(pomodorosCompleted * 25 / 60)}h</div>
            <div className="text-[10px] text-muted-foreground">Focus Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{pomodorosCompleted % 4}/4</div>
            <div className="text-[10px] text-muted-foreground">Until Long Break</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
