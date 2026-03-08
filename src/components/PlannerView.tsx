import React, { memo, useMemo, useState } from 'react';
import { Task, UserPreferences, TaskTemplate } from "@/lib/types";
import { Timeline } from "@/components/Timeline";
import { TaskCard } from "@/components/TaskCard";
import { QuickTaskInput } from "@/components/QuickTaskInput";
import { AIScheduleAssistant } from "@/components/AIScheduleAssistant";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { SmartSuggestions } from "@/components/SmartSuggestions";
import { TemplatesDialog } from "@/components/TemplatesDialog";
import { ListTodo, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { generateTasksFromTemplate } from "@/lib/templates";

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
  onAddMultipleTasks?: (tasks: Task[]) => void;
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
  onScheduleUpdate,
  onAddMultipleTasks
}: PlannerViewProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  
  const filteredTasks = useMemo(() => {
    if (activeTab === 'todo') return tasks.filter(t => !t.isCompleted);
    if (activeTab === 'completed') return tasks.filter(t => t.isCompleted);
    return tasks;
  }, [tasks, activeTab]);

  const handleApplyTemplate = (template: TaskTemplate) => {
    const newTasks = generateTasksFromTemplate(template);
    if (onAddMultipleTasks) {
      onAddMultipleTasks(newTasks);
    }
  };

  return (
    <>
      {/* Mobile View - Tabbed Interface */}
      <div className="md:hidden flex flex-col h-full gap-4 p-4">
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <QuickTaskInput onAdd={onAddTask} />
          </div>
          <div className="p-4 bg-card rounded-xl border shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTemplates(true)}
              className="h-9 w-9 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="tasks" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-muted/50 h-10 p-1 grid grid-cols-4 w-full">
            <TabsTrigger value="schedule" className="text-[10px]">Schedule</TabsTrigger>
            <TabsTrigger value="tasks" className="text-[10px]">Tasks</TabsTrigger>
            <TabsTrigger value="ai" className="text-[10px]">AI</TabsTrigger>
            <TabsTrigger value="timer" className="text-[10px]">Timer</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="flex-1 overflow-hidden mt-4">
            <div className="h-full overflow-hidden">
              <Timeline tasks={tasks} />
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="flex-1 overflow-hidden mt-4">
            <div className="flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden h-full">
              <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <TabsList className="bg-muted/50 h-8 p-1">
                    <TabsTrigger value="all" className="text-[10px] px-3">All</TabsTrigger>
                    <TabsTrigger value="todo" className="text-[10px] px-3">To-Do</TabsTrigger>
                    <TabsTrigger value="completed" className="text-[10px] px-3">Done</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
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
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="flex-1 overflow-hidden mt-4 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              <AIScheduleAssistant 
                tasks={tasks} 
                preferences={preferences} 
                onScheduleUpdate={onScheduleUpdate} 
              />
              <SmartSuggestions 
                tasks={tasks}
                onSelectTask={(task) => {
                  console.log('Selected task:', task);
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="timer" className="flex-1 overflow-hidden mt-4 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <PomodoroTimer 
                currentTask={tasks.find(t => !t.isCompleted)?.name}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop View - Three Column Layout */}
      <div className="hidden md:grid md:grid-cols-[320px_1fr_320px] lg:grid-cols-[380px_1fr_380px] h-full gap-6 p-6 overflow-hidden">
        {/* Left Column - Timeline */}
        <div className="overflow-hidden">
          <Timeline tasks={tasks} />
        </div>

        {/* Middle Column - Tasks */}
        <div className="flex flex-col gap-6 min-w-0 overflow-hidden">
          <div className="flex gap-2">
            <div className="flex-1">
              <QuickTaskInput onAdd={onAddTask} />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowTemplates(true)}
              className="h-auto px-4 gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden lg:inline text-xs">Templates</span>
            </Button>
          </div>
          
          <div className="flex-1 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden">
            <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b">
                <TabsList className="bg-muted/50 h-9 p-1">
                  <TabsTrigger value="all" className="text-xs px-4">All</TabsTrigger>
                  <TabsTrigger value="todo" className="text-xs px-4">To-Do</TabsTrigger>
                  <TabsTrigger value="completed" className="text-xs px-4">Done</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
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
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column - AI Assistant & Tools */}
        <div className="flex flex-col overflow-hidden">
          <Tabs defaultValue="ai" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="bg-muted/50 h-10 p-1 grid grid-cols-2 w-full shrink-0">
              <TabsTrigger value="ai" className="text-xs">AI & Suggestions</TabsTrigger>
              <TabsTrigger value="timer" className="text-xs">Timer</TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-2 custom-scrollbar">
                <div className="shrink-0">
                  <AIScheduleAssistant 
                    tasks={tasks} 
                    preferences={preferences} 
                    onScheduleUpdate={onScheduleUpdate} 
                  />
                </div>
                <div className="shrink-0">
                  <SmartSuggestions 
                    tasks={tasks}
                    onSelectTask={(task) => {
                      console.log('Selected task:', task);
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timer" className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 overflow-y-auto mt-4 custom-scrollbar">
                <PomodoroTimer 
                  currentTask={tasks.find(t => !t.isCompleted)?.name}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <TemplatesDialog
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onApplyTemplate={handleApplyTemplate}
      />
    </>
  );
});
