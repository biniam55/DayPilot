"use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Tag, CalendarDays, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30",
  low: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30",
};

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className={cn(
      "group relative border-l-4 transition-all hover:shadow-md overflow-hidden shrink-0",
      task.priority === 'high' ? "border-l-primary" : "border-l-accent",
      task.isCompleted && "opacity-60"
    )}>
      <CardContent className="p-4 flex items-start gap-3">
        <Checkbox 
          checked={task.isCompleted} 
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-1 shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className={cn(
              "font-medium text-sm truncate",
              task.isCompleted && "line-through text-muted-foreground"
            )}>
              {task.name}
            </h4>
            <Badge variant="outline" className={cn("text-[10px] py-0 shrink-0 uppercase tracking-tighter", priorityColors[task.priority])}>
              {task.priority}
            </Badge>
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 break-words leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground font-medium">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.estimatedTimeMinutes}m
            </div>
            {task.category && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{task.category}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {task.dueDate}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 flex flex-col justify-center h-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)} className="gap-2">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="gap-2 text-destructive focus:text-destructive">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
