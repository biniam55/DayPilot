import { TaskTemplate, Task } from './types';

export const DEFAULT_TEMPLATES: TaskTemplate[] = [
  {
    id: 'deep-work-day',
    name: 'Deep Work Day',
    description: 'Focused day for complex, creative work',
    icon: '🎯',
    category: 'workflow',
    createdAt: new Date().toISOString(),
    tasks: [
      {
        name: 'Morning Planning',
        description: 'Review goals and plan the day',
        priority: 'high',
        estimatedTimeMinutes: 15,
        category: 'Planning',
        energyLevel: 'high',
      },
      {
        name: 'Deep Work Block 1',
        description: 'Focus on most important task',
        priority: 'high',
        estimatedTimeMinutes: 120,
        category: 'Deep Work',
        energyLevel: 'high',
      },
      {
        name: 'Lunch Break',
        description: 'Take a proper break',
        priority: 'medium',
        estimatedTimeMinutes: 60,
        category: 'Break',
        energyLevel: 'low',
      },
      {
        name: 'Deep Work Block 2',
        description: 'Continue focused work',
        priority: 'high',
        estimatedTimeMinutes: 90,
        category: 'Deep Work',
        energyLevel: 'medium',
      },
      {
        name: 'Review & Plan Tomorrow',
        description: 'Reflect on progress and plan ahead',
        priority: 'medium',
        estimatedTimeMinutes: 20,
        category: 'Planning',
        energyLevel: 'low',
      },
    ],
  },
  {
    id: 'meeting-heavy-day',
    name: 'Meeting Heavy Day',
    description: 'Optimize days with many meetings',
    icon: '📅',
    category: 'workflow',
    createdAt: new Date().toISOString(),
    tasks: [
      {
        name: 'Morning Prep',
        description: 'Review meeting agendas',
        priority: 'high',
        estimatedTimeMinutes: 20,
        category: 'Planning',
        energyLevel: 'high',
      },
      {
        name: 'Quick Wins',
        description: 'Complete 2-3 small tasks',
        priority: 'medium',
        estimatedTimeMinutes: 45,
        category: 'Tasks',
        energyLevel: 'high',
      },
      {
        name: 'Meeting Block',
        description: 'Back-to-back meetings',
        priority: 'high',
        estimatedTimeMinutes: 180,
        category: 'Meetings',
        energyLevel: 'medium',
      },
      {
        name: 'Email & Follow-ups',
        description: 'Process meeting notes and emails',
        priority: 'medium',
        estimatedTimeMinutes: 45,
        category: 'Communication',
        energyLevel: 'low',
      },
      {
        name: 'End of Day Wrap-up',
        description: 'Clear inbox and plan tomorrow',
        priority: 'low',
        estimatedTimeMinutes: 15,
        category: 'Admin',
        energyLevel: 'low',
      },
    ],
  },
  {
    id: 'admin-day',
    name: 'Admin Day',
    description: 'Catch up on administrative tasks',
    icon: '📋',
    category: 'workflow',
    createdAt: new Date().toISOString(),
    tasks: [
      {
        name: 'Email Inbox Zero',
        description: 'Process and organize emails',
        priority: 'high',
        estimatedTimeMinutes: 60,
        category: 'Communication',
        energyLevel: 'medium',
      },
      {
        name: 'Expense Reports',
        description: 'Submit pending expenses',
        priority: 'medium',
        estimatedTimeMinutes: 30,
        category: 'Finance',
        energyLevel: 'low',
      },
      {
        name: 'File Organization',
        description: 'Clean up documents and files',
        priority: 'low',
        estimatedTimeMinutes: 45,
        category: 'Organization',
        energyLevel: 'low',
      },
      {
        name: 'Update Documentation',
        description: 'Write or update project docs',
        priority: 'medium',
        estimatedTimeMinutes: 60,
        category: 'Documentation',
        energyLevel: 'medium',
      },
      {
        name: 'Team Check-ins',
        description: 'Quick sync with team members',
        priority: 'medium',
        estimatedTimeMinutes: 30,
        category: 'Communication',
        energyLevel: 'medium',
      },
    ],
  },
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Start your day right',
    icon: '🌅',
    category: 'routine',
    createdAt: new Date().toISOString(),
    tasks: [
      {
        name: 'Review Calendar',
        description: 'Check today\'s schedule',
        priority: 'high',
        estimatedTimeMinutes: 5,
        category: 'Planning',
        energyLevel: 'high',
      },
      {
        name: 'Set Top 3 Priorities',
        description: 'Identify most important tasks',
        priority: 'high',
        estimatedTimeMinutes: 10,
        category: 'Planning',
        energyLevel: 'high',
      },
      {
        name: 'Quick Email Scan',
        description: 'Check for urgent messages',
        priority: 'medium',
        estimatedTimeMinutes: 10,
        category: 'Communication',
        energyLevel: 'high',
      },
    ],
  },
  {
    id: 'evening-shutdown',
    name: 'Evening Shutdown',
    description: 'End your workday properly',
    icon: '🌆',
    category: 'routine',
    createdAt: new Date().toISOString(),
    tasks: [
      {
        name: 'Review Completed Tasks',
        description: 'Celebrate what you accomplished',
        priority: 'medium',
        estimatedTimeMinutes: 5,
        category: 'Review',
        energyLevel: 'low',
      },
      {
        name: 'Move Incomplete Tasks',
        description: 'Reschedule or delete unfinished items',
        priority: 'medium',
        estimatedTimeMinutes: 10,
        category: 'Planning',
        energyLevel: 'low',
      },
      {
        name: 'Plan Tomorrow',
        description: 'Set up tomorrow\'s priorities',
        priority: 'high',
        estimatedTimeMinutes: 10,
        category: 'Planning',
        energyLevel: 'low',
      },
      {
        name: 'Clear Workspace',
        description: 'Tidy up physical and digital space',
        priority: 'low',
        estimatedTimeMinutes: 5,
        category: 'Organization',
        energyLevel: 'low',
      },
    ],
  },
];

/**
 * Generate tasks from a template
 */
export function generateTasksFromTemplate(template: TaskTemplate): Task[] {
  const now = new Date().toISOString();
  
  return template.tasks.map((taskTemplate, index) => ({
    ...taskTemplate,
    id: `task-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
    isCompleted: false,
    status: 'todo' as const,
    createdAt: now,
  }));
}

/**
 * Create a custom template from existing tasks
 */
export function createTemplateFromTasks(
  name: string,
  description: string,
  tasks: Task[],
  icon?: string
): TaskTemplate {
  return {
    id: `template-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name,
    description,
    icon: icon || '⭐',
    category: 'custom',
    createdAt: new Date().toISOString(),
    tasks: tasks.map(task => {
      const { id, isCompleted, status, completedAt, createdAt, ...rest } = task;
      return rest;
    }),
    usageCount: 0,
  };
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string, customTemplates: TaskTemplate[] = []): TaskTemplate | undefined {
  return [...DEFAULT_TEMPLATES, ...customTemplates].find(t => t.id === id);
}

/**
 * Get all templates
 */
export function getAllTemplates(customTemplates: TaskTemplate[] = []): TaskTemplate[] {
  return [...DEFAULT_TEMPLATES, ...customTemplates];
}
