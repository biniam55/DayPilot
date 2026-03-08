export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'postponed';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  name: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: Priority;
  estimatedTimeMinutes: number;
  actualTimeMinutes?: number; // Track actual time spent
  isCompleted: boolean;
  status: TaskStatus;
  category?: string;
  dueDate?: string;
  scheduledStartTime?: string; // HH:MM
  scheduledEndTime?: string; // HH:MM
  subtasks?: Subtask[]; // Break down large tasks
  recurrence?: RecurrenceType; // Recurring tasks
  energyLevel?: EnergyLevel; // Match to your energy
  tags?: string[]; // Flexible categorization
  parentTaskId?: string; // For subtask relationships
  completedAt?: string; // When it was completed
  createdAt?: string; // When it was created
  dependsOn?: string[]; // Task IDs that must be completed first
  blockedBy?: string[]; // Computed: tasks blocking this one
}

export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category: 'routine' | 'workflow' | 'custom';
  tasks: Omit<Task, 'id' | 'isCompleted' | 'status' | 'completedAt' | 'createdAt'>[];
  createdAt: string;
  usageCount?: number;
}

export interface UserPreferences {
  workDayStart: string; // HH:MM
  workDayEnd: string; // HH:MM
  preferredBreaks: Array<{
    start: string;
    durationMinutes: number;
  }>;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
}
