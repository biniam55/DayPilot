"use client"

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Task } from "@/lib/types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  CheckCircle2, 
  Circle,
  LayoutDashboard,
  Compass,
  ListTodo,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onNavigate: (view: string) => void;
  onNewTask: () => void;
  onTemplates: () => void;
}

type CommandItem = {
  id: string;
  type: 'task' | 'navigation' | 'action';
  title: string;
  subtitle?: string;
  icon?: any;
  badge?: string;
  action: () => void;
};

export function CommandPalette({ 
  isOpen, 
  onClose, 
  tasks,
  onSelectTask,
  onNavigate,
  onNewTask,
  onTemplates
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Build command items
  const allItems = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // Navigation commands
    items.push(
      {
        id: 'nav-dashboard',
        type: 'navigation',
        title: 'Go to Dashboard',
        icon: LayoutDashboard,
        action: () => { onNavigate('dashboard'); onClose(); },
      },
      {
        id: 'nav-planner',
        type: 'navigation',
        title: 'Go to Planner',
        icon: Compass,
        action: () => { onNavigate('planner'); onClose(); },
      },
      {
        id: 'nav-categories',
        type: 'navigation',
        title: 'Go to Categories',
        icon: ListTodo,
        action: () => { onNavigate('categories'); onClose(); },
      },
      {
        id: 'nav-calendar',
        type: 'navigation',
        title: 'Go to Calendar',
        icon: Calendar,
        action: () => { onNavigate('calendar'); onClose(); },
      },
      {
        id: 'nav-analytics',
        type: 'navigation',
        title: 'Go to Analytics',
        icon: BarChart3,
        action: () => { onNavigate('analytics'); onClose(); },
      },
      {
        id: 'nav-settings',
        type: 'navigation',
        title: 'Go to Settings',
        icon: Settings,
        action: () => { onNavigate('settings'); onClose(); },
      }
    );

    // Action commands
    items.push(
      {
        id: 'action-new-task',
        type: 'action',
        title: 'Create New Task',
        icon: Plus,
        action: () => { onNewTask(); onClose(); },
      },
      {
        id: 'action-templates',
        type: 'action',
        title: 'Browse Templates',
        icon: Sparkles,
        action: () => { onTemplates(); onClose(); },
      }
    );

    // Task commands
    tasks.forEach(task => {
      items.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.name,
        subtitle: task.category,
        badge: task.priority,
        icon: task.isCompleted ? CheckCircle2 : Circle,
        action: () => { onSelectTask(task); onClose(); },
      });
    });

    return items;
  }, [tasks, onNavigate, onSelectTask, onNewTask, onTemplates, onClose]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!search) return allItems;

    const searchLower = search.toLowerCase();
    return allItems.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.subtitle?.toLowerCase().includes(searchLower)
    );
  }, [allItems, search]);

  // Reset selection when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    itemsRef.current[selectedIndex]?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const getItemIcon = (item: CommandItem) => {
    const Icon = item.icon;
    if (!Icon) return null;

    const iconClass = cn(
      "w-4 h-4",
      item.type === 'task' && item.icon === CheckCircle2 && "text-green-500"
    );

    return <Icon className={iconClass} />;
  };

  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search tasks, navigate, or run commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 text-sm h-auto p-0"
          />
        </div>

        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    ref={el => itemsRef.current[index] = el}
                    onClick={item.action}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                      index === selectedIndex 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    {getItemIcon(item)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    {item.badge && (
                      <Badge 
                        variant={getBadgeColor(item.badge)} 
                        className="text-xs shrink-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-4 py-2 border-t bg-muted/20 text-xs text-muted-foreground flex items-center gap-4">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
