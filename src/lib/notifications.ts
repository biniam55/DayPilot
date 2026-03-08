/**
 * Browser notification utilities
 */

export type NotificationPermission = 'granted' | 'denied' | 'default';

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current notification permission
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission as NotificationPermission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission as NotificationPermission;
}

/**
 * Show a browser notification
 */
export function showNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    silent?: boolean;
    data?: any;
    onClick?: () => void;
  }
): Notification | null {
  if (!isNotificationSupported()) {
    return null;
  }
  
  if (Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notification = new Notification(title, {
      body: options?.body,
      icon: options?.icon || '/favicon.ico',
      badge: options?.badge || '/favicon.ico',
      tag: options?.tag,
      requireInteraction: options?.requireInteraction || false,
      silent: options?.silent || false,
      data: options?.data,
    });

    if (options?.onClick && typeof window !== 'undefined') {
      notification.onclick = () => {
        window.focus();
        options.onClick?.();
        notification.close();
      };
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * Schedule a notification
 */
export function scheduleNotification(
  title: string,
  delay: number,
  options?: Parameters<typeof showNotification>[1]
): number {
  if (typeof window === 'undefined') return 0;
  
  return window.setTimeout(() => {
    showNotification(title, options);
  }, delay);
}

/**
 * Cancel a scheduled notification
 */
export function cancelScheduledNotification(timerId: number): void {
  clearTimeout(timerId);
}

/**
 * Show task reminder notification
 */
export function showTaskReminder(taskName: string, dueIn: string, onClick?: () => void) {
  return showNotification('Task Reminder', {
    body: `"${taskName}" is due ${dueIn}`,
    tag: `task-reminder-${taskName}`,
    requireInteraction: true,
    onClick,
  });
}

/**
 * Show task completion notification
 */
export function showTaskCompleted(taskName: string) {
  return showNotification('Task Completed! 🎉', {
    body: `Great job completing "${taskName}"!`,
    tag: 'task-completed',
    silent: false,
  });
}

/**
 * Show overdue task notification
 */
export function showOverdueTask(taskName: string, onClick?: () => void) {
  return showNotification('Task Overdue ⚠️', {
    body: `"${taskName}" is overdue. Time to tackle it!`,
    tag: `task-overdue-${taskName}`,
    requireInteraction: true,
    onClick,
  });
}

/**
 * Show daily summary notification
 */
export function showDailySummary(completed: number, remaining: number) {
  return showNotification('Daily Summary', {
    body: `You completed ${completed} task${completed !== 1 ? 's' : ''} today. ${remaining} remaining.`,
    tag: 'daily-summary',
  });
}

/**
 * Show streak notification
 */
export function showStreakNotification(days: number) {
  return showNotification(`${days} Day Streak! 🔥`, {
    body: `You've completed tasks for ${days} consecutive days. Keep it up!`,
    tag: 'streak-notification',
  });
}

/**
 * Show focus mode notification
 */
export function showFocusModeStart(duration: number) {
  return showNotification('Focus Mode Started', {
    body: `Focus session for ${duration} minutes. Minimize distractions!`,
    tag: 'focus-mode',
    silent: true,
  });
}

/**
 * Show focus mode complete notification
 */
export function showFocusModeComplete() {
  return showNotification('Focus Session Complete! 🎯', {
    body: 'Great work! Time for a break.',
    tag: 'focus-complete',
    requireInteraction: true,
  });
}

/**
 * Check if it's a good time to show notifications (not during focus hours)
 */
export function isGoodTimeForNotification(): boolean {
  const hour = new Date().getHours();
  // Don't notify during typical sleep hours (11 PM - 7 AM)
  return hour >= 7 && hour < 23;
}

/**
 * Get time until due date in human-readable format
 */
export function getTimeUntilDue(dueDate: string): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  
  if (diffMs < 0) return 'overdue';
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) return `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  if (diffHours < 24) return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
}
