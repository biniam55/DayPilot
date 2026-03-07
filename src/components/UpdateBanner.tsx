import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpdateBannerProps {
  show: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export function UpdateBanner({ show, onUpdate, onDismiss }: UpdateBannerProps) {
  if (!show) return null;

  return (
    <div className={cn(
      "fixed top-16 left-0 right-0 z-50 mx-auto max-w-2xl px-4 animate-in slide-in-from-top duration-300",
      "md:left-64" // Account for sidebar on desktop
    )}>
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <RefreshCw className="w-5 h-5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Update Available</p>
            <p className="text-xs opacity-90">A new version of DayPilot is ready</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={onUpdate}
            className="h-8 text-xs"
          >
            Update Now
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onDismiss}
            className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
