import React, { useState } from 'react';
import { UserPreferences, UserProfile, Task } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun, Download, Upload } from "lucide-react";
import { ExportImportDialog } from "@/components/ExportImportDialog";
import { NotificationSettings } from "@/components/NotificationSettings";
import { NotificationPermission } from '@/lib/notifications';

interface SettingsViewProps {
  profile: UserProfile;
  preferences: UserPreferences;
  isDarkMode: boolean;
  tasks: Task[];
  notificationPermission: NotificationPermission;
  notificationSupported: boolean;
  notificationSettings: any;
  onToggleDarkMode: () => void;
  onEditProfile: () => void;
  onPreferencesChange: (prefs: UserPreferences) => void;
  onSavePreferences: () => void;
  onImportTasks: (tasks: Task[]) => void;
  onRequestNotificationPermission: () => Promise<NotificationPermission>;
  onUpdateNotificationSettings: (settings: any) => void;
}

export function SettingsView({
  profile,
  preferences,
  isDarkMode,
  tasks,
  notificationPermission,
  notificationSupported,
  notificationSettings,
  onToggleDarkMode,
  onEditProfile,
  onPreferencesChange,
  onSavePreferences,
  onImportTasks,
  onRequestNotificationPermission,
  onUpdateNotificationSettings
}: SettingsViewProps) {
  const [showExportImport, setShowExportImport] = useState(false);
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6 pb-20">
        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Profile Settings</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-bold text-sm sm:text-base">{profile.name}</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">{profile.email}</p>
              <Button variant="outline" size="sm" className="mt-2 h-8 text-[10px] sm:text-xs" onClick={onEditProfile}>
                Change Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Appearance</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">Customize how DayPilot looks</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/20 rounded-lg border">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <Label className="text-xs sm:text-sm">Dark Mode</Label>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg text-primary">Work Schedule</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">Used by AI to optimize your planner</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">Start of Day</Label>
                <Input 
                  type="time" 
                  className="text-xs" 
                  value={preferences.workDayStart} 
                  onChange={(e) => onPreferencesChange({...preferences, workDayStart: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">End of Day</Label>
                <Input 
                  type="time" 
                  className="text-xs" 
                  value={preferences.workDayEnd} 
                  onChange={(e) => onPreferencesChange({...preferences, workDayEnd: e.target.value})} 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 p-4 sm:p-6">
            <Button onClick={onSavePreferences} className="w-full text-xs sm:text-sm">Save Work Schedule</Button>
          </CardFooter>
        </Card>

        <NotificationSettings
          permission={notificationPermission}
          isSupported={notificationSupported}
          settings={notificationSettings}
          onRequestPermission={onRequestNotificationPermission}
          onUpdateSettings={onUpdateNotificationSettings}
        />

        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Data Management</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">Export or import your tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => setShowExportImport(true)}
            >
              <Download className="w-4 h-4" />
              <Upload className="w-4 h-4" />
              Export / Import Tasks
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">About</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">App information and version</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex justify-between items-center p-3 sm:p-4 bg-muted/20 rounded-lg border">
              <div>
                <Label className="text-xs sm:text-sm">App Version</Label>
                <p className="text-[10px] text-muted-foreground mt-1">DayPilot v1.0.2</p>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground text-center">
              <p>Made with ❤️ for productivity</p>
              <p className="mt-1">© 2024 DayPilot</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ExportImportDialog
        isOpen={showExportImport}
        onClose={() => setShowExportImport(false)}
        tasks={tasks}
        onImport={onImportTasks}
      />
    </ScrollArea>
  );
}
