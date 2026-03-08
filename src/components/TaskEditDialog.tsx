import React, { useState } from 'react';
import { Task, Priority } from "@/lib/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskDependencies } from "@/components/TaskDependencies";

interface TaskEditDialogProps {
  task: Task | null;
  allTasks?: Task[];
  onClose: () => void;
  onSave: (task: Task) => void;
  onChange: (task: Task) => void;
}

export function TaskEditDialog({ task, allTasks = [], onClose, onSave, onChange }: TaskEditDialogProps) {
  const [activeTab, setActiveTab] = useState('details');
  
  if (!task) return null;

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] sm:max-w-[500px] max-h-[85vh] rounded-xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription className="text-[11px] sm:text-xs">
            Modify task details, dependencies, and scheduling.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
            <TabsTrigger value="dependencies" className="text-xs">Dependencies</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 overflow-y-auto custom-scrollbar mt-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[11px] sm:text-xs">Task Name</Label>
              <Input 
                id="name" 
                className="text-xs" 
                value={task.name || ''} 
                onChange={(e) => onChange({...task, name: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[11px] sm:text-xs">Description</Label>
              <Textarea 
                id="description" 
                className="text-xs" 
                rows={3}
                value={task.description || ''} 
                onChange={(e) => onChange({...task, description: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[11px] sm:text-xs">Priority</Label>
                <Select 
                  value={task.priority} 
                  onValueChange={(val: Priority) => onChange({...task, priority: val})}
                >
                  <SelectTrigger className="text-[11px] sm:text-xs h-9">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔴 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-[11px] sm:text-xs">Duration (min)</Label>
                <Input 
                  type="number" 
                  className="text-xs h-9" 
                  value={task.estimatedTimeMinutes} 
                  onChange={(e) => onChange({...task, estimatedTimeMinutes: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-[11px] sm:text-xs">Category</Label>
              <Input 
                id="category" 
                className="text-xs h-9" 
                value={task.category || ''} 
                onChange={(e) => onChange({...task, category: e.target.value})} 
                placeholder="e.g., Work, Personal, Health"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate" className="text-[11px] sm:text-xs">Due Date</Label>
              <Input 
                id="dueDate" 
                type="date"
                className="text-xs h-9" 
                value={task.dueDate || ''} 
                onChange={(e) => onChange({...task, dueDate: e.target.value})} 
              />
            </div>
          </TabsContent>

          <TabsContent value="dependencies" className="flex-1 overflow-y-auto custom-scrollbar mt-4">
            <TaskDependencies 
              task={task}
              allTasks={allTasks}
              onChange={(dependsOn) => onChange({...task, dependsOn})}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-row gap-2 sm:gap-0 mt-4">
          <Button variant="outline" className="flex-1 sm:flex-none text-xs" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 sm:flex-none text-xs" onClick={() => onSave(task)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
