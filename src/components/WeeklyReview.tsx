"use client"

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { CheckCircle2, Clock, TrendingUp, AlertTriangle, Calendar, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface WeeklyReviewProps {
  tasks: Task[];
}

export function WeeklyReview({ tasks }: WeeklyReviewProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filter tasks from last 7 days
    const weekTasks = tasks.filter(task => {
      if (!task.createdAt) return false;
      const createdDate = new Date(task.createdAt);
      return createdDate >= weekAgo;
    });

    const completed = weekTasks.filter(t => t.isCompleted).length;
    const total = weekTasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Time analysis
    const estimatedTime = weekTasks.reduce((sum, t) => sum + t.estimatedTimeMinutes, 0);
    const actualTime = weekTasks.reduce((sum, t) => sum + (t.actualTimeMinutes || 0), 0);
    const timeAccuracy = estimatedTime > 0 ? Math.round((actualTime / estimatedTime) * 100) : 0;

    // Category breakdown
    const byCategory: Record<string, { total: number; completed: number }> = {};
    weekTasks.forEach(task => {
      const cat = task.category || 'General';
      if (!byCategory[cat]) {
        byCategory[cat] = { total: 0, completed: 0 };
      }
      byCategory[cat].total++;
      if (task.isCompleted) byCategory[cat].completed++;
    });

    // Priority breakdown
    const byPriority = {
      high: weekTasks.filter(t => t.priority === 'high'),
      medium: weekTasks.filter(t => t.priority === 'medium'),
      low: weekTasks.filter(t => t.priority === 'low'),
    };

    // Overdue tasks
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.isCompleted) return false;
      return new Date(task.dueDate) < now;
    });

    // Recurring tasks completion
    const recurringTasks = weekTasks.filter(t => t.recurrence && t.recurrence !== 'none');
    const recurringCompleted = recurringTasks.filter(t => t.isCompleted).length;

    return {
      completed,
      total,
      completionRate,
      estimatedTime,
      actualTime,
      timeAccuracy,
      byCategory,
      byPriority,
      overdue: overdue.length,
      recurringCompleted,
      recurringTotal: recurringTasks.length,
    };
  }, [tasks]);

  const getPerformanceMessage = () => {
    if (stats.completionRate >= 80) {
      return { icon: '🌟', text: 'Excellent!', color: 'text-green-600' };
    } else if (stats.completionRate >= 60) {
      return { icon: '👍', text: 'Good work!', color: 'text-blue-600' };
    } else if (stats.completionRate >= 40) {
      return { icon: '📈', text: 'Keep going!', color: 'text-yellow-600' };
    } else {
      return { icon: '💪', text: 'Room to improve', color: 'text-orange-600' };
    }
  };

  const performance = getPerformanceMessage();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Review
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Your productivity insights for the last 7 days
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${performance.color}`}>
              {stats.completionRate}%
            </div>
            <div className="text-xs text-muted-foreground">
              {performance.icon} {performance.text}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Completion Overview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Task Completion</span>
            <span className="text-sm text-muted-foreground">
              {stats.completed} / {stats.total} tasks
            </span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">tasks done</div>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium">Focus Time</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(stats.actualTime / 60)}h
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round(stats.estimatedTime / 60)}h estimated
            </div>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium">Accuracy</span>
            </div>
            <div className="text-2xl font-bold">{stats.timeAccuracy}%</div>
            <div className="text-xs text-muted-foreground">time estimates</div>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium">Overdue</span>
            </div>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <div className="text-xs text-muted-foreground">tasks pending</div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Priority Breakdown</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20">
                  High
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {stats.byPriority.high.filter(t => t.isCompleted).length} / {stats.byPriority.high.length}
                </span>
              </div>
              <Progress 
                value={stats.byPriority.high.length > 0 ? (stats.byPriority.high.filter(t => t.isCompleted).length / stats.byPriority.high.length) * 100 : 0} 
                className="h-2 w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20">
                  Medium
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {stats.byPriority.medium.filter(t => t.isCompleted).length} / {stats.byPriority.medium.length}
                </span>
              </div>
              <Progress 
                value={stats.byPriority.medium.length > 0 ? (stats.byPriority.medium.filter(t => t.isCompleted).length / stats.byPriority.medium.length) * 100 : 0} 
                className="h-2 w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20">
                  Low
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {stats.byPriority.low.filter(t => t.isCompleted).length} / {stats.byPriority.low.length}
                </span>
              </div>
              <Progress 
                value={stats.byPriority.low.length > 0 ? (stats.byPriority.low.filter(t => t.isCompleted).length / stats.byPriority.low.length) * 100 : 0} 
                className="h-2 w-32"
              />
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Category Performance</h4>
          <div className="space-y-2">
            {Object.entries(stats.byCategory).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between text-xs">
                <span className="font-medium">{category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {data.completed}/{data.total}
                  </span>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${(data.completed / data.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Tasks */}
        {stats.recurringTotal > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">🔄 Recurring Tasks</span>
              <span className="text-sm font-bold">
                {stats.recurringCompleted}/{stats.recurringTotal}
              </span>
            </div>
            <Progress 
              value={(stats.recurringCompleted / stats.recurringTotal) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Great job staying consistent with your routines!
            </p>
          </div>
        )}

        {/* Insights */}
        <div className="pt-4 border-t space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Insights & Tips
          </h4>
          
          {stats.completionRate >= 80 && (
            <div className="text-xs p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              🌟 <strong>Excellent work!</strong> You're crushing your goals. Keep this momentum going!
            </div>
          )}

          {stats.overdue > 0 && (
            <div className="text-xs p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
              ⚠️ <strong>{stats.overdue} overdue tasks.</strong> Consider breaking them into smaller subtasks or adjusting deadlines.
            </div>
          )}

          {stats.timeAccuracy < 80 && stats.actualTime > 0 && (
            <div className="text-xs p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              ⏱️ <strong>Time estimates are off.</strong> You're {stats.timeAccuracy > 100 ? 'overestimating' : 'underestimating'} by {Math.abs(100 - stats.timeAccuracy)}%. Adjust future estimates!
            </div>
          )}

          {stats.byPriority.high.length > 0 && stats.byPriority.high.filter(t => t.isCompleted).length === 0 && (
            <div className="text-xs p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
              🔴 <strong>No high-priority tasks completed.</strong> Focus on important work first thing in the morning!
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button className="w-full" variant="outline">
          <Target className="w-4 h-4 mr-2" />
          Plan Next Week
        </Button>
      </CardContent>
    </Card>
  );
}
