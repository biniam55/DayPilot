import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, UserPreferences, UserProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { INITIAL_TASKS, DEFAULT_PREFERENCES, DEFAULT_PROFILE, INITIAL_NOTIFICATIONS } from "@/lib/constants";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

export function useDashboardState() {
  const { toast } = useToast();
  const [tasks, setTasks] = useLocalStorage<Task[]>('daypilot-tasks', INITIAL_TASKS);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('daypilot-preferences', DEFAULT_PREFERENCES);
  const [profile, setProfile] = useLocalStorage<UserProfile>('daypilot-profile', DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState('all');
  const [view, setView] = useState<'dashboard' | 'planner' | 'categories' | 'calendar' | 'settings'>('dashboard');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
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

  const addTask = useCallback((name: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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
  }, [toast]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
    toast({
      title: "Task updated",
      description: "Changes saved successfully.",
    });
  }, [toast]);

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
  }, [toast]);

  const toggleTaskComplete = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = !task.isCompleted;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: newStatus, status: newStatus ? 'completed' : 'todo' } : t));
    
    if (newStatus) {
      toast({
        title: "Task Completed",
        description: `Great job on "${task.name}"!`,
      });
    }
  }, [tasks, toast]);

  const handleScheduleUpdate = useCallback((scheduledTasks: Task[]) => {
    setTasks(scheduledTasks);
    toast({
      title: "Schedule Optimized",
      description: "AI has re-organized your day.",
    });
  }, [toast]);

  const savePreferences = useCallback((newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    toast({
      title: "Settings saved",
      description: "Preferences updated.",
    });
  }, [toast]);

  const saveProfile = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Saved successfully.",
    });
  }, [toast]);

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
    updateTask,
    deleteTask,
    toggleTaskComplete,
    handleScheduleUpdate,
    savePreferences,
    saveProfile,
  };
}
