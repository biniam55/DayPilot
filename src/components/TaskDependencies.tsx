"use client"

import React, { useState } from 'react';
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, AlertCircle, Link2, CheckCircle2 } from "lucide-react";
import { canStartTask, getBlockingTasks, hasCircularDependency } from "@/lib/taskDependencies";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
  onChange: (dependsOn: string[]) => void;
}

export function TaskDependencies({ task, allTasks, onChange }: TaskDependenciesProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const currentDependencies = task.dependsOn || [];
  
  // Filter out current task and already added dependencies
  const availableTasks = allTasks.filter(t => 
    t.id !== task.id && 
    !currentDependencies.includes(t.id) &&
    !t.isCompleted
  );

  const blockingTasks = getBlockingTasks(task, allTasks);
  const canStart = canStartTask(task, allTasks);

  const handleAddDependency = () => {
    if (!selectedTaskId) return;

    setError('');
    
    const newDependencies = [...currentDependencies, selectedTaskId];
    
    // Check for circular dependencies
    if (hasCircularDependency(task.id, newDependencies, allTasks)) {
      setError('Cannot add this dependency: it would create a circular dependency chain.');
      return;
    }

    onChange(newDependencies);
    setSelectedTaskId('');
  };

  const handleRemoveDependency = (depId: string) => {
    onChange(currentDependencies.filter(id => id !== depId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link2 className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold">Task Dependencies</h4>
      </div>

      {!canStart && blockingTasks.length > 0 && (
        <Alert variant="destructive" className="bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This task is blocked by {blockingTasks.length} incomplete {blockingTasks.length === 1 ? 'task' : 'tasks'}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Dependencies */}
      {currentDependencies.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">This task depends on:</p>
          <div className="space-y-2">
            {currentDependencies.map(depId => {
              const depTask = allTasks.find(t => t.id === depId);
              if (!depTask) return null;

              return (
                <div 
                  key={depId}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {depTask.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground shrink-0" />
                    )}
                    <span className="text-xs truncate">{depTask.name}</span>
                    <Badge variant="outline" className="text-[9px] h-4 px-1 shrink-0">
                      {depTask.priority}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => handleRemoveDependency(depId)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Dependency */}
      {availableTasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Add dependency:</p>
          <div className="flex gap-2">
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger className="h-9 text-xs flex-1">
                <SelectValue placeholder="Select a task..." />
              </SelectTrigger>
              <SelectContent>
                {availableTasks.map(t => (
                  <SelectItem key={t.id} value={t.id} className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{t.name}</span>
                      <Badge variant="outline" className="text-[9px] h-4 px-1">
                        {t.priority}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              onClick={handleAddDependency}
              disabled={!selectedTaskId}
              className="h-9"
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {availableTasks.length === 0 && currentDependencies.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No available tasks to add as dependencies
        </p>
      )}

      <div className="pt-2 border-t">
        <p className="text-[10px] text-muted-foreground">
          Dependencies ensure tasks are completed in the right order. A task can't be started until all its dependencies are complete.
        </p>
      </div>
    </div>
  );
}
