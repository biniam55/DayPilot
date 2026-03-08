"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskTimerProps {
  taskId: string;
  taskName: string;
  onTimeUpdate?: (taskId: string, minutes: number) => void;
  className?: string;
}

export function TaskTimer({ taskId, taskName, onTimeUpdate, className }: TaskTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - (elapsedSeconds * 1000);
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setElapsedSeconds(elapsed);
        }
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
  }, [isRunning, elapsedSeconds]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (elapsedSeconds > 0) {
      const minutes = Math.round(elapsedSeconds / 60);
      onTimeUpdate?.(taskId, minutes);
    }
    setElapsedSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono",
        isRunning ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-muted text-muted-foreground"
      )}>
        <Clock className="w-3 h-3" />
        {formatTime(elapsedSeconds)}
      </div>
      
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        onClick={toggleTimer}
      >
        {isRunning ? (
          <Pause className="w-3 h-3" />
        ) : (
          <Play className="w-3 h-3" />
        )}
      </Button>
      
      {elapsedSeconds > 0 && (
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={stopTimer}
        >
          <Square className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
