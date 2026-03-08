import { Task, UserPreferences, UserProfile } from "./types";

export const INITIAL_TASKS: Task[] = [
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
    energyLevel: 'high',
    subtasks: [
      { id: '1-1', name: 'Create slide outline', isCompleted: true },
      { id: '1-2', name: 'Design key visuals', isCompleted: false },
      { id: '1-3', name: 'Practice delivery', isCompleted: false },
    ],
    createdAt: '2024-03-07T10:00:00.000Z',
  },
  {
    id: '2',
    name: 'Email review',
    description: 'Clear the inbox and flag urgent items.',
    priority: 'medium',
    estimatedTimeMinutes: 30,
    actualTimeMinutes: 25,
    isCompleted: true,
    status: 'completed',
    category: 'Work',
    energyLevel: 'low',
    recurrence: 'daily',
    completedAt: '2024-03-07T09:00:00.000Z',
    createdAt: '2024-03-07T08:00:00.000Z',
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
    energyLevel: 'medium',
    recurrence: 'weekly',
    createdAt: '2024-03-07T10:00:00.000Z',
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
    energyLevel: 'high',
    recurrence: 'daily',
    subtasks: [
      { id: '4-1', name: 'Warm up (10 min)', isCompleted: false },
      { id: '4-2', name: 'Cardio (30 min)', isCompleted: false },
      { id: '4-3', name: 'Strength training (40 min)', isCompleted: false },
      { id: '4-4', name: 'Cool down (10 min)', isCompleted: false },
    ],
    createdAt: '2024-03-07T10:00:00.000Z',
  }
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  workDayStart: "09:00",
  workDayEnd: "18:00",
  preferredBreaks: [{ start: "12:30", durationMinutes: 60 }]
};

export const DEFAULT_PROFILE: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "https://picsum.photos/seed/user123/100/100",
  bio: "Productivity enthusiast and early riser."
};

export const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'Plan Ready', description: 'AI has optimized your schedule for today.', time: '5m ago', isRead: false },
  { id: '2', title: 'Welcome!', description: 'Glad to have you on DayPilot.', time: '1h ago', isRead: true }
];
