"use client"

import React, { useState } from 'react';
import { TaskTemplate } from "@/lib/types";
import { getAllTemplates, generateTasksFromTemplate } from "@/lib/templates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Clock, CheckCircle2 } from "lucide-react";

interface TemplatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: TaskTemplate) => void;
  customTemplates?: TaskTemplate[];
}

export function TemplatesDialog({ 
  isOpen, 
  onClose, 
  onApplyTemplate,
  customTemplates = []
}: TemplatesDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const allTemplates = getAllTemplates(customTemplates);
  
  const workflows = allTemplates.filter(t => t.category === 'workflow');
  const routines = allTemplates.filter(t => t.category === 'routine');
  const custom = allTemplates.filter(t => t.category === 'custom');

  const handleApply = () => {
    if (selectedTemplate) {
      onApplyTemplate(selectedTemplate);
      onClose();
    }
  };

  const TemplateCard = ({ template }: { template: TaskTemplate }) => {
    const isSelected = selectedTemplate?.id === template.id;
    const totalTime = template.tasks.reduce((sum, t) => sum + t.estimatedTimeMinutes, 0);
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;

    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => setSelectedTemplate(template)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{template.icon}</span>
              <div>
                <CardTitle className="text-sm">{template.name}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {template.description}
                </CardDescription>
              </div>
            </div>
            {isSelected && (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {hours > 0 && `${hours}h `}{minutes}m
            </div>
            <div>{template.tasks.length} tasks</div>
            {template.usageCount !== undefined && (
              <div>Used {template.usageCount}x</div>
            )}
          </div>
          
          <div className="space-y-1">
            {template.tasks.slice(0, 3).map((task, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span className="truncate">{task.name}</span>
              </div>
            ))}
            {template.tasks.length > 3 && (
              <div className="text-xs text-muted-foreground pl-3.5">
                +{template.tasks.length - 3} more tasks
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <DialogTitle>Task Templates & Routines</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Choose a template to quickly add multiple related tasks
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="workflows" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="workflows" className="text-xs">
              Workflows ({workflows.length})
            </TabsTrigger>
            <TabsTrigger value="routines" className="text-xs">
              Routines ({routines.length})
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-xs">
              Custom ({custom.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workflows.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="routines" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routines.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="custom" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full pr-4">
              {custom.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {custom.map(template => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-sm font-medium mb-2">No custom templates yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Create custom templates by selecting multiple tasks and saving them as a template
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between gap-4 pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            {selectedTemplate && (
              <span>
                Selected: <span className="font-medium">{selectedTemplate.name}</span>
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button 
              onClick={handleApply} 
              disabled={!selectedTemplate}
              className="text-xs"
            >
              Apply Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
