import { useEffect, useState, useCallback } from 'react';
import { Task } from '@/lib/types';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  showTaskReminder,
  showOverdueTask,
  showTaskCompleted,
  getTimeUntilDue,
  isGoodTimeForNotification,
  NotificationPermission,
} from '@/lib/notifications';

interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  overdueAlerts: boolean;
  completionCelebrations: boolean;
  reminderMinutes: number; // Minutes before due date to remind
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  taskReminders: true,
  overdueAlerts: true,
  completionCelebrations: true,
  reminderMinutes: 30,
};

export function useNotifications(tasks: Task[]) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [notifiedTasks, setNotifiedTasks] = useState<Set<string>>(new Set());

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('notification-settings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load notification settings', e);
      }
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('notification-settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Check permission on mount
  useEffect(() => {
    if (isNotificationSupported()) {
      setPermission(getNotificationPermission());
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  }, []);

  // Check for due tasks and send reminders
  useEffect(() => {
    if (!settings.enabled || !settings.taskReminders || permission !== 'granted') {
      return;
    }

    const checkInterval = setInterval(() => {
      if (!isGoodTimeForNotification()) return;

      const now = new Date();
      const reminderThreshold = settings.reminderMinutes * 60 * 1000;

      tasks.forEach(task => {
        if (task.isCompleted || !task.dueDate) return;
        if (notifiedTasks.has(task.id)) return;

        const dueDate = new Date(task.dueDate);
        const timeUntilDue = dueDate.getTime() - now.getTime();

        // Send reminder if within threshold
        if (timeUntilDue > 0 && timeUntilDue <= reminderThreshold) {
          showTaskReminder(task.name, getTimeUntilDue(task.dueDate));
          setNotifiedTasks(prev => new Set(prev).add(task.id));
        }

        // Send overdue alert
        if (settings.overdueAlerts && timeUntilDue < 0 && timeUntilDue > -24 * 60 * 60 * 1000) {
          // Only notify once per day for overdue tasks
          const lastNotified = localStorage.getItem(`overdue-notified-${task.id}`);
          const today = new Date().toDateString();
          
          if (lastNotified !== today) {
            showOverdueTask(task.name);
            localStorage.setItem(`overdue-notified-${task.id}`, today);
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [tasks, settings, permission, notifiedTasks]);

  // Show completion celebration
  const celebrateCompletion = useCallback((taskName: string) => {
    if (settings.enabled && settings.completionCelebrations && permission === 'granted') {
      showTaskCompleted(taskName);
    }
  }, [settings, permission]);

  return {
    permission,
    settings,
    isSupported: isNotificationSupported(),
    requestPermission,
    updateSettings,
    celebrateCompletion,
  };
}
