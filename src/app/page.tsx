"use client"

import React, { useState, useEffect } from 'react';
import { Task, UserPreferences, Priority, UserProfile } from "@/lib/types";
import { Timeline } from "@/components/Timeline";
import { TaskCard } from "@/components/TaskCard";
import { QuickTaskInput } from "@/components/QuickTaskInput";
import { AIScheduleAssistant } from "@/components/AIScheduleAssistant";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  ListTodo, 
  LayoutDashboard, 
  Settings, 
  Compass, 
  Search, 
  Bell, 
  Tag, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Plus, 
  Save, 
  User, 
  LogOut,
  Moon,
  Sun,
  Info
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

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
  }
];

const DEFAULT_PREFERENCES: UserPreferences = {
  workDayStart: "09:00",
  workDayEnd: "18:00",
  preferredBreaks: [{ start: "12:30", durationMinutes: 60 }]
};

const DEFAULT_PROFILE: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "https://picsum.photos/seed/user123/100/100",
  bio: "Productivity enthusiast and early riser."
};

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

export default function DayPilotDashboard() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState('all');
  const [view, setView] = useState<'dashboard' | 'planner' | 'categories' | 'calendar' | 'settings'>('planner');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [today, setToday] = useState<Date>(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Plan Ready', description: 'AI has optimized your schedule for today.', time: '5m ago', isRead: false },
    { id: '2', title: 'Welcome!', description: 'Glad to have you on DayPilot.', time: '1h ago', isRead: true }
  ]);

  useEffect(() => {
    setToday(new Date());
    // Check system preference or saved preference
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const addTask = (name: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      priority: 'medium',
      estimatedTimeMinutes: 30,
      isCompleted: false,
      status: 'todo',
      category: 'General',
      description: '',
    };
    setTasks([newTask, ...tasks]);
    toast({
      title: "Task created",
      description: `"${name}" has been added to your list.`,
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
    toast({
      title: "Task updated",
      description: `Changes to "${updatedTask.name}" saved successfully.`,
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    toast({
      variant: "destructive",
      title: "Task deleted",
      description: `"${taskToDelete?.name}" has been removed.`,
    });
  };

  const toggleTaskComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = !task.isCompleted;
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: newStatus, status: newStatus ? 'completed' : 'todo' } : t));
    
    if (newStatus) {
      toast({
        title: "Well done!",
        description: `You finished "${task.name}". Keep it up!`,
      });
      // Add a notification
      setNotifications(prev => [{
        id: Math.random().toString(),
        title: 'Task Completed',
        description: `You marked "${task.name}" as finished.`,
        time: 'Just now',
        isRead: false
      }, ...prev]);
    }
  };

  const handleScheduleUpdate = (scheduledTasks: Task[]) => {
    setTasks(scheduledTasks);
    toast({
      title: "Schedule Optimized",
      description: "AI has re-organized your day for peak efficiency.",
    });
  };

  const savePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    toast({
      title: "Settings saved",
      description: "Your work hours and breaks have been updated.",
    });
  };

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Your personal details have been saved.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'todo') return !t.isCompleted;
    if (activeTab === 'completed') return t.isCompleted;
    return true;
  });

  const categories = Array.from(new Set(tasks.map(t => t.category || 'General')));

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
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
              <div 
                className="h-full bg-accent transition-all duration-500" 
                style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.isCompleted).length / Math.max(tasks.length, 1)) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {tasks.filter(t => t.isCompleted).length} tasks completed
            </p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setView('settings')}
            className={cn("w-full justify-start gap-3 mt-4 h-10 text-sm font-medium", view === 'settings' ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary")}
          >
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
              {view === 'settings' && 'User Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-9 w-9 rounded-full"
               onClick={toggleDarkMode}
             >
               {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </Button>

             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                   <Bell className="w-4 h-4" />
                   {notifications.some(n => !n.isRead) && (
                     <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
                   )}
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-80">
                 <DropdownMenuLabel className="flex justify-between items-center">
                   Notifications
                   <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={markAllAsRead}>Mark as read</Button>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <ScrollArea className="h-64">
                   {notifications.length > 0 ? (
                     notifications.map(n => (
                       <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3 cursor-default">
                         <div className="flex w-full justify-between gap-2">
                           <span className={cn("text-xs font-bold", !n.isRead && "text-primary")}>{n.title}</span>
                           <span className="text-[9px] text-muted-foreground shrink-0">{n.time}</span>
                         </div>
                         <p className="text-[11px] text-muted-foreground leading-relaxed">{n.description}</p>
                       </DropdownMenuItem>
                     ))
                   ) : (
                     <div className="p-8 text-center text-xs text-muted-foreground italic">No notifications</div>
                   )}
                 </ScrollArea>
               </DropdownMenuContent>
             </DropdownMenu>
             
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted/50 rounded-full">
                   <Avatar className="h-8 w-8 border">
                     <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                     <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <div className="hidden lg:block text-left">
                     <p className="text-xs font-bold leading-none">{profile.name}</p>
                     <p className="text-[10px] text-muted-foreground mt-0.5">{profile.email}</p>
                   </div>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56">
                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => setIsEditingProfile(true)}>
                   <User className="w-4 h-4 mr-2" /> Edit Profile
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setView('settings')}>
                   <Settings className="w-4 h-4 mr-2" /> Settings
                 </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="text-destructive">
                   <LogOut className="w-4 h-4 mr-2" /> Log out
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {view === 'planner' && (
            <div className="flex h-full gap-8 p-8 overflow-hidden">
              <div className="w-full lg:w-[400px] h-full shrink-0">
                <Timeline tasks={tasks} />
              </div>

              <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-hidden">
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
                              onEdit={setEditingTask}
                              onDelete={deleteTask}
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

              <aside className="w-80 hidden xl:block shrink-0 overflow-y-auto pr-1">
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
                  </div>
                </div>
              </aside>
            </div>
          )}

          {view === 'dashboard' && (
            <ScrollArea className="h-full">
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-wider">
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
                      <CardTitle className="text-xs font-bold text-accent flex items-center gap-2 uppercase tracking-wider">
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
                  <Card className="bg-green-50/5 border-green-200/50 dark:bg-green-500/5 dark:border-green-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-bold text-green-600 flex items-center gap-2 uppercase tracking-wider">
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
                    <div className="bg-card border rounded-xl divide-y overflow-hidden shadow-sm">
                      {tasks.slice(0, 5).map(task => (
                        <div key={task.id} className="p-4 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={cn("w-2 h-2 rounded-full shrink-0", task.isCompleted ? "bg-green-500" : "bg-primary")} />
                            <span className={cn("truncate", task.isCompleted && "line-through text-muted-foreground")}>{task.name}</span>
                          </div>
                          <Badge variant="outline" className="text-[9px] shrink-0">{task.category || 'General'}</Badge>
                        </div>
                      ))}
                      {tasks.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground text-xs italic">
                          No tasks created yet.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold">Calendar Quick-View</h3>
                    <div className="bg-card border rounded-xl p-6 flex justify-center shadow-sm">
                      <Calendar mode="single" selected={today} className="rounded-md border" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          {view === 'categories' && (
            <ScrollArea className="h-full">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map(cat => {
                    const catTasks = tasks.filter(t => (t.category || 'General') === cat);
                    const completedCount = catTasks.filter(t => t.isCompleted).length;
                    const percent = catTasks.length > 0 ? (completedCount / catTasks.length) * 100 : 0;
                    
                    return (
                      <Card key={cat} className="group hover:border-primary/40 transition-all cursor-pointer shadow-sm">
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
                              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
                            </div>
                            <div className="pt-2">
                              {catTasks.slice(0, 3).map(t => (
                                <div key={t.id} className="text-[10px] py-1 border-t flex items-center gap-2">
                                  <div className={cn("w-1 h-1 rounded-full shrink-0", t.isCompleted ? "bg-green-500" : "bg-primary")} />
                                  <span className="truncate flex-1">{t.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {categories.length === 0 && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground italic opacity-50">
                      Create tasks with categories to see them grouped here.
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}

          {view === 'calendar' && (
            <div className="h-full flex flex-col p-8">
              <div className="flex-1 bg-card border rounded-2xl flex flex-col overflow-hidden shadow-sm">
                <div className="p-6 border-b flex items-center justify-between bg-muted/10">
                  <h3 className="text-lg font-bold">Monthly Overview</h3>
                  <div className="flex gap-2">
                     <Button variant="outline" size="sm" onClick={() => setToday(new Date())}>Today</Button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col lg:flex-row gap-8 p-8 overflow-hidden">
                   <div className="shrink-0 flex justify-center">
                      <Calendar 
                        mode="single" 
                        selected={today} 
                        onSelect={(date) => date && setToday(date)}
                        className="border rounded-xl shadow-sm bg-card" 
                      />
                   </div>
                   <div className="flex-1 space-y-4 min-w-0 flex flex-col">
                      <h4 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        Upcoming Deadlines
                      </h4>
                      <ScrollArea className="flex-1">
                        <div className="space-y-3">
                          {tasks.filter(t => t.dueDate && !t.isCompleted).length > 0 ? (
                            tasks.filter(t => t.dueDate && !t.isCompleted).map(t => (
                              <div key={t.id} className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                                <div className="space-y-1 overflow-hidden">
                                  <p className="text-xs font-bold truncate">{t.name}</p>
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    Due: {t.dueDate}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-[9px] uppercase tracking-wider shrink-0 ml-2">{t.priority}</Badge>
                              </div>
                            ))
                          ) : (
                            <div className="h-32 flex items-center justify-center text-xs text-muted-foreground italic">
                              No upcoming deadlines.
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                   </div>
                </div>
              </div>
            </div>
          )}

          {view === 'settings' && (
            <ScrollArea className="h-full">
              <div className="p-8 max-w-2xl mx-auto space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Appearance & Theme</CardTitle>
                    <CardDescription>Customize how DayPilot looks on your screen.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-bold">Dark Mode</Label>
                        <p className="text-xs text-muted-foreground">Toggle between light and dark themes.</p>
                      </div>
                      <Switch 
                        checked={isDarkMode} 
                        onCheckedChange={toggleDarkMode} 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Work Schedule</CardTitle>
                    <CardDescription>Configure your daily work hours and AI scheduling constraints.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start">Work Day Start</Label>
                        <Input 
                          id="start" 
                          type="time" 
                          value={preferences.workDayStart} 
                          onChange={(e) => setPreferences({...preferences, workDayStart: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end">Work Day End</Label>
                        <Input 
                          id="end" 
                          type="time" 
                          value={preferences.workDayEnd} 
                          onChange={(e) => setPreferences({...preferences, workDayEnd: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Break Times</Label>
                        <Button variant="outline" size="sm" className="h-8" onClick={() => {
                          setPreferences({
                            ...preferences,
                            preferredBreaks: [...preferences.preferredBreaks, { start: "12:00", durationMinutes: 30 }]
                          })
                        }}>
                          <Plus className="w-4 h-4 mr-2" /> Add Break
                        </Button>
                      </div>
                      
                      {preferences.preferredBreaks.length > 0 ? (
                        preferences.preferredBreaks.map((breakItem, idx) => (
                          <div key={idx} className="flex items-end gap-4 p-3 border rounded-lg bg-muted/20">
                            <div className="flex-1 space-y-1.5">
                              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Start Time</Label>
                              <Input 
                                type="time" 
                                value={breakItem.start} 
                                onChange={(e) => {
                                  const newBreaks = [...preferences.preferredBreaks];
                                  newBreaks[idx].start = e.target.value;
                                  setPreferences({...preferences, preferredBreaks: newBreaks});
                                }}
                              />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Duration (min)</Label>
                              <Input 
                                type="number" 
                                value={breakItem.durationMinutes} 
                                onChange={(e) => {
                                  const newBreaks = [...preferences.preferredBreaks];
                                  newBreaks[idx].durationMinutes = parseInt(e.target.value) || 0;
                                  setPreferences({...preferences, preferredBreaks: newBreaks});
                                }}
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:bg-destructive/10 shrink-0"
                              onClick={() => {
                                setPreferences({
                                  ...preferences,
                                  preferredBreaks: preferences.preferredBreaks.filter((_, i) => i !== idx)
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg border border-dashed">
                          No breaks scheduled. Add one to optimize your AI plan.
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <Button className="w-full gap-2 shadow-sm" onClick={() => savePreferences(preferences)}>
                      <Save className="w-4 h-4" /> Save Preferences
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                    <CardDescription>Update your personal details and public profile.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 border shadow-sm">
                        <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                        <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold truncate">{profile.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
                    </div>
                    {profile.bio && (
                      <div className="p-3 bg-muted/20 rounded-lg border text-xs text-muted-foreground">
                        {profile.bio}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Modify your task details and priorities here.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Task Name</Label>
                <Input 
                  id="name" 
                  value={editingTask.name || ''} 
                  onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={editingTask.description || ''} 
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={editingTask.priority} 
                    onValueChange={(val: Priority) => setEditingTask({...editingTask, priority: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input 
                    id="duration" 
                    type="number"
                    value={editingTask.estimatedTimeMinutes || 0} 
                    onChange={(e) => setEditingTask({...editingTask, estimatedTimeMinutes: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  value={editingTask.category || ''} 
                  onChange={(e) => setEditingTask({...editingTask, category: e.target.value})}
                  placeholder="e.g. Work, Health, Personal"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
            <Button onClick={() => editingTask && updateTask(editingTask)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information and profile picture.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input 
                id="profile-name" 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-email">Email Address</Label>
              <Input 
                id="profile-email" 
                type="email"
                value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-avatar">Avatar URL</Label>
              <Input 
                id="profile-avatar" 
                value={profile.avatarUrl} 
                onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-bio">Short Bio</Label>
              <Textarea 
                id="profile-bio" 
                value={profile.bio || ''} 
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
            <Button onClick={() => saveProfile(profile)}>Save Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
