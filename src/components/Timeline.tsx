"use client"

import React from 'react';
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TimelineProps {
  tasks: Task[];
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

export function Timeline({ tasks }: TimelineProps) {
  const scheduledTasks = tasks.filter(t => t.scheduledStartTime && t.scheduledEndTime);

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-semibold text-sm">Today's Schedule</h3>
      </div>
      
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="relative min-h-[800px]">
          {/* Time markers */}
          {HOURS.map((hour) => (
            <div key={hour} className="relative h-16 border-t border-muted last:border-b">
              <span className="absolute -top-3 left-0 text-[10px] font-bold text-muted-foreground bg-card pr-2">
                {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
              </span>
            </div>
          ))}

          {/* Task blocks */}
          <div className="absolute inset-0 left-16">
            {scheduledTasks.map((task) => {
              const [startH, startM] = task.scheduledStartTime!.split(':').map(Number);
              const [endH, endM] = task.scheduledEndTime!.split(':').map(Number);
              
              const startOffset = (startH - 7) * 64 + (startM / 60) * 64;
              const duration = ((endH * 60 + endM) - (startH * 60 + startM)) / 60 * 64;

              return (
                <div
                  key={task.id}
                  className={cn(
                    "absolute left-0 right-4 p-2 rounded-lg border shadow-sm flex flex-col justify-center overflow-hidden transition-all hover:ring-2 ring-primary/20",
                    task.isCompleted ? "bg-muted text-muted-foreground" : "bg-primary/5 border-primary/20"
                  )}
                  style={{
                    top: `${startOffset}px`,
                    height: `${duration}px`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold truncate leading-tight">
                      {task.name}
                    </span>
                    <Badge variant="outline" className="text-[8px] h-3 px-1 border-primary/30">
                      {task.category || 'General'}
                    </Badge>
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    {task.scheduledStartTime} - {task.scheduledEndTime}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}