import React from 'react';
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

interface TaskEditDialogProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  onChange: (task: Task) => void;
}

export function TaskEditDialog({ task, onClose, onSave, onChange }: TaskEditDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription className="text-[11px] sm:text-xs">
            Modify task details and scheduling constraints.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:py-4">
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
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
        </div>
        <DialogFooter className="flex-row gap-2 sm:gap-0">
          <Button variant="outline" className="flex-1 sm:flex-none text-xs" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 sm:flex-none text-xs" onClick={() => onSave(task)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
