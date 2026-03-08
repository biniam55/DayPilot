import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, UserPreferences, UserProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { useTaskReminders } from "@/hooks/useTaskReminders";
import { INITIAL_TASKS, DEFAULT_PREFERENCES, DEFAULT_PROFILE, INITIAL_NOTIFICATIONS } from "@/lib/constants";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type?: 'info' | 'update' | 'success';
  action?: () => void;
  actionLabel?: string;
}

export function useDashboardState() {
  const { toast } = useToast();
  const { newVersionAvailable, reloadApp } = useVersionCheck();
  const [tasks, setTasks] = useLocalStorage<Task[]>('daypilot-tasks', INITIAL_TASKS);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('daypilot-preferences', DEFAULT_PREFERENCES);
  const [profile, setProfile] = useLocalStorage<UserProfile>('daypilot-profile', DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState('all');
  const [view, setView] = useState<'dashboard' | 'planner' | 'categories' | 'calendar' | 'analytics' | 'settings'>('dashboard');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [isClient, setIsClient] = useState(false);
  const [celebrateCompletionCallback, setCelebrateCompletionCallback] = useState<((taskName: string) => void) | null>(null);

  // Add notification handler for task reminders
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  // Initialize task reminders only on client (disabled to prevent dependency issues)
  // useTaskReminders({
  //   tasks: isClient ? tasks : [],
  //   onNotification: addNotification,
  //   onToast: toast
  // });

  // Add update notification when new version is available
  useEffect(() => {
    if (newVersionAvailable) {
      const updateNotification: Notification = {
        id: 'update-available',
        title: '🎉 Update Available',
        description: 'A new version of DayPilot is ready. Tap to update now!',
        time: 'Just now',
        isRead: false,
        type: 'update',
        action: reloadApp,
        actionLabel: 'Update Now'
      };

      setNotifications(prev => {
        // Check if update notification already exists
        const hasUpdate = prev.some(n => n.id === 'update-available');
        if (hasUpdate) return prev;
        return [updateNotification, ...prev];
      });

      toast({
        title: "Update Available",
        description: "A new version is ready. Check notifications to update!",
        duration: 5000,
      });
    }
  }, [newVersionAvailable, reloadApp, toast]);

  useEffect(() => {
    setIsClient(true);
    setToday(new Date());
    if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (typeof document !== 'undefined') {
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return newMode;
    });
  }, []);

  const addTask = useCallback((
    name: string, 
    priority: 'high' | 'medium' | 'low' = 'medium', 
    duration: number = 30,
    energyLevel?: 'high' | 'medium' | 'low',
    recurrence?: 'none' | 'daily' | 'weekly' | 'monthly'
  ) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      priority,
      estimatedTimeMinutes: duration,
      isCompleted: false,
      status: 'todo',
      category: 'General',
      description: '',
      energyLevel: energyLevel || 'medium',
      recurrence: recurrence || 'none',
      createdAt: now,
    };
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task created",
      description: `"${name}" has been added.`,
    });
  }, [setTasks, toast]);

  const addMultipleTasks = useCallback((newTasks: Task[]) => {
    setTasks(prev => [...newTasks, ...prev]);
    toast({
      title: "Template Applied",
      description: `Added ${newTasks.length} tasks from template.`,
    });
  }, [setTasks, toast]);

  const importTasks = useCallback((importedTasks: Task[]) => {
    // Filter out duplicates by ID
    setTasks(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const newTasks = importedTasks.filter(t => !existingIds.has(t.id));
      return [...prev, ...newTasks];
    });
    toast({
      title: "Tasks Imported",
      description: `Successfully imported ${importedTasks.length} tasks.`,
    });
  }, [setTasks, toast]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
    toast({
      title: "Task updated",
      description: "Changes saved successfully.",
    });
  }, [setTasks, toast]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const taskToDelete = prev.find(t => t.id === id);
      if (taskToDelete) {
        toast({
          variant: "destructive",
          title: "Task deleted",
          description: `"${taskToDelete.name}" removed.`,
        });
      }
      return prev.filter(t => t.id !== id);
    });
  }, [setTasks, toast]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      if (!task) return prev;
      
      const newStatus = !task.isCompleted;
      const updatedTasks = prev.map(t => 
        t.id === id ? { ...t, isCompleted: newStatus, status: newStatus ? 'completed' as const : 'todo' as const } : t
      );
      
      if (newStatus) {
        toast({
          title: "Task Completed",
          description: `Great job on "${task.name}"!`,
        });
        
        // Trigger browser notification celebration
        if (celebrateCompletionCallback) {
          celebrateCompletionCallback(task.name);
        }
      }
      
      return updatedTasks;
    });
  }, [setTasks, toast, celebrateCompletionCallback]);

  const handleScheduleUpdate = useCallback((scheduledTasks: Task[]) => {
    setTasks(scheduledTasks);
    toast({
      title: "Schedule Optimized",
      description: "AI has re-organized your day.",
    });
  }, [setTasks, toast]);

  const savePreferences = useCallback((newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    toast({
      title: "Settings saved",
      description: "Preferences updated.",
    });
  }, [setPreferences, toast]);

  const saveProfile = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Saved successfully.",
    });
  }, [setProfile, toast]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);

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

  return {
    tasks,
    preferences,
    profile,
    activeTab,
    view,
    editingTask,
    isEditingProfile,
    today,
    isDarkMode,
    isMobileMenuOpen,
    notifications,
    stats,
    chartData,
    setActiveTab,
    setView,
    setEditingTask,
    setIsEditingProfile,
    setToday,
    setIsMobileMenuOpen,
    setPreferences,
    setProfile,
    toggleDarkMode,
    addTask,
    addMultipleTasks,
    importTasks,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    handleScheduleUpdate,
    savePreferences,
    saveProfile,
    setCelebrateCompletionCallback,
    markNotificationRead,
  };
}
