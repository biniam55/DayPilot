'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI Schedule Assistant.
 * It helps users create an optimal daily schedule based on input tasks, their priorities,
 * estimated durations, and user preferences for work hours and breaks.
 *
 * - suggestOptimalDailySchedule - A function that orchestrates the AI scheduling process.
 * - AiSuggestOptimalDailyScheduleInput - The input type for the suggestOptimalDailySchedule function.
 * - AiSuggestOptimalDailyScheduleOutput - The return type for the suggestOptimalDailySchedule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TaskSchema = z.object({
  id: z.string().describe('Unique identifier for the task.').regex(/^[a-zA-Z0-9_-]+$/), // Simple ID validation
  name: z.string().describe('Name or title of the task.'),
  description: z.string().optional().describe('Detailed description of the task.'),
  priority: z.enum(['high', 'medium', 'low']).describe('Priority level of the task.'),
  estimatedDurationMinutes: z.number().int().min(5).max(480).describe('Estimated time in minutes to complete the task (min 5, max 480).'),
  dueDate: z.string().optional().describe('Optional due date for the task, in YYYY-MM-DD format.'),
  category: z.string().optional().describe('Optional category for the task (e.g., "Work", "Personal").'),
});

const PreferredBreakSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).describe('Start time of the preferred break in HH:MM (24-hour) format.'),
  durationMinutes: z.number().int().min(5).max(180).describe('Duration of the break in minutes (min 5, max 180).'),
});

const PreferencesSchema = z.object({
  workDayStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).describe('Start time of the user\u0027s work day in HH:MM (24-hour) format.'),
  workDayEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).describe('End time of the user\u0027s work day in HH:MM (24-hour) format.'),
  preferredBreaks: z.array(PreferredBreakSchema).optional().describe('An array of preferred break times and durations.'),
});

const AiSuggestOptimalDailyScheduleInputSchema = z.object({
  tasks: z.array(TaskSchema).describe('A list of tasks to be scheduled.'),
  preferences: PreferencesSchema.describe('User preferences for scheduling, including work hours and breaks.'),
});
export type AiSuggestOptimalDailyScheduleInput = z.infer<typeof AiSuggestOptimalDailyScheduleInputSchema>;

const ScheduledTaskOutputSchema = z.object({
  id: z.string().describe('The ID of the scheduled task.'),
  name: z.string().describe('The name of the scheduled task.'),
  description: z.string().optional().describe('The description of the scheduled task.'),
  priority: z.enum(['high', 'medium', 'low']).describe('The priority of the scheduled task.'),
  category: z.string().optional().describe('The category of the scheduled task.'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).describe('The scheduled start time in HH:MM (24-hour) format.'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).describe('The scheduled end time in HH:MM (24-hour) format.'),
});

const AiSuggestOptimalDailyScheduleOutputSchema = z.object({
  scheduledTasks: z.array(ScheduledTaskOutputSchema).describe('A list of tasks successfully scheduled with their allocated times.'),
  unscheduledTasks: z.array(TaskSchema).describe('A list of tasks that could not be scheduled within the given constraints.'),
  explanation: z.string().describe('A detailed explanation of the generated schedule, including how priorities were handled and reasons for any unscheduled tasks.'),
});
export type AiSuggestOptimalDailyScheduleOutput = z.infer<typeof AiSuggestOptimalDailyScheduleOutputSchema>;

export async function suggestOptimalDailySchedule(input: AiSuggestOptimalDailyScheduleInput): Promise<AiSuggestOptimalDailyScheduleOutput> {
  return aiSuggestOptimalDailyScheduleFlow(input);
}

const schedulePrompt = ai.definePrompt({
  name: 'optimalDailySchedulePrompt',
  input: { schema: AiSuggestOptimalDailyScheduleInputSchema },
  output: { schema: AiSuggestOptimalDailyScheduleOutputSchema },
  prompt: `You are an AI-powered schedule assistant. Your goal is to create an optimal daily schedule based on the provided tasks and user preferences.

--- Start of User Preferences ---
Start of Work Day: {{{preferences.workDayStart}}}
End of Work Day: {{{preferences.workDayEnd}}}
{{#if preferences.preferredBreaks}}
Preferred Breaks:
{{#each preferences.preferredBreaks}}
- From {{this.start}} for {{this.durationMinutes}} minutes
{{/each}}
{{/if}}
--- End of User Preferences ---

--- Start of Tasks to Schedule ---
{{#each tasks}}
- Task ID: {{this.id}}
  Name: {{this.name}}
  Description: {{this.description}}
  Priority: {{this.priority}}
  Estimated Duration: {{this.estimatedDurationMinutes}} minutes
  {{#if this.dueDate}}Due Date: {{this.dueDate}}{{/if}}
  {{#if this.category}}Category: {{this.category}}{{/if}}
{{/each}}
--- End of Tasks to Schedule ---

--- Instructions ---
1.  Generate a daily schedule for today, organizing the tasks efficiently between the 'Start of Work Day' and 'End of Work Day'.
2.  Prioritize tasks: 'high' priority tasks should be scheduled first, then 'medium', then 'low'. If tasks have the same priority, sort them by estimated duration (shorter first).
3.  Allocate time blocks for each task based on its 'Estimated Duration'.
4.  Integrate 'Preferred Breaks' into the schedule. Ensure that breaks are respected and do not overlap with tasks. If a preferred break cannot be fully accommodated without conflicting with higher priority tasks or the work day boundaries, adjust or note it.
5.  Ensure no two scheduled tasks or tasks and breaks overlap. Schedule tasks contiguously where possible to minimize fragmentation.
6.  If a task cannot be scheduled within the work day (e.g., due to duration, conflicts, or lack of available time), add it to the 'unscheduledTasks' array.
7.  The output must be a JSON object conforming strictly to the \`AiSuggestOptimalDailyScheduleOutputSchema\` provided in your instructions.
8.  The 'explanation' field should provide a summary of the schedule, how priorities were considered, and specific reasons for any tasks being left unscheduled.
--- End of Instructions ---
`,
});

const aiSuggestOptimalDailyScheduleFlow = ai.defineFlow(
  {
    name: 'aiSuggestOptimalDailyScheduleFlow',
    inputSchema: AiSuggestOptimalDailyScheduleInputSchema,
    outputSchema: AiSuggestOptimalDailyScheduleOutputSchema,
  },
  async (input) => {
    const { output } = await schedulePrompt(input);
    return output!;
  }
);
