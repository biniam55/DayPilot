'use server';
/**
 * @fileOverview An AI agent for dynamically adjusting a daily schedule.
 *
 * - adjustSchedule - A function that re-allocates tasks and suggests an updated schedule based on unexpected events or new high-priority tasks.
 * - AdjustScheduleInput - The input type for the adjustSchedule function.
 * - AdjustScheduleOutput - The return type for the adjustSchedule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define common task schema
const TaskSchema = z.object({
  id: z.string().describe('Unique identifier for the task.'),
  name: z.string().describe('Name of the task.'),
  description: z.string().optional().describe('Detailed description of the task.'),
  dueDate: z.string().optional().describe('ISO date string for when the task is due.'),
  priority: z.enum(['low', 'medium', 'high']).describe('Priority level of the task.'),
  estimatedTimeMinutes: z.number().describe('Estimated time in minutes to complete the task.'),
  isCompleted: z.boolean().describe('Whether the task has been completed.'),
  category: z.string().optional().describe('Category the task belongs to (e.g., Work, Personal, Errands).'),
});

const ReallocatedTaskSchema = TaskSchema.extend({
  scheduledStartTime: z.string().optional().describe('ISO date string for the suggested start time of the task.'),
  scheduledEndTime: z.string().optional().describe('ISO date string for the suggested end time of the task.'),
});

export const AdjustScheduleInputSchema = z.object({
  currentTasks: z.array(TaskSchema).describe('A list of all current tasks, including completed ones.'),
  unexpectedEventDescription: z.string().optional().describe('Description of an unexpected event that disrupts the day.'),
  newHighPriorityTask: TaskSchema.optional().describe('A new high-priority task that needs to be integrated into the schedule.'),
  currentTime: z.string().describe('The current time as an ISO date string, used as the starting point for rescheduling.'),
});
export type AdjustScheduleInput = z.infer<typeof AdjustScheduleInputSchema>;

export const AdjustScheduleOutputSchema = z.object({
  reallocatedTasks: z.array(ReallocatedTaskSchema).describe('The updated list of tasks with new scheduled start and end times.'),
  reasoning: z.string().describe('Explanation of how the tasks were re-allocated and why.'),
});
export type AdjustScheduleOutput = z.infer<typeof AdjustScheduleOutputSchema>;

export async function adjustSchedule(input: AdjustScheduleInput): Promise<AdjustScheduleOutput> {
  return adjustScheduleFlow(input);
}

const adjustSchedulePrompt = ai.definePrompt({
  name: 'adjustSchedulePrompt',
  input: { schema: AdjustScheduleInputSchema },
  output: { schema: AdjustScheduleOutputSchema },
  prompt: `You are an AI-powered daily schedule assistant. Your goal is to help a user re-allocate their tasks and suggest an updated schedule when an unexpected event or new high-priority task disrupts their day.\n\nThe current time is: {{{currentTime}}}\n\nHere are the user's current *uncompleted* tasks, including their details. Tasks with 'isCompleted: true' have already been filtered out.\n{{#each uncompletedTasks}}\n- ID: {{{id}}}, Name: {{{name}}}, Priority: {{{priority}}}, Estimated Time: {{{estimatedTimeMinutes}}} minutes, Due Date: {{{dueDate}}}{{#if description}}, Description: {{{description}}}{{/if}}{{#if category}}, Category: {{{category}}}{{/if}}\n{{/each}}\n\n{{#if newHighPriorityTask}}\nA new high-priority task has emerged:\n- ID: {{{newHighPriorityTask.id}}}, Name: {{{newHighPriorityTask.name}}}, Priority: {{{newHighPriorityTask.priority}}}, Estimated Time: {{{newHighPriorityTask.estimatedTimeMinutes}}} minutes, Due Date: {{{newHighPriorityTask.dueDate}}}{{#if newHighPriorityTask.description}}, Description: {{{newHighPriorityTask.description}}}{{/if}}{{#if newHighPriorityTask.category}}, Category: {{{newHighPriorityTask.category}}}{{/if}}\nThis new task MUST be integrated into the schedule, respecting its high priority.\n{{/if}}\n\n{{#if unexpectedEventDescription}}\nAn unexpected event has occurred: "{{{unexpectedEventDescription}}}". Take this event into account when rescheduling. This might mean certain time blocks are now unavailable or priorities have shifted.\n{{/if}}\n\nYour task is to create a new, optimized schedule for the remaining uncompleted tasks, including any new high-priority task.\nConsider the following when creating the new schedule:\n1.  **Prioritization**: High-priority tasks should be scheduled first, followed by medium, then low.\n2.  **Due Dates**: Tasks with earlier due dates should be prioritized within their priority level.\n3.  **Estimated Time**: Allocate sufficient time for each task based on its estimated duration.\n4.  **Current Time**: Start scheduling from the \`currentTime\` provided. Do not schedule tasks before this time.\n5.  **Breaks**: Assume short breaks between tasks (e.g., 5-15 minutes) if possible, but prioritize completing tasks if time is tight.\n6.  **Unexpected Event**: Fully integrate the impact of the \`unexpectedEventDescription\` into the schedule.\n\nOutput the \`reallocatedTasks\` as an array of objects, including their new \`scheduledStartTime\` and \`scheduledEndTime\` in ISO date string format. Also, provide a clear \`reasoning\` for the schedule adjustments you made. Ensure all original task fields are preserved, and \`isCompleted\` remains \`false\` for uncompleted tasks.`
});

const adjustScheduleFlow = ai.defineFlow(
  {
    name: 'adjustScheduleFlow',
    inputSchema: AdjustScheduleInputSchema,
    outputSchema: AdjustScheduleOutputSchema,
  },
  async (input) => {
    let uncompletedTasks = input.currentTasks.filter(task => !task.isCompleted);

    if (input.newHighPriorityTask) {
      // Add the new high-priority task to the list of uncompleted tasks to be scheduled.
      // Ensure it's marked as not completed, as it's a new task to be done.
      const newTaskToAdd = { ...input.newHighPriorityTask, isCompleted: false };
      uncompletedTasks = [...uncompletedTasks, newTaskToAdd];
    }

    const promptInput = {
      ...input,
      uncompletedTasks: uncompletedTasks,
    };

    const { output } = await adjustSchedulePrompt(promptInput);
    return output!;
  }
);
