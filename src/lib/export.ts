import { Task, UserPreferences, UserProfile, TaskTemplate } from './types';

/**
 * Export data formats
 */
export type ExportFormat = 'json' | 'csv' | 'markdown';

/**
 * Export all user data
 */
export function exportAllData(
  tasks: Task[],
  preferences: UserPreferences,
  profile: UserProfile,
  templates?: TaskTemplate[]
) {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    data: {
      tasks,
      preferences,
      profile,
      templates: templates || [],
    },
  };
}

/**
 * Export tasks to JSON
 */
export function exportTasksToJSON(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

/**
 * Export tasks to CSV
 */
export function exportTasksToCSV(tasks: Task[]): string {
  const headers = [
    'ID',
    'Name',
    'Description',
    'Priority',
    'Status',
    'Category',
    'Estimated Time (min)',
    'Actual Time (min)',
    'Due Date',
    'Completed',
    'Created At',
    'Completed At',
  ];

  const rows = tasks.map(task => [
    task.id,
    `"${task.name.replace(/"/g, '""')}"`,
    `"${(task.description || '').replace(/"/g, '""')}"`,
    task.priority,
    task.status,
    task.category || '',
    task.estimatedTimeMinutes,
    task.actualTimeMinutes || '',
    task.dueDate || '',
    task.isCompleted ? 'Yes' : 'No',
    task.createdAt || '',
    task.completedAt || '',
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Export tasks to Markdown
 */
export function exportTasksToMarkdown(tasks: Task[]): string {
  const lines: string[] = [
    '# DayPilot Tasks Export',
    '',
    `Exported on: ${new Date().toLocaleDateString()}`,
    '',
  ];

  // Group by status
  const todo = tasks.filter(t => !t.isCompleted);
  const completed = tasks.filter(t => t.isCompleted);

  if (todo.length > 0) {
    lines.push('## To-Do Tasks', '');
    todo.forEach(task => {
      lines.push(`### ${task.name}`);
      if (task.description) lines.push(`${task.description}`);
      lines.push(`- **Priority:** ${task.priority}`);
      lines.push(`- **Category:** ${task.category || 'None'}`);
      lines.push(`- **Estimated Time:** ${task.estimatedTimeMinutes} minutes`);
      if (task.dueDate) lines.push(`- **Due Date:** ${task.dueDate}`);
      if (task.subtasks && task.subtasks.length > 0) {
        lines.push('- **Subtasks:**');
        task.subtasks.forEach(st => {
          lines.push(`  - [${st.isCompleted ? 'x' : ' '}] ${st.name}`);
        });
      }
      lines.push('');
    });
  }

  if (completed.length > 0) {
    lines.push('## Completed Tasks', '');
    completed.forEach(task => {
      lines.push(`- [x] ${task.name}`);
      if (task.completedAt) {
        lines.push(`  - Completed: ${new Date(task.completedAt).toLocaleDateString()}`);
      }
    });
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export tasks with format selection
 */
export function exportTasks(tasks: Task[], format: ExportFormat) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  switch (format) {
    case 'json':
      downloadFile(
        exportTasksToJSON(tasks),
        `daypilot-tasks-${timestamp}.json`,
        'application/json'
      );
      break;
    case 'csv':
      downloadFile(
        exportTasksToCSV(tasks),
        `daypilot-tasks-${timestamp}.csv`,
        'text/csv'
      );
      break;
    case 'markdown':
      downloadFile(
        exportTasksToMarkdown(tasks),
        `daypilot-tasks-${timestamp}.md`,
        'text/markdown'
      );
      break;
  }
}

/**
 * Import tasks from JSON
 */
export function importTasksFromJSON(jsonString: string): Task[] {
  try {
    const data = JSON.parse(jsonString);
    
    // Handle both array of tasks and full export format
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data.tasks)) {
      return data.data.tasks;
    }
    
    throw new Error('Invalid format');
  } catch (error) {
    throw new Error('Failed to parse JSON file. Please ensure it\'s a valid DayPilot export.');
  }
}

/**
 * Import tasks from CSV
 */
export function importTasksFromCSV(csvString: string): Task[] {
  const lines = csvString.split('\n').filter(line => line.trim());
  if (lines.length < 2) throw new Error('CSV file is empty or invalid');

  const headers = lines[0].split(',');
  const tasks: Task[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < headers.length) continue;

    const task: Task = {
      id: values[0] || `task-${Date.now()}-${i}`,
      name: values[1].replace(/^"|"$/g, '').replace(/""/g, '"'),
      description: values[2].replace(/^"|"$/g, '').replace(/""/g, '"'),
      priority: (values[3] as 'high' | 'medium' | 'low') || 'medium',
      status: (values[4] as 'todo' | 'in-progress' | 'completed') || 'todo',
      category: values[5] || undefined,
      estimatedTimeMinutes: parseInt(values[6]) || 30,
      actualTimeMinutes: values[7] ? parseInt(values[7]) : undefined,
      dueDate: values[8] || undefined,
      isCompleted: values[9] === 'Yes',
      createdAt: values[10] || new Date().toISOString(),
      completedAt: values[11] || undefined,
    };

    tasks.push(task);
  }

  return tasks;
}

/**
 * Validate imported tasks
 */
export function validateImportedTasks(tasks: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(tasks)) {
    errors.push('Data must be an array of tasks');
    return { valid: false, errors };
  }

  tasks.forEach((task, index) => {
    if (!task.id) errors.push(`Task ${index + 1}: Missing ID`);
    if (!task.name) errors.push(`Task ${index + 1}: Missing name`);
    if (!['high', 'medium', 'low'].includes(task.priority)) {
      errors.push(`Task ${index + 1}: Invalid priority`);
    }
  });

  return { valid: errors.length === 0, errors };
}
