"use client"

import React, { useMemo, useState } from 'react';
import { Task } from "@/lib/types";
import { calculateProductivityMetrics, getProductivityInsights, calculateStreak } from "@/lib/analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Flame, 
  BarChart3, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Pie, PieChart } from "recharts";

interface AnalyticsViewProps {
  tasks: Task[];
}

export function AnalyticsView({ tasks }: AnalyticsViewProps) {
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);
  
  const metrics = useMemo(() => 
    calculateProductivityMetrics(tasks, timeRange), 
    [tasks, timeRange]
  );
  
  const insights = useMemo(() => 
    getProductivityInsights(metrics), 
    [metrics]
  );
  
  const streak = useMemo(() => 
    calculateStreak(tasks), 
    [tasks]
  );

  const priorityData = [
    { name: 'High', completed: metrics.highPriorityCompleted, total: metrics.highPriorityTotal, color: 'hsl(var(--destructive))' },
    { name: 'Medium', completed: metrics.mediumPriorityCompleted, total: metrics.mediumPriorityTotal, color: 'hsl(var(--accent))' },
    { name: 'Low', completed: metrics.lowPriorityCompleted, total: metrics.lowPriorityTotal, color: 'hsl(var(--primary))' },
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }: any) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          {trend && (
            <Badge variant={trend > 0 ? "default" : "secondary"} className="text-xs">
              {trend > 0 ? '+' : ''}{trend}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Analytics & Insights</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track your productivity patterns and progress
            </p>
          </div>
          <Tabs value={timeRange.toString()} onValueChange={(v) => setTimeRange(Number(v) as 7 | 14 | 30)}>
            <TabsList className="h-9">
              <TabsTrigger value="7" className="text-xs">7 days</TabsTrigger>
              <TabsTrigger value="14" className="text-xs">14 days</TabsTrigger>
              <TabsTrigger value="30" className="text-xs">30 days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Target}
            title="Completion Rate"
            value={`${metrics.completionRate}%`}
            subtitle={`${metrics.completedTasks} of ${metrics.totalTasks} tasks`}
            color="bg-primary/10 text-primary"
          />
          
          <StatCard
            icon={Flame}
            title="Current Streak"
            value={`${streak} days`}
            subtitle="Keep it going!"
            color="bg-orange-500/10 text-orange-500"
          />
          
          <StatCard
            icon={Clock}
            title="Time Accuracy"
            value={`${metrics.estimateAccuracy}%`}
            subtitle="Estimate vs actual"
            color="bg-accent/10 text-accent-foreground"
          />
          
          <StatCard
            icon={AlertCircle}
            title="Overdue Tasks"
            value={metrics.overdueCount}
            subtitle="Need attention"
            color="bg-destructive/10 text-destructive"
          />
        </div>

        {/* Insights */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <CardTitle className="text-sm">Productivity Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p>{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Completion Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Daily Completion Trend</CardTitle>
              <CardDescription className="text-xs">Tasks completed over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.dailyCompletionTrend}>
                  <XAxis 
                    dataKey="date" 
                    fontSize={10} 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis fontSize={10} />
                  <Tooltip 
                    contentStyle={{ fontSize: '12px' }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Priority Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Priority Breakdown</CardTitle>
              <CardDescription className="text-xs">Completion by priority level</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip contentStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Time by Category</CardTitle>
            <CardDescription className="text-xs">Where you spend your time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.categoryStats.slice(0, 5).map((cat) => {
                const completionRate = cat.total > 0 ? (cat.completed / cat.total) * 100 : 0;
                const hours = Math.floor(cat.timeSpent / 60);
                const minutes = cat.timeSpent % 60;
                
                return (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cat.category}</span>
                        <Badge variant="outline" className="text-xs">
                          {cat.completed}/{cat.total}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {hours > 0 && `${hours}h `}{minutes}m
                      </span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{metrics.totalTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{Math.floor(metrics.totalActualMinutes / 60)}h</div>
              <p className="text-xs text-muted-foreground mt-1">Time Spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{metrics.averageTaskDuration}m</div>
              <p className="text-xs text-muted-foreground mt-1">Avg Duration</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{metrics.categoryStats.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Categories</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
