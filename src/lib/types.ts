export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'postponed';

export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: Priority;
  estimatedTimeMinutes: number;
  isCompleted: boolean;
  status: TaskStatus;
  category?: string;
  dueDate?: string;
  scheduledStartTime?: string; // HH:MM
  scheduledEndTime?: string; // HH:MM
}

export interface UserPreferences {
  workDayStart: string; // HH:MM
  workDayEnd: string; // HH:MM
  preferredBreaks: Array<{
    start: string;
    durationMinutes: number;
  }>;
}