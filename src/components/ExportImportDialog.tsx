"use client"

import React, { useState, useRef } from 'react';
import { Task } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, 
  Upload, 
  FileJson, 
  FileSpreadsheet, 
  FileText,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { 
  exportTasks, 
  importTasksFromJSON, 
  importTasksFromCSV,
  validateImportedTasks,
  ExportFormat 
} from "@/lib/export";

interface ExportImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export function ExportImportDialog({ 
  isOpen, 
  onClose, 
  tasks,
  onImport 
}: ExportImportDialogProps) {
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = (format: ExportFormat) => {
    try {
      exportTasks(tasks, format);
      setImportStatus({
        type: 'success',
        message: `Successfully exported ${tasks.length} tasks as ${format.toUpperCase()}`,
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Failed to export tasks. Please try again.',
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus({ type: null, message: '' });

    try {
      const text = await file.text();
      let importedTasks: Task[];

      if (file.name.endsWith('.json')) {
        importedTasks = importTasksFromJSON(text);
      } else if (file.name.endsWith('.csv')) {
        importedTasks = importTasksFromCSV(text);
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV.');
      }

      // Validate imported tasks
      const validation = validateImportedTasks(importedTasks);
      if (!validation.valid) {
        throw new Error(`Validation errors:\n${validation.errors.join('\n')}`);
      }

      onImport(importedTasks);
      setImportStatus({
        type: 'success',
        message: `Successfully imported ${importedTasks.length} tasks!`,
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setImportStatus({
        type: 'error',
        message: error.message || 'Failed to import tasks. Please check the file format.',
      });
    }
  };

  const ExportOption = ({ 
    icon: Icon, 
    title, 
    description, 
    format 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    format: ExportFormat;
  }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button 
        size="sm" 
        onClick={() => handleExport(format)}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Export
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export & Import Tasks</DialogTitle>
          <DialogDescription className="text-xs">
            Backup your tasks or import from another source
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-4">
            <div className="space-y-3">
              <ExportOption
                icon={FileJson}
                title="JSON Format"
                description="Complete data with all task properties"
                format="json"
              />
              <ExportOption
                icon={FileSpreadsheet}
                title="CSV Format"
                description="Spreadsheet compatible format"
                format="csv"
              />
              <ExportOption
                icon={FileText}
                title="Markdown Format"
                description="Human-readable text format"
                format="markdown"
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Exports include all tasks ({tasks.length} total). Your data stays private and is downloaded directly to your device.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Import Tasks</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a JSON or CSV file to import tasks
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button asChild>
                    <span className="cursor-pointer">Choose File</span>
                  </Button>
                </Label>
              </div>

              {importStatus.type && (
                <Alert variant={importStatus.type === 'error' ? 'destructive' : 'default'}>
                  {importStatus.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription className="text-xs whitespace-pre-line">
                    {importStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Note:</strong> Importing will add tasks to your existing list. Duplicate IDs will be skipped.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
