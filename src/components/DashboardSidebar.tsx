import React from 'react';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Compass, ListTodo, Calendar as CalendarIcon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  view: string;
  stats: {
    completed: number;
    progress: number;
  };
  onViewChange: (view: string) => void;
  onMobileMenuClose?: () => void;
}

export function DashboardSidebar({ view, stats, onViewChange, onMobileMenuClose }: DashboardSidebarProps) {
  const handleViewChange = (newView: string) => {
    onViewChange(newView);
    onMobileMenuClose?.();
  };

  return (
    <>
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold italic shadow-lg">
          D
        </div>
        <h1 className="text-xl font-bold tracking-tight text-primary">DayPilot</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'planner', icon: Compass, label: 'My Planner' },
          { id: 'categories', icon: ListTodo, label: 'Categories' },
          { id: 'calendar', icon: CalendarIcon, label: 'Calendar' }
        ].map((item) => (
          <Button 
            key={item.id}
            variant="ghost" 
            onClick={() => handleViewChange(item.id)}
            className={cn(
              "w-full justify-start gap-3 h-10 text-sm font-medium", 
              view === item.id ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-muted/40 rounded-xl border border-muted">
          <p className="text-xs font-semibold mb-2">Weekly Goal</p>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-accent transition-all duration-500" 
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            {stats.completed} tasks completed ({stats.progress}%)
          </p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => handleViewChange('settings')}
          className={cn(
            "w-full justify-start gap-3 mt-4 h-10 text-sm font-medium", 
            view === 'settings' ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </>
  );
}
