"use client"

import React from 'react';
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TimelineProps {
  tasks: Task[];
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

export function Timeline({ tasks }: TimelineProps) {
  const scheduledTasks = tasks.filter(t => t.scheduledStartTime && t.scheduledEndTime);

  const calculatePosition = (time: string) => {
    try {
      if (!time) return 0;
      const parts = time.split(':');
      if (parts.length !== 2) return 0;
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (isNaN(h) || isNaN(m)) return 0;
      // 64px per hour
      return (h - 7) * 64 + (m / 60) * 64;
    } catch (e) {
      return 0;
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden min-h-0">
      <div className="p-4 border-b bg-muted/30 shrink-0">
        <h3 className="font-semibold text-sm">Today's Schedule</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 pt-6">
          <div className="relative min-h-[960px]">
            {/* Time markers */}
            {HOURS.map((hour) => (
              <div key={hour} className="relative h-16 border-t border-muted last:border-b">
                <span className="absolute -top-3 left-0 text-[10px] font-bold text-muted-foreground bg-card pr-2 z-10">
                  {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                </span>
              </div>
            ))}

            {/* Task blocks */}
            <div className="absolute inset-0 left-16 right-0">
              {scheduledTasks.map((task) => {
                const startPos = calculatePosition(task.scheduledStartTime!);
                const endPos = calculatePosition(task.scheduledEndTime!);
                const duration = Math.max(endPos - startPos, 32);

                if (startPos < 0 || startPos > 960) return null;

                return (
                  <div
                    key={task.id}
                    className={cn(
                      "absolute left-1 right-2 p-2 rounded-lg border shadow-sm flex flex-col justify-center overflow-hidden transition-all hover:ring-2 ring-primary/20 z-20",
                      task.isCompleted ? "bg-muted text-muted-foreground" : "bg-primary/5 border-primary/20"
                    )}
                    style={{
                      top: `${startPos}px`,
                      height: `${duration}px`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                      <span className="text-[11px] font-bold truncate leading-tight">
                        {task.name}
                      </span>
                      <Badge variant="outline" className="text-[8px] h-3 px-1 border-primary/30 shrink-0 bg-background/50">
                        {task.category || 'Gen'}
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
        </div>
      </ScrollArea>
    </div>
  );
}