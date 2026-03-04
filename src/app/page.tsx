"use client"

import React, { useState, useEffect } from 'react';
import { Task, UserPreferences } from "@/lib/types";
import { Timeline } from "@/components/Timeline";
import { TaskCard } from "@/components/TaskCard";
import { QuickTaskInput } from "@/components/QuickTaskInput";
import { AIScheduleAssistant } from "@/components/AIScheduleAssistant";
import { Button } from "@/components/ui/button";
import { Calendar, ListTodo, LayoutDashboard, Settings, Compass, Search, Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
          <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-sm font-medium hover:bg-primary/5 hover:text-primary">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-sm font-medium bg-primary/5 text-primary">
            <Compass className="w-4 h-4" />
            My Planner
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-sm font-medium hover:bg-primary/5 hover:text-primary">
            <ListTodo className="w-4 h-4" />
            Categories
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-sm font-medium hover:bg-primary/5 hover:text-primary">
            <Calendar className="w-4 h-4" />
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
            <h2 className="text-lg font-semibold hidden sm:block">My Daily Plan</h2>
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

        <div className="flex-1 flex gap-8 p-8 overflow-hidden">
          {/* Timeline View */}
          <div className="w-full lg:w-[400px] h-full">
            <Timeline tasks={tasks} />
          </div>

          {/* Task Management Panel */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Quick Add Component */}
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

          {/* Assistant Side Panel */}
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
                  <span className="text-xs font-bold">75%</span>
                </div>
                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                   <div className="p-3 bg-white rounded-lg border text-center shadow-sm">
                      <p className="text-[10px] text-muted-foreground font-medium mb-1">Total Time</p>
                      <p className="text-sm font-bold">4.5h</p>
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
      </main>
    </div>
  );
}