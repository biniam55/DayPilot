"use client"

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";
import { getAvailableShortcuts, formatShortcut } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  const shortcuts = getAvailableShortcuts();

  const categories = [
    {
      name: 'General',
      shortcuts: shortcuts.filter(s => 
        ['N', 'K', 'Q', '?'].includes(s.key)
      ),
    },
    {
      name: 'Navigation',
      shortcuts: shortcuts.filter(s => 
        ['1', '2', '3', '4', '5'].includes(s.key)
      ),
    },
    {
      name: 'Actions',
      shortcuts: shortcuts.filter(s => 
        ['Enter', 'F'].includes(s.key)
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Speed up your workflow with these shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {categories.map(category => (
            <div key={category.name}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {formatShortcut(shortcut)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Press <Badge variant="outline" className="mx-1 font-mono text-xs">?</Badge> 
            anytime to view this help dialog.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
