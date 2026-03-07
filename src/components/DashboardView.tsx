import React, { memo } from 'react';
import { Task } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface DashboardViewProps {
  tasks: Task[];
  stats: {
    completed: number;
    total: number;
    highPriority: number;
    estimatedMinutes: number;
    progress: number;
  };
  chartData: Array<{ name: string; value: number; color: string }>;
  onNavigate: (view: 'dashboard' | 'planner' | 'categories' | 'calendar' | 'settings') => void;
}

const StatCard = memo(({ 
  title, 
  icon: Icon, 
  value, 
  subtitle, 
  className 
}: { 
  title: string; 
  icon: any; 
  value: string | number; 
  subtitle: string; 
  className?: string;
}) => (
  <Card className={cn("shadow-sm", className)}>
    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
      <CardTitle className="text-[10px] sm:text-xs font-bold flex items-center gap-2 uppercase tracking-wider">
        <Icon className="w-4 h-4" /> {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
      <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">{subtitle}</p>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

const CustomTooltip = memo(({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border p-2 rounded-lg shadow-lg text-[10px]">
        <p className="font-bold">{payload[0].payload.name}</p>
        <p>{payload[0].value} Tasks</p>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

export const DashboardView = memo(function DashboardView({ tasks, stats, chartData, onNavigate }: DashboardViewProps) {
  const recentTasks = tasks.slice(0, 4);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Completion Rate"
            icon={CheckCircle2}
            value={`${stats.progress}%`}
            subtitle={`${stats.completed} / ${stats.total} tasks done`}
            className="bg-primary/5 border-primary/20 text-primary"
          />
          
          <StatCard
            title="High Priority"
            icon={AlertTriangle}
            value={stats.highPriority}
            subtitle="Critical tasks pending"
            className="bg-destructive/5 border-destructive/20 text-destructive"
          />

          <StatCard
            title="Time Required"
            icon={Clock}
            value={`${Math.floor(stats.estimatedMinutes / 60)}h ${stats.estimatedMinutes % 60}m`}
            subtitle="Remaining for today"
            className="bg-accent/5 border-accent/20 text-accent-foreground"
          />

          <StatCard
            title="Productivity"
            icon={TrendingUp}
            value="Good"
            subtitle="Steady pace maintained"
            className="bg-muted/30 border-muted text-muted-foreground"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-sm font-bold">Priority Distribution</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs">Breakdown of tasks by importance</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px] p-2 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="w-4 h-4" /> Recent Activity
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-xs">Latest updates to your plan</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      task.isCompleted ? "bg-green-500" : task.priority === 'high' ? "bg-destructive" : "bg-accent"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] sm:text-xs font-semibold truncate">{task.name}</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
                        {task.isCompleted ? 'Completed' : 'Pending'} • {task.category || 'General'}
                      </p>
                    </div>
                    <span className="text-[9px] text-muted-foreground shrink-0">Today</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="ghost" className="w-full text-[10px] sm:text-xs h-8 text-muted-foreground" onClick={() => onNavigate('planner')}>
                View all activity
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
});
