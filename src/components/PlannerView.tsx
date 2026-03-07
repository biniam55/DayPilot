import React, { memo, useMemo } from 'react';
import { Task, UserPreferences } from "@/lib/types";
import { Timeline } from "@/components/Timeline";
import { TaskCard } from "@/components/TaskCard";
import { QuickTaskInput } from "@/components/QuickTaskInput";
import { AIScheduleAssistant } from "@/components/AIScheduleAssistant";
import { Button } from "@/components/ui/button";
import { ListTodo, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface PlannerViewProps {
  tasks: Task[];
  preferences: UserPreferences;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTask: (name: string) => void;
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onScheduleUpdate: (tasks: Task[]) => void;
}

const EmptyState = memo(() => (
  <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-center opacity-40">
    <ListTodo className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
    <p className="text-xs sm:text-sm font-medium">No tasks found</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

export const PlannerView = memo(function PlannerView({
  tasks,
  preferences,
  activeTab,
  onTabChange,
  onAddTask,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onScheduleUpdate
}: PlannerViewProps) {
  const filteredTasks = useMemo(() => {
    if (activeTab === 'todo') return tasks.filter(t => !t.isCompleted);
    if (activeTab === 'completed') return tasks.filter(t => t.isCompleted);
    return tasks;
  }, [tasks, activeTab]);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-4 sm:gap-8 p-4 sm:p-8">
      <div className="w-full lg:w-[350px] xl:w-[400px] h-[300px] lg:h-full shrink-0 overflow-hidden">
        <Timeline tasks={tasks} />
      </div>

      <div className="flex-1 flex flex-col gap-4 sm:gap-6 min-w-0 overflow-hidden">
        <QuickTaskInput onAdd={onAddTask} />
        <div className="flex-1 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden">
          <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between gap-4 shrink-0">
              <TabsList className="bg-muted/50 h-8 sm:h-9 p-1">
                <TabsTrigger value="all" className="text-[10px] sm:text-xs px-2 sm:px-4 rounded-md">All</TabsTrigger>
                <TabsTrigger value="todo" className="text-[10px] sm:text-xs px-2 sm:px-4 rounded-md">To-Do</TabsTrigger>
                <TabsTrigger value="completed" className="text-[10px] sm:text-xs px-2 sm:px-4 rounded-md">Done</TabsTrigger>
              </TabsList>
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] sm:text-xs gap-1">
                      <TrendingUp className="w-3 h-3" />
                      AI Tips
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[400px] p-6">
                    <SheetTitle className="sr-only">AI Schedule Assistant</SheetTitle>
                    <SheetDescription className="sr-only">AI-powered schedule optimization</SheetDescription>
                    <AIScheduleAssistant 
                      tasks={tasks} 
                      preferences={preferences} 
                      onScheduleUpdate={onScheduleUpdate} 
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <TabsContent value={activeTab} className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 overflow-y-auto task-list-scroll">
                <div className="p-4 sm:p-6 space-y-4">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onToggleComplete={onToggleComplete} 
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <aside className="w-80 hidden xl:flex flex-col gap-6 shrink-0 overflow-y-auto">
        <AIScheduleAssistant 
          tasks={tasks} 
          preferences={preferences} 
          onScheduleUpdate={onScheduleUpdate} 
        />
      </aside>
    </div>
  );
});
