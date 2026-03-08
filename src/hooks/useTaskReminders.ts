import { useEffect, useCallback, useRef, useState } from 'react';
import { Task } from '@/lib/types';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type?: 'info' | 'update' | 'success' | 'reminder';
}

interface UseTaskRemindersProps {
  tasks: Task[];
  onNotification: (notification: Notification) => void;
  onToast: (toast: { title: string; description: string }) => void;
}

export function useTaskReminders({ tasks, onNotification, onToast }: UseTaskRemindersProps) {
  const notifiedTasksRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkTaskReminders = useCallback(() => {
    // Only run on client side
    if (!isClient) return;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    tasks.forEach(task => {
      // Skip completed tasks
      if (task.isCompleted) return;
      
      // Check if task has a scheduled start time
      if (task.scheduledStartTime) {
        const taskKey = `${task.id}-${task.scheduledStartTime}`;
        
        // Skip if already notified
        if (notifiedTasksRef.current.has(taskKey)) return;
        
        // Parse task time
        const [taskHour, taskMinute] = task.scheduledStartTime.split(':').map(Number);
        const taskTime = new Date(now);
        taskTime.setHours(taskHour, taskMinute, 0, 0);
        
        // Calculate time difference in minutes
        const diffMs = taskTime.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        
        // Notify 15 minutes before task starts
        if (diffMinutes === 15) {
          const notification: Notification = {
            id: `reminder-${task.id}-15`,
            title: '⏰ Task Starting Soon',
            description: `"${task.name}" starts in 15 minutes at ${task.scheduledStartTime}`,
            time: 'Just now',
            isRead: false,
            type: 'reminder'
          };
          
          onNotification(notification);
          onToast({
            title: '⏰ Reminder',
            description: `"${task.name}" starts in 15 minutes`
          });
          
          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⏰ Task Starting Soon', {
              body: `"${task.name}" starts in 15 minutes`,
              icon: '/favicon.ico',
              tag: `reminder-${task.id}`
            });
          }
          
          notifiedTasksRef.current.add(taskKey);
        }
        
        // Notify 5 minutes before task starts
        if (diffMinutes === 5) {
          const notification: Notification = {
            id: `reminder-${task.id}-5`,
            title: '🔔 Task Starting Very Soon',
            description: `"${task.name}" starts in 5 minutes at ${task.scheduledStartTime}`,
            time: 'Just now',
            isRead: false,
            type: 'reminder'
          };
          
          onNotification(notification);
          onToast({
            title: '🔔 Urgent Reminder',
            description: `"${task.name}" starts in 5 minutes`
          });
          
          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🔔 Task Starting Very Soon', {
              body: `"${task.name}" starts in 5 minutes`,
              icon: '/favicon.ico',
              tag: `reminder-${task.id}-5`,
              requireInteraction: true
            });
          }
          
          notifiedTasksRef.current.add(`${taskKey}-5min`);
        }
        
        // Notify when task should start
        if (diffMinutes === 0) {
          const notification: Notification = {
            id: `reminder-${task.id}-now`,
            title: '🚀 Task Starting Now',
            description: `Time to start "${task.name}"!`,
            time: 'Just now',
            isRead: false,
            type: 'reminder'
          };
          
          onNotification(notification);
          onToast({
            title: '🚀 Start Task',
            description: `Time to start "${task.name}"!`
          });
          
          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🚀 Task Starting Now', {
              body: `Time to start "${task.name}"!`,
              icon: '/favicon.ico',
              tag: `reminder-${task.id}-now`,
              requireInteraction: true
            });
          }
          
          notifiedTasksRef.current.add(`${taskKey}-now`);
        }
      }
      
      // Check for overdue tasks with due dates
      if (task.dueDate && !task.isCompleted) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const overdueKey = `overdue-${task.id}-${task.dueDate}`;
        
        // Notify if task is due today
        if (daysDiff === 0 && !notifiedTasksRef.current.has(overdueKey)) {
          const notification: Notification = {
            id: `due-${task.id}`,
            title: '📅 Task Due Today',
            description: `"${task.name}" is due today!`,
            time: 'Just now',
            isRead: false,
            type: 'reminder'
          };
          
          onNotification(notification);
          
          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('📅 Task Due Today', {
              body: `"${task.name}" is due today!`,
              icon: '/favicon.ico',
              tag: `due-${task.id}`
            });
          }
          
          notifiedTasksRef.current.add(overdueKey);
        }
        
        // Notify if task is overdue
        if (daysDiff < 0 && !notifiedTasksRef.current.has(overdueKey)) {
          const notification: Notification = {
            id: `overdue-${task.id}`,
            title: '⚠️ Task Overdue',
            description: `"${task.name}" was due ${Math.abs(daysDiff)} day(s) ago!`,
            time: 'Just now',
            isRead: false,
            type: 'reminder'
          };
          
          onNotification(notification);
          
          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⚠️ Task Overdue', {
              body: `"${task.name}" was due ${Math.abs(daysDiff)} day(s) ago!`,
              icon: '/favicon.ico',
              tag: `overdue-${task.id}`
            });
          }
          
          notifiedTasksRef.current.add(overdueKey);
        }
      }
    });
  }, [tasks, onNotification, onToast, isClient]);

  useEffect(() => {
    // Only run on client side
    if (!isClient) return;
    
    // Check immediately
    checkTaskReminders();
    
    // Check every minute
    intervalRef.current = setInterval(checkTaskReminders, 60000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkTaskReminders, isClient]);

  // Request notification permission on mount (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isClient]);

  return null;
}
