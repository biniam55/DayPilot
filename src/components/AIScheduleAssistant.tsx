"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Task, UserPreferences } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AIScheduleAssistantProps {
  tasks: Task[];
  preferences: UserPreferences;
  onScheduleUpdate: (scheduledTasks: Task[]) => void;
}

export function AIScheduleAssistant({ tasks, preferences, onScheduleUpdate }: AIScheduleAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: tasks.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description || '',
            priority: t.priority,
            estimatedDurationMinutes: t.estimatedTimeMinutes,
            category: t.category,
            dueDate: t.dueDate
          })),
          preferences
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate schedule');
      }

      const result = await response.json();

      setExplanation(result.explanation);
      
      const updatedTasks = tasks.map(task => {
        const scheduled = result.scheduledTasks.find((st: any) => st.id === task.id);
        if (scheduled) {
          return {
            ...task,
            scheduledStartTime: scheduled.startTime,
            scheduledEndTime: scheduled.endTime
          };
        }
        return task;
      });

      onScheduleUpdate(updatedTasks);
    } catch (error: any) {
      console.error("Scheduling failed:", error);
      setError(error.message || 'Failed to generate schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-accent/30 bg-accent/5 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          <CardTitle className="text-sm">AI Schedule Assistant</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Optimize your day using AI based on task priority and time estimates.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-xs font-bold">Error</AlertTitle>
            <AlertDescription className="text-[11px] leading-relaxed">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {explanation && (
          <Alert className="bg-white/50 border-accent/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-xs font-bold">Insight</AlertTitle>
            <AlertDescription className="text-[11px] leading-relaxed">
              {explanation}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[11px] text-muted-foreground px-1">
            <span>Work Hours</span>
            <span>{preferences.workDayStart} - {preferences.workDayEnd}</span>
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground px-1">
            <span>Pending Tasks</span>
            <span>{tasks.filter(t => !t.isCompleted).length} items</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSuggestSchedule} 
          disabled={loading || tasks.length === 0}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-9 rounded-lg shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Daily Plan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}