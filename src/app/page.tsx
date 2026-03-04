
"use client"

import React, { useState, useEffect, useMemo } from 'react';
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
  Bell, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Plus, 
  User, 
  LogOut,
  Moon,
  Sun,
  TrendingUp,
  AlertTriangle,
  History,
  Menu,
  Loader2
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from "recharts";
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

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
    name: 'Weekly Sync',
    description: 'Discuss milestones with the team.',
    priority: 'high',
    estimatedTimeMinutes: 45,
    isCompleted: false,
    status: 'todo',
    category: 'Work',
  },
  {
    id: '4',
    name: 'Gym session',
    description: 'Cardio and strength training.',
    priority: 'medium',
    estimatedTimeMinutes: 90,
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
  const router = useRouter();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState('all');
  const [view, setView] = useState<'dashboard' | 'planner' | 'categories' | 'calendar' | 'settings'>('dashboard');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Plan Ready', description: 'AI has optimized your schedule for today.', time: '5m ago', isRead: false },
    { id: '2', title: 'Welcome!', description: 'Glad to have you on DayPilot.', time: '1h ago', isRead: true }
  ]);

  useEffect(() => {
    setToday(new Date());
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  // Sync profile state with Firebase User if available
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        avatarUrl: user.photoURL || prev.avatarUrl,
      }));
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
    }
  };

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

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.isCompleted).length;
    const total = tasks.length;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.isCompleted).length;
    const estimatedMinutes = tasks.filter(t => !t.isCompleted).reduce((acc, t) => acc + t.estimatedTimeMinutes, 0);
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, highPriority, estimatedMinutes, progress };
  }, [tasks]);

  const chartData = useMemo(() => {
    const priorities = { high: 0, medium: 0, low: 0 };
    tasks.forEach(t => { priorities[t.priority]++; });
    return [
      { name: 'High', value: priorities.high, color: 'hsl(var(--destructive))' },
      { name: 'Medium', value: priorities.medium, color: 'hsl(var(--accent))' },
      { name: 'Low', value: priorities.low, color: 'hsl(var(--primary))' },
    ];
  }, [tasks]);

  const categories = Array.from(new Set(tasks.map(t => t.category || 'General')));

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const NavContent = () => (
    <>
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold italic shadow-lg">
          D
        </div>
        <h1 className="text-xl font-bold tracking-tight text-primary">DayPilot</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'planner', icon: Compass, label: 'My Planner' },
          { id: 'categories', icon: ListTodo, label: 'Categories' },
          { id: 'calendar', icon: CalendarIcon, label: 'Calendar' }
        ].map((item) => (
          <Button 
            key={item.id}
            variant="ghost" 
            onClick={() => {
              setView(item.id as any);
              setIsMobileMenuOpen(false);
            }}
            className={cn("w-full justify-start gap-3 h-10 text-sm font-medium", view === item.id ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary")}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-muted/40 rounded-xl border border-muted">
          <p className="text-xs font-semibold mb-2">Weekly Goal</p>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-accent transition-all duration-500" 
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            {stats.completed} tasks completed ({stats.progress}%)
          </p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => {
            setView('settings');
            setIsMobileMenuOpen(false);
          }}
          className={cn("w-full justify-start gap-3 mt-4 h-10 text-sm font-medium", view === 'settings' ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary")}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Sidebar Navigation - Desktop */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col shrink-0">
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-card border-r">
                <NavContent />
              </SheetContent>
            </Sheet>
            <h2 className="text-sm sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none">
              {view === 'planner' && 'Daily Plan'}
              {view === 'dashboard' && 'Dashboard'}
              {view === 'categories' && 'Categories'}
              {view === 'calendar' && 'Calendar'}
              {view === 'settings' && 'Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
             <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" onClick={toggleDarkMode}>
               {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </Button>

             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
                   <Bell className="w-4 h-4" />
                   {notifications.some(n => !n.isRead) && (
                     <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
                   )}
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-72 sm:w-80">
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
                 <Button variant="ghost" className="flex items-center gap-2 px-1 sm:px-2 hover:bg-muted/50 rounded-full">
                   <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border">
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
                 <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                   <LogOut className="w-4 h-4 mr-2" /> Log out
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-hidden relative">
          {view === 'planner' && (
            <div className="flex flex-col lg:flex-row h-full gap-4 sm:gap-8 p-4 sm:p-8 overflow-hidden">
              <div className="w-full lg:w-[350px] xl:w-[400px] h-[300px] lg:h-full shrink-0 min-h-0">
                <Timeline tasks={tasks} />
              </div>

              <div className="flex-1 flex flex-col gap-4 sm:gap-6 min-w-0 h-full">
                <QuickTaskInput onAdd={addTask} />
                <div className="flex-1 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden min-h-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 m-0">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between gap-4 shrink-0">
                      <TabsList className="bg-muted/50 h-8 sm:h-9 p-1">
                        <TabsTrigger value="all" className="text-[10px] sm:text-xs px-2 sm:px-4 rounded-md">All</TabsTrigger>
                        <TabsTrigger value="todo" className="text-[10px] sm:text-xs px-2 sm:px-4 rounded-md">To-Do</TabsTrigger>
                        <TabsTrigger value="completed" className="text-[10px] sm:text-xs px-2 sm:px-4 rounded-md">Done</TabsTrigger>
                      </TabsList>
                      <div className="lg:hidden">
                        <Dialog>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] sm:text-xs gap-1">
                              <TrendingUp className="w-3 h-3" />
                              AI Tips
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-full sm:w-[400px] p-6">
                             <AIScheduleAssistant 
                              tasks={tasks} 
                              preferences={preferences} 
                              onScheduleUpdate={handleScheduleUpdate} 
                            />
                          </SheetContent>
                        </Dialog>
                      </div>
                    </div>

                    <TabsContent value={activeTab} className="flex-1 min-h-0 m-0 relative">
                      <ScrollArea className="h-full">
                        <div className="p-4 sm:p-6 space-y-4 pb-20">
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
                            <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-center opacity-40">
                              <ListTodo className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                              <p className="text-xs sm:text-sm font-medium">No tasks found</p>
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
              <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-20">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <Card className="bg-primary/5 border-primary/20 shadow-sm">
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
                      <CardTitle className="text-[10px] sm:text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" /> Completion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                      <p className="text-2xl sm:text-3xl font-bold">{stats.progress}%</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">{stats.completed} / {stats.total} tasks done</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-destructive/5 border-destructive/20 shadow-sm">
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
                      <CardTitle className="text-[10px] sm:text-xs font-bold text-destructive flex items-center gap-2 uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" /> High Priority
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                      <p className="text-2xl sm:text-3xl font-bold">{stats.highPriority}</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">Critical tasks pending</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-accent/5 border-accent/20 shadow-sm">
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
                      <CardTitle className="text-[10px] sm:text-xs font-bold text-accent-foreground flex items-center gap-2 uppercase tracking-wider">
                        <Clock className="w-4 h-4" /> Time Required
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                      <p className="text-2xl sm:text-3xl font-bold">{Math.floor(stats.estimatedMinutes / 60)}h {stats.estimatedMinutes % 60}m</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">Remaining for today</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30 border-muted shadow-sm">
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
                      <CardTitle className="text-[10px] sm:text-xs font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4" /> Productivity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                      <p className="text-2xl sm:text-3xl font-bold">Good</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">Steady pace maintained</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts and Details Section */}
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
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-card border p-2 rounded-lg shadow-lg text-[10px]">
                                    <p className="font-bold">{payload[0].payload.name}</p>
                                    <p>{payload[0].value} Tasks</p>
                                  </div>
                                );
                              }
                              return null;
                            }} 
                          />
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
                        {tasks.slice(0, 4).map((task) => (
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
                      <Button variant="ghost" className="w-full text-[10px] sm:text-xs h-8 text-muted-foreground" onClick={() => setView('planner')}>
                        View all activity
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          )}

          {view === 'categories' && (
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-8 pb-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {categories.map(cat => {
                    const catTasks = tasks.filter(t => (t.category || 'General') === cat);
                    const completed = catTasks.filter(t => t.isCompleted).length;
                    const total = catTasks.length;
                    const progress = total > 0 ? (completed / total) * 100 : 0;

                    return (
                      <Card key={cat} className="group hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
                          <div className="flex justify-between items-center mb-1">
                             <Badge variant="secondary" className="w-fit text-[9px] sm:text-[10px] px-1.5 py-0">{cat}</Badge>
                             <span className="text-[10px] text-muted-foreground font-medium">{completed}/{total}</span>
                          </div>
                          <CardTitle className="text-xs sm:text-sm font-bold">{cat} Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-3">
                            <div 
                              className="h-full bg-primary transition-all duration-500" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="space-y-2">
                            {catTasks.slice(0, 3).map(t => (
                              <div key={t.id} className="flex items-center gap-2">
                                <CheckCircle2 className={cn("w-3 h-3 shrink-0", t.isCompleted ? "text-primary" : "text-muted")} />
                                <span className={cn("text-[10px] sm:text-[11px] truncate", t.isCompleted && "line-through text-muted-foreground")}>{t.name}</span>
                              </div>
                            ))}
                            {total > 3 && <p className="text-[9px] text-muted-foreground italic pl-5">+{total - 3} more...</p>}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          )}

          {view === 'calendar' && (
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-8 pb-20 max-w-7xl mx-auto">
                <div className="bg-card border rounded-2xl p-4 sm:p-8 flex flex-col lg:flex-row gap-6 sm:gap-8 shadow-sm">
                  <div className="flex-1 overflow-x-auto">
                    <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" /> Full Calendar
                    </h3>
                    <div className="flex justify-center">
                      <Calendar 
                        mode="single" 
                        selected={today || undefined} 
                        onSelect={(date) => date && setToday(date)}
                        className="border rounded-xl shadow-sm bg-card max-w-full" 
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-80 shrink-0">
                    <h4 className="text-xs sm:text-sm font-bold mb-4">Upcoming Deadlines</h4>
                    <div className="space-y-4">
                      {tasks.filter(t => !t.isCompleted && t.dueDate).map(task => (
                        <div key={task.id} className="p-3 bg-muted/30 rounded-lg border border-muted flex flex-col gap-1">
                          <span className="text-[11px] sm:text-xs font-bold truncate">{task.name}</span>
                          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-muted-foreground">
                            <CalendarIcon className="w-3 h-3" />
                            {task.dueDate}
                          </div>
                        </div>
                      ))}
                      {tasks.filter(t => !t.isCompleted && t.dueDate).length === 0 && (
                        <div className="text-center py-8 text-[10px] text-muted-foreground italic">
                          No upcoming deadlines
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          {view === 'settings' && (
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6 pb-20">
                <Card className="shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Profile Settings</CardTitle>
                    <CardDescription className="text-[10px] sm:text-xs">Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-center sm:text-left">
                      <p className="font-bold text-sm sm:text-base">{profile.name}</p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">{profile.email}</p>
                      <Button variant="outline" size="sm" className="mt-2 h-8 text-[10px] sm:text-xs" onClick={() => setIsEditingProfile(true)}>
                        Change Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Appearance</CardTitle>
                    <CardDescription className="text-[10px] sm:text-xs">Customize how DayPilot looks</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/20 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        <Label className="text-xs sm:text-sm">Dark Mode</Label>
                      </div>
                      <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                   <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg text-primary">Work Schedule</CardTitle>
                    <CardDescription className="text-[10px] sm:text-xs">Used by AI to optimize your planner</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">Start of Day</Label>
                        <Input type="time" className="text-xs" value={preferences.workDayStart} onChange={(e) => setPreferences({...preferences, workDayStart: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">End of Day</Label>
                        <Input type="time" className="text-xs" value={preferences.workDayEnd} onChange={(e) => setPreferences({...preferences, workDayEnd: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">Preferred Breaks</Label>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => {
                          const newBreaks = [...preferences.preferredBreaks, { start: "12:00", durationMinutes: 30 }];
                          setPreferences({...preferences, preferredBreaks: newBreaks});
                        }}>
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {preferences.preferredBreaks.map((breakItem, idx) => (
                          <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg border">
                            <Input type="time" value={breakItem.start} className="h-8 text-[10px] w-24" onChange={(e) => {
                              const newBreaks = [...preferences.preferredBreaks];
                              newBreaks[idx].start = e.target.value;
                              setPreferences({...preferences, preferredBreaks: newBreaks});
                            }} />
                            <Input type="number" value={breakItem.durationMinutes} className="h-8 text-[10px] w-16 sm:w-20" onChange={(e) => {
                              const newBreaks = [...preferences.preferredBreaks];
                              newBreaks[idx].durationMinutes = parseInt(e.target.value);
                              setPreferences({...preferences, preferredBreaks: newBreaks});
                            }} />
                            <span className="text-[8px] sm:text-[10px] text-muted-foreground uppercase font-bold">min</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto text-destructive" onClick={() => {
                              const newBreaks = preferences.preferredBreaks.filter((_, i) => i !== idx);
                              setPreferences({...preferences, preferredBreaks: newBreaks});
                            }}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        {preferences.preferredBreaks.length === 0 && (
                          <div className="text-center p-4 border border-dashed rounded-lg text-[10px] text-muted-foreground italic">
                            No breaks scheduled
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 p-4 sm:p-6">
                    <Button onClick={() => savePreferences(preferences)} className="w-full text-xs sm:text-sm">Save Work Schedule</Button>
                  </CardFooter>
                </Card>
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      {/* Dialogs */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="w-[90vw] sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription className="text-[11px] sm:text-xs">Modify task details and scheduling constraints.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-4 py-2 sm:py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-[11px] sm:text-xs">Task Name</Label>
                <Input id="name" className="text-xs" value={editingTask.name || ''} onChange={(e) => setEditingTask({...editingTask, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-[11px] sm:text-xs">Description</Label>
                <Textarea id="description" className="text-xs" value={editingTask.description || ''} onChange={(e) => setEditingTask({...editingTask, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                  <Label className="text-[11px] sm:text-xs">Priority</Label>
                  <Select value={editingTask.priority} onValueChange={(val: Priority) => setEditingTask({...editingTask, priority: val})}>
                    <SelectTrigger className="text-[11px] sm:text-xs h-9">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[11px] sm:text-xs">Duration (min)</Label>
                  <Input type="number" className="text-xs h-9" value={editingTask.estimatedTimeMinutes} onChange={(e) => setEditingTask({...editingTask, estimatedTimeMinutes: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-[11px] sm:text-xs">Category</Label>
                <Input className="text-xs" value={editingTask.category || ''} onChange={(e) => setEditingTask({...editingTask, category: e.target.value})} />
              </div>
            </div>
          )}
          <DialogFooter className="flex-row gap-2 sm:gap-0">
            <Button variant="outline" className="flex-1 sm:flex-none text-xs" onClick={() => setEditingTask(null)}>Cancel</Button>
            <Button className="flex-1 sm:flex-none text-xs" onClick={() => editingTask && updateTask(editingTask)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="w-[90vw] sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription className="text-[11px] sm:text-xs">Personalize your DayPilot experience.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:py-4">
            <div className="grid gap-2">
              <Label className="text-[11px] sm:text-xs">Full Name</Label>
              <Input className="text-xs" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label className="text-[11px] sm:text-xs">Email Address</Label>
              <Input className="text-xs" type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label className="text-[11px] sm:text-xs">Profile Bio</Label>
              <Textarea className="text-xs" value={profile.bio || ''} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label className="text-[11px] sm:text-xs">Avatar URL</Label>
              <Input className="text-xs" value={profile.avatarUrl} onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full text-xs" onClick={() => saveProfile(profile)}>Save Profile Info</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
