"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Task, UserPreferences } from "@/lib/types";
import { suggestOptimalDailySchedule } from "@/ai/flows/ai-suggest-optimal-daily-schedule";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AIScheduleAssistantProps {
  tasks: Task[];
  preferences: UserPreferences;
  onScheduleUpdate: (scheduledTasks: Task[]) => void;
}

export function AIScheduleAssistant({ tasks, preferences, onScheduleUpdate }: AIScheduleAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleSuggestSchedule = async () => {
    setLoading(true);
    try {
      const result = await suggestOptimalDailySchedule({
        tasks: tasks.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          priority: t.priority,
          estimatedDurationMinutes: t.estimatedTimeMinutes,
          category: t.category,
          dueDate: t.dueDate
        })),
        preferences
      });

      setExplanation(result.explanation);
      
      const updatedTasks = tasks.map(task => {
        const scheduled = result.scheduledTasks.find(st => st.id === task.id);
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
    } catch (error) {
      console.error("Scheduling failed:", error);
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