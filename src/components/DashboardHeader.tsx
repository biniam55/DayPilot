import React from 'react';
import { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Moon, Sun, User, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type?: 'info' | 'update' | 'success';
  action?: () => void;
  actionLabel?: string;
}

interface DashboardHeaderProps {
  view: string;
  profile: UserProfile;
  isDarkMode: boolean;
  notifications: Notification[];
  isMobileMenuOpen: boolean;
  onToggleDarkMode: () => void;
  onEditProfile: () => void;
  onMobileMenuChange: (open: boolean) => void;
  navContent: React.ReactNode;
}

export function DashboardHeader({
  view,
  profile,
  isDarkMode,
  notifications,
  isMobileMenuOpen,
  onToggleDarkMode,
  onEditProfile,
  onMobileMenuChange,
  navContent
}: DashboardHeaderProps) {
  const viewTitles: Record<string, string> = {
    planner: 'Daily Plan',
    dashboard: 'Dashboard',
    categories: 'Categories',
    calendar: 'Calendar',
    settings: 'Settings'
  };

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={onMobileMenuChange}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-card border-r">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Main navigation menu for DayPilot</SheetDescription>
            {navContent}
          </SheetContent>
        </Sheet>
        <h2 className="text-sm sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none">
          {viewTitles[view] || 'Dashboard'}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" onClick={onToggleDarkMode}>
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
              <Bell className="w-4 h-4" />
              {notifications.some(n => !n.isRead) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-64">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <DropdownMenuItem 
                    key={n.id} 
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-accent"
                    onClick={n.action}
                  >
                    <div className="flex w-full justify-between gap-2">
                      <span className={cn("text-xs font-bold", !n.isRead && "text-primary")}>{n.title}</span>
                      <span className="text-[9px] text-muted-foreground shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{n.description}</p>
                    {n.actionLabel && (
                      <button className="text-[10px] text-primary font-semibold mt-1 hover:underline">
                        {n.actionLabel}
                      </button>
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground italic">No notifications</div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-1 sm:px-2 hover:bg-muted/50 rounded-full">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold leading-none">{profile.name}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onEditProfile}>
              <User className="w-4 h-4 mr-2" /> Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
