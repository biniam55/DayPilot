import { Task } from './types';

/**
 * Check if a task can be started based on its dependencies
 */
export function canStartTask(task: Task, allTasks: Task[]): boolean {
  if (!task.dependsOn || task.dependsOn.length === 0) {
    return true;
  }

  // Check if all dependencies are completed
  return task.dependsOn.every(depId => {
    const depTask = allTasks.find(t => t.id === depId);
    return depTask?.isCompleted === true;
  });
}

/**
 * Get tasks that are blocking this task
 */
export function getBlockingTasks(task: Task, allTasks: Task[]): Task[] {
  if (!task.dependsOn || task.dependsOn.length === 0) {
    return [];
  }

  return task.dependsOn
    .map(depId => allTasks.find(t => t.id === depId))
    .filter((t): t is Task => t !== undefined && !t.isCompleted);
}

/**
 * Get tasks that depend on this task
 */
export function getDependentTasks(task: Task, allTasks: Task[]): Task[] {
  return allTasks.filter(t => 
    t.dependsOn?.includes(task.id) && !t.isCompleted
  );
}

/**
 * Check for circular dependencies
 */
export function hasCircularDependency(
  taskId: string,
  dependsOn: string[],
  allTasks: Task[]
): boolean {
  const visited = new Set<string>();
  
  function checkCircular(currentId: string): boolean {
    if (visited.has(currentId)) {
      return true;
    }
    
    visited.add(currentId);
    
    const task = allTasks.find(t => t.id === currentId);
    if (!task || !task.dependsOn) {
      return false;
    }
    
    return task.dependsOn.some(depId => checkCircular(depId));
  }
  
  return dependsOn.some(depId => {
    visited.clear();
    visited.add(taskId);
    return checkCircular(depId);
  });
}

/**
 * Get all tasks that can be started now (no blocking dependencies)
 */
export function getAvailableTasks(allTasks: Task[]): Task[] {
  return allTasks.filter(task => 
    !task.isCompleted && canStartTask(task, allTasks)
  );
}

/**
 * Get all blocked tasks
 */
export function getBlockedTasks(allTasks: Task[]): Task[] {
  return allTasks.filter(task => 
    !task.isCompleted && !canStartTask(task, allTasks)
  );
}
