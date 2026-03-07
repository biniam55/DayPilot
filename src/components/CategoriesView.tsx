import React from 'react';
import { Task } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoriesViewProps {
  tasks: Task[];
}

export function CategoriesView({ tasks }: CategoriesViewProps) {
  const categories = Array.from(new Set(tasks.map(t => t.category || 'General')));

  return (
    <ScrollArea className="h-full">
      <div className="p-4 sm:p-8 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map(cat => {
            const catTasks = tasks.filter(t => (t.category || 'General') === cat);
            const completed = catTasks.filter(t => t.isCompleted).length;
            const total = catTasks.length;
            const progress = total > 0 ? (completed / total) * 100 : 0;

            return (
              <Card key={cat} className="group hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="secondary" className="w-fit text-[9px] sm:text-[10px] px-1.5 py-0">{cat}</Badge>
                    <span className="text-[10px] text-muted-foreground font-medium">{completed}/{total}</span>
                  </div>
                  <CardTitle className="text-xs sm:text-sm font-bold">{cat} Tasks</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="space-y-2">
                    {catTasks.slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center gap-2">
                        <CheckCircle2 className={cn("w-3 h-3 shrink-0", t.isCompleted ? "text-primary" : "text-muted")} />
                        <span className={cn("text-[10px] sm:text-[11px] truncate", t.isCompleted && "line-through text-muted-foreground")}>{t.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
