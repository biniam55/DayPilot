
"use client"

import React, { useState } from 'react';
import { Task, UserPreferences } from "@/lib/types";
import { Timeline } from "@/components/Timeline";
import { TaskCard } from "@/components/TaskCard";
import { QuickTaskInput } from "@/components/QuickTaskInput";
import { AIScheduleAssistant } from "@/components/AIScheduleAssistant";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ListTodo, LayoutDashboard, Settings, Compass, Search, Bell, Tag, CheckCircle2, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    name: 'Project presentation prep',
    description: 'Structure slides and practice the flow for the stakeholder meeting.',
    priority: 'high',
    estimatedTimeMinutes: 60,
    isCompleted: false,
    status: 'in-progress',
    category: 'Work',
    dueDate: '2024-05-20',
  },
  {
    id: '2',
    name: 'Email review',
    description: 'Clear the inbox and flag urgent items.',
    priority: 'medium',
    estimatedTimeMinutes: 30,
    isCompleted: true,
    status: 'completed',
    category: 'Work',
  },
  {
    id: '3',
    name: 'Gym session',
    priority: 'low',
    estimatedTimeMinutes: 45,
    isCompleted: false,
    status: 'todo',
    category: 'Health',
  }
];

const DEFAULT_PREFERENCES: UserPreferences = {
  workDayStart: "09:00",
  workDayEnd: "18:00",
  preferredBreaks: [{ start: "12:30", durationMinutes: 60 }]
};

