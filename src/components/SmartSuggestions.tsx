"use client"

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Clock, Zap, Coffee, AlertCircle } from "lucide-react";
import { Task, EnergyLevel } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface SmartSuggestionsProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
}

export function SmartSuggestions({ tasks, onSelectTask }: SmartSuggestionsProps) {
  const currentHour = new Date().getHours();
  
  // Determine current energy level based on time
  const getCurrentEnergyLevel = (): EnergyLevel => {
    if (currentHour >= 9 && currentHour < 12) return 'high'; // Morning
    if (currentHour >= 12 && currentHour < 15) return 'medium'; // Midday
    return 'low'; // Afternoon/Evening
  };

  const currentEnergy = getCurrentEnergyLevel();

  const suggestions = useMemo(() => {
    const incompleteTasks = tasks.filter(t => !t.isCompleted);
    
    if (incompleteTasks.length === 0) {
      return {
        primary: null,
        alternatives: [],
        reason: "All tasks completed! 🎉"
      };
    }

    // Score tasks based on multiple factors
    const scoredTasks = incompleteTasks.map(task => {
      let score = 0;
      
      // Priority scoring
      if (task.priority === 'high') score += 30;
      else if (task.priority === 'medium') score += 20;
      else score += 10;
      
      // Energy match scoring
      if (task.energyLevel === currentEnergy) score += 25;
      else if (
        (task.energyLevel === 'high' && currentEnergy === 'medium') ||
        (task.energyLevel === 'medium' && currentEnergy === 'low')
      ) score += 10; // Partial match
      
      // Due date urgency
      if (task.dueDate) {
        const daysUntilDue = Math.floor(
          (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilDue <= 0) score += 40; // Overdue
        else if (daysUntilDue === 1) score += 30; // Due tomorrow
        else if (daysUntilDue <= 3) score += 20; // Due soon
      }
      
      // Subtask progress (tasks with started subtasks)
      if (task.subtasks && task.subtasks.length > 0) {
        const completedSubtasks = task.subtasks.filter(st => st.isCompleted).length;
        if (completedSubtasks > 0 && completedSubtasks < task.subtasks.length) {
          score += 15; // In progress, good to continue
        }
      }
      
      // Time-based scoring (prefer shorter tasks in afternoon)
      if (currentEnergy === 'low' && task.estimatedTimeMinutes <= 30) {
        score += 15;
      }
      
      return { task, score };
    });

    // Sort by score
    scoredTasks.sort((a, b) => b.score - a.score);
    
    // Generate reason for top suggestion
    const top = scoredTasks[0];
    let reason = "";
    
    if (top.task.priority === 'high') {
      reason = "High priority task";
    } else if (top.task.energyLevel === currentEnergy) {
      reason = `Matches your ${currentEnergy} energy level`;
    } else if (top.task.dueDate) {
      const daysUntilDue = Math.floor(
        (new Date(top.task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDue <= 0) reason = "Overdue!";
      else if (daysUntilDue === 1) reason = "Due tomorrow";
      else reason = "Due soon";
    } else {
      reason = "Good task to start now";
    }

    return {
      primary: top.task,
      alternatives: scoredTasks.slice(1, 4).map(st => st.task),
      reason
    };
  }, [tasks, currentEnergy]);

  const getEnergyIcon = (energy: EnergyLevel) => {
    switch (energy) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌙';
    }
  };

  const getTimeOfDayMessage = () => {
    if (currentHour >= 5 && currentHour < 12) {
      return { icon: '🌅', text: 'Good morning! Peak focus time.', energy: 'high' };
    } else if (currentHour >= 12 && currentHour < 17) {
      return { icon: '☀️', text: 'Afternoon - steady energy.', energy: 'medium' };
    } else if (currentHour >= 17 && currentHour < 21) {
      return { icon: '🌆', text: 'Evening - wind down time.', energy: 'low' };
    } else {
      return { icon: '🌙', text: 'Late night - rest time!', energy: 'low' };
    }
  };

  const timeOfDay = getTimeOfDayMessage();

  if (!suggestions.primary) {
    return (
      <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-semibold">All tasks completed!</p>
          <p className="text-xs text-muted-foreground mt-1">Great work today!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            What Should I Do Now?
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">
            {timeOfDay.icon} {getEnergyIcon(currentEnergy as EnergyLevel)} {currentEnergy} energy
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {timeOfDay.text}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Primary Suggestion */}
        <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Best Choice</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{suggestions.primary.name}</h4>
              <p className="text-xs text-muted-foreground">{suggestions.reason}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge variant="outline" className="text-[10px]">
                {suggestions.primary.priority}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {suggestions.primary.estimatedTimeMinutes}m
              </span>
            </div>
          </div>
          
          {suggestions.primary.subtasks && suggestions.primary.subtasks.length > 0 && (
            <div className="mt-2 pt-2 border-t border-primary/10">
              <p className="text-[10px] text-muted-foreground mb-1">Next subtask:</p>
              <p className="text-xs font-medium">
                {suggestions.primary.subtasks.find(st => !st.isCompleted)?.name || 'All subtasks done!'}
              </p>
            </div>
          )}
          
          <Button 
            onClick={() => onSelectTask?.(suggestions.primary!)}
            className="w-full mt-3 h-8 text-xs"
          >
            Start This Task
          </Button>
        </div>

        {/* Alternative Suggestions */}
        {suggestions.alternatives.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Or try these:</p>
            <div className="space-y-2">
              {suggestions.alternatives.map((task, idx) => (
                <div 
                  key={task.id}
                  className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onSelectTask?.(task)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{task.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[9px] h-4 px-1">
                          {task.priority}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {task.estimatedTimeMinutes}m
                        </span>
                        {task.energyLevel && (
                          <span className="text-[10px]">
                            {getEnergyIcon(task.energyLevel)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="pt-3 border-t">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
            <p className="text-[10px] leading-relaxed">
              {currentEnergy === 'high' && "Perfect time for complex work. Tackle your hardest tasks now!"}
              {currentEnergy === 'medium' && "Good for meetings and regular work. Save deep work for morning."}
              {currentEnergy === 'low' && "Energy is lower. Focus on simple tasks like email and admin work."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
