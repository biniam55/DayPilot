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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  const [today, setToday] = useState<Date | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Plan Ready', description: 'AI has optimized your schedule for today.', time: '5m ago', isRead: false },
    { id: '2', title: 'Welcome!', description: 'Glad to have you on DayPilot.', time: '1h ago', isRead: true }
  ]);

  useEffect(() => {
    setToday(new Date());
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (typeof document !== 'undefined') {
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const addTask = (name: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      priority: 'medium',
      estimatedTimeMinutes: 30,
      isCompleted: false,
      status: 'todo',
      category: 'General',
      description: '',
    };
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task created",
      description: `"${name}" has been added.`,
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
    toast({
      title: "Task updated",
      description: "Changes saved successfully.",
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    toast({
      variant: "destructive",
      title: "Task deleted",
      description: `"${taskToDelete?.name}" removed.`,
    });
  };

  const toggleTaskComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = !task.isCompleted;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: newStatus, status: newStatus ? 'completed' : 'todo' } : t));
    
    if (newStatus) {
      toast({
        title: "Task Completed",
        description: `Great job on "${task.name}"!`,
      });
      setNotifications(prev => [{
        id: Math.random().toString(36).substring(2, 11),
        title: 'Task Completed',
        description: `You finished "${task.name}".`,
        time: 'Just now',
        isRead: false
      }, ...prev]);
    }
  };

  const handleScheduleUpdate = (scheduledTasks: Task[]) => {
    setTasks(scheduledTasks);
    toast({
      title: "Schedule Optimized",
      description: "AI has re-organized your day.",
    });
  };

  const savePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    toast({
      title: "Settings saved",
      description: "Preferences updated.",
    });
  };

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Saved successfully.",
    });
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
      <aside className="w-64 border-r bg-card hidden md:flex flex-col shrink-0">
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
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-20">
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
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={toggleDarkMode}>
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
                 <DropdownMenuLabel>Notifications</DropdownMenuLabel>
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
                   </div>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56">
                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => setIsEditingProfile(true)}>
                   <User className="w-4 h-4 mr-2" /> Edit Profile
                 </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="text-destructive">
                   <LogOut className="w-4 h-4 mr-2" /> Log out
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-hidden relative">
          {view === 'planner' && (
            <div className="flex h-full gap-8 p-8 overflow-hidden">
              <div className="w-full lg:w-[400px] h-full shrink-0 min-h-0">
                <Timeline tasks={tasks} />
              </div>

              <div className="flex-1 flex flex-col gap-6 min-w-0 h-full">
                <QuickTaskInput onAdd={addTask} />
                <div className="flex-1 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden min-h-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 py-4 border-b flex items-center justify-between gap-4 shrink-0">
                      <TabsList className="bg-muted/50 h-9 p-1">
                        <TabsTrigger value="all" className="text-xs px-4 rounded-md">All</TabsTrigger>
                        <TabsTrigger value="todo" className="text-xs px-4 rounded-md">To-Do</TabsTrigger>
                        <TabsTrigger value="completed" className="text-xs px-4 rounded-md">Done</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value={activeTab} className="flex-1 min-h-0 m-0 relative">
                      <ScrollArea className="h-full">
                        <div className="p-6 space-y-4 pb-20">
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
                              <p className="text-sm font-medium">No tasks found</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <aside className="w-80 hidden xl:flex flex-col gap-6 shrink-0 h-full overflow-y-auto">
                <AIScheduleAssistant 
                  tasks={tasks} 
                  preferences={preferences} 
                  onScheduleUpdate={handleScheduleUpdate} 
                />
              </aside>
            </div>
          )}

          {view === 'dashboard' && (
            <ScrollArea className="h-full">
              <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" /> Tasks Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{tasks.filter(t => t.isCompleted).length}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          )}

          {view === 'categories' && (
            <ScrollArea className="h-full">
              <div className="p-8 pb-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map(cat => (
                    <Card key={cat} className="group hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                      <CardHeader className="pb-2">
                        <Badge variant="secondary" className="w-fit">{cat}</Badge>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}

          {view === 'calendar' && (
            <ScrollArea className="h-full">
              <div className="p-8 pb-20 max-w-7xl mx-auto">
                <div className="bg-card border rounded-2xl p-8 flex flex-col lg:flex-row gap-8 shadow-sm">
                  <Calendar mode="single" selected={today || undefined} className="border rounded-xl shadow-sm bg-card" />
                </div>
              </div>
            </ScrollArea>
          )}

          {view === 'settings' && (
            <ScrollArea className="h-full">
              <div className="p-8 max-w-2xl mx-auto space-y-6 pb-20">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                      <Label>Dark Mode</Label>
                      <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                   <CardHeader>
                    <CardTitle>Work Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start</Label>
                        <Input type="time" value={preferences.workDayStart} onChange={(e) => setPreferences({...preferences, workDayStart: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>End</Label>
                        <Input type="time" value={preferences.workDayEnd} onChange={(e) => setPreferences({...preferences, workDayEnd: e.target.value})} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => savePreferences(preferences)}>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      {/* Dialogs */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={editingTask.name || ''} onChange={(e) => setEditingTask({...editingTask, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={editingTask.description || ''} onChange={(e) => setEditingTask({...editingTask, description: e.target.value})} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
            <Button onClick={() => editingTask && updateTask(editingTask)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => saveProfile(profile)}>Save Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}