export default function DayPilotDashboard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [preferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [activeTab, setActiveTab] = useState('all');
  const [view, setView] = useState<'dashboard' | 'planner' | 'categories' | 'calendar'>('planner');

  const addTask = (name: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      priority: 'medium',
      estimatedTimeMinutes: 30,
      isCompleted: false,
      status: 'todo',
      category: 'General',
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted, status: t.isCompleted ? 'todo' : 'completed' } : t));
  };

  const handleScheduleUpdate = (scheduledTasks: Task[]) => {
    setTasks(scheduledTasks);
  };

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'todo') return !t.isCompleted;
    if (activeTab === 'completed') return t.isCompleted;
    return true;
  });

  const categories = Array.from(new Set(tasks.map(t => t.category || 'General')));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold italic shadow-lg">
            D
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary">DayPilot</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <Button 
            variant="ghost" 
            onClick={() => setView('dashboard')}
            className={cn("w-full justify-start gap-3 h-10 text-sm font-medium", view === 'dashboard' ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary")}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setView('planner')}
            className={cn("w-full justify-start gap-3 h-10 text-sm font-medium", view === 'planner' ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary")}
          >
            <Compass className="w-4 h-4" />
            My Planner
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setView('categories')}
            className={cn("w-full justify-start gap-3 h-10 text-sm font-medium", view === 'categories' ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary")}
          >
            <ListTodo className="w-4 h-4" />
            Categories
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setView('calendar')}
            className={cn("w-full justify-start gap-3 h-10 text-sm font-medium", view === 'calendar' ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary")}
          >
            <CalendarIcon className="w-4 h-4" />
            Calendar
          </Button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 bg-muted/40 rounded-xl border border-muted">
            <p className="text-xs font-semibold mb-2">Weekly Goal</p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-accent w-3/4 rounded-full" />
            </div>
            <p className="text-[10px] text-muted-foreground">15/20 tasks completed this week</p>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 mt-4 h-10 text-sm font-medium text-muted-foreground">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold hidden sm:block">
              {view === 'planner' && 'My Daily Plan'}
              {view === 'dashboard' && 'Dashboard Overview'}
              {view === 'categories' && 'Task Categories'}
              {view === 'calendar' && 'Full Schedule'}
            </h2>
            <div className="relative w-64 hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                placeholder="Search tasks..." 
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-transparent focus:border-primary/20 rounded-full text-xs focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
               <Bell className="w-4 h-4" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
             </Button>
             <div className="w-8 h-8 rounded-full bg-muted border overflow-hidden">
               <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {view === 'planner' && (
            <div className="flex h-full gap-8 p-8 overflow-hidden">
              <div className="w-full lg:w-[400px] h-full shrink-0">
                <Timeline tasks={tasks} />
              </div>

              <div className="flex-1 flex flex-col gap-6 min-w-0">
                <QuickTaskInput onAdd={addTask} />
                <div className="flex-1 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden min-h-0">
                  <Tabs defaultValue="all" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                    <div className="px-6 py-4 border-b flex items-center justify-between gap-4">
                      <TabsList className="bg-muted/50 h-9 p-1">
                        <TabsTrigger value="all" className="text-xs px-4 rounded-md">All</TabsTrigger>
                        <TabsTrigger value="todo" className="text-xs px-4 rounded-md">To-Do</TabsTrigger>
                        <TabsTrigger value="completed" className="text-xs px-4 rounded-md">Done</TabsTrigger>
                      </TabsList>
                      <Badge variant="secondary" className="text-[10px] font-bold px-2.5">
                        {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                      </Badge>
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="p-6 space-y-4">
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map(task => (
                            <TaskCard 
                              key={task.id} 
                              task={task} 
                              onToggleComplete={toggleTaskComplete} 
                            />
                          ))
                        ) : (
                          <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                            <ListTodo className="w-12 h-12 mb-4" />
                            <p className="text-sm font-medium">No tasks found for this view</p>
                            <p className="text-xs">Add a new task to get started!</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </Tabs>
                </div>
              </div>

              <aside className="w-80 hidden xl:block shrink-0">
                <AIScheduleAssistant 
                  tasks={tasks} 
                  preferences={preferences} 
                  onScheduleUpdate={handleScheduleUpdate} 
                />
                
                <div className="mt-6 p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    Productivity Snapshot
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Completion Rate</span>
                      <span className="text-xs font-bold">
                        {tasks.length > 0 ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.isCompleted).length / tasks.length) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                       <div className="p-3 bg-white rounded-lg border text-center shadow-sm">
                          <p className="text-[10px] text-muted-foreground font-medium mb-1">Pending</p>
                          <p className="text-sm font-bold">{tasks.filter(t => !t.isCompleted).length}</p>
                       </div>
                       <div className="p-3 bg-white rounded-lg border text-center shadow-sm">
                          <p className="text-[10px] text-muted-foreground font-medium mb-1">Focus Score</p>
                          <p className="text-sm font-bold text-accent">92</p>
                       </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {view === 'dashboard' && (
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-primary flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Tasks Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{tasks.filter(t => t.isCompleted).length}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">out of {tasks.length} total tasks</p>
                  </CardContent>
                </Card>
                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-accent flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time Invested
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {Math.round(tasks.filter(t => t.isCompleted).reduce((acc, t) => acc + t.estimatedTimeMinutes, 0) / 60)}h
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">productive hours tracked</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50/50 border-green-200/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-green-600 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Top Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{categories[0] || 'N/A'}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">most active project area</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold">Recent Activity</h3>
                  <div className="bg-card border rounded-xl divide-y">
                    {tasks.slice(0, 5).map(task => (
                      <div key={task.id} className="p-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-2 h-2 rounded-full", task.isCompleted ? "bg-green-500" : "bg-primary")} />
                          <span className={cn(task.isCompleted && "line-through text-muted-foreground")}>{task.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[9px]">{task.category}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold">Calendar Quick-View</h3>
                  <div className="bg-card border rounded-xl p-6 flex justify-center">
                    <Calendar className="rounded-md border" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'categories' && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => {
                  const catTasks = tasks.filter(t => (t.category || 'General') === cat);
                  const completedCount = catTasks.filter(t => t.isCompleted).length;
                  const percent = catTasks.length > 0 ? (completedCount / catTasks.length) * 100 : 0;
                  
                  return (
                    <Card key={cat} className="group hover:border-primary/40 transition-all cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{cat}</Badge>
                          <span className="text-[10px] font-bold text-muted-foreground">{catTasks.length} tasks</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 mt-2">
                          <div className="flex justify-between text-[11px] font-medium">
                            <span>Progress</span>
                            <span>{Math.round(percent)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                          </div>
                          <div className="pt-2">
                            {catTasks.slice(0, 3).map(t => (
                              <div key={t.id} className="text-[10px] py-1 border-t flex items-center gap-2">
                                <div className={cn("w-1 h-1 rounded-full", t.isCompleted ? "bg-green-500" : "bg-primary")} />
                                <span className="truncate flex-1">{t.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'calendar' && (
            <div className="h-full flex flex-col p-8">
              <div className="flex-1 bg-card border rounded-2xl flex flex-col overflow-hidden shadow-sm">
                <div className="p-6 border-b flex items-center justify-between">
                  <h3 className="text-lg font-bold">Monthly Overview</h3>
                  <div className="flex gap-2">
                     <Button variant="outline" size="sm">Today</Button>
                     <Button variant="outline" size="sm">Month</Button>
                     <Button variant="outline" size="sm">Week</Button>
                  </div>
                </div>
                <div className="flex-1 flex gap-8 p-8 overflow-hidden">
                   <div className="shrink-0">
                      <Calendar mode="single" className="border rounded-xl shadow-sm" />
                   </div>
                   <div className="flex-1 space-y-4">
                      <h4 className="text-sm font-bold border-b pb-2">Upcoming deadlines</h4>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3">
                          {tasks.filter(t => t.dueDate && !t.isCompleted).map(t => (
                            <div key={t.id} className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xs font-bold">{t.name}</p>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <CalendarIcon className="w-3 h-3" />
                                  Due: {t.dueDate}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-[9px] uppercase tracking-wider">{t.priority}</Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
