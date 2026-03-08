"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, BellOff, CheckCircle2, AlertCircle } from "lucide-react";
import { NotificationPermission, showNotification } from '@/lib/notifications';

interface NotificationSettingsProps {
  permission: NotificationPermission;
  isSupported: boolean;
  settings: {
    enabled: boolean;
    taskReminders: boolean;
    overdueAlerts: boolean;
    completionCelebrations: boolean;
    reminderMinutes: number;
  };
  onRequestPermission: () => Promise<NotificationPermission>;
  onUpdateSettings: (settings: any) => void;
}

export function NotificationSettings({
  permission,
  isSupported,
  settings,
  onRequestPermission,
  onUpdateSettings,
}: NotificationSettingsProps) {
  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Notifications Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your browser doesn't support notifications. Please use a modern browser like Chrome, Firefox, or Safari.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
        <CardDescription className="text-xs">
          Get reminders and alerts for your tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Status */}
        {permission === 'denied' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Notifications are blocked. Please enable them in your browser settings.
            </AlertDescription>
          </Alert>
        )}

        {permission === 'default' && (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <div className="flex items-center justify-between gap-4">
                <span>Enable notifications to get task reminders and alerts.</span>
                <Button size="sm" onClick={onRequestPermission}>
                  Enable
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {permission === 'granted' && (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-xs text-green-600 dark:text-green-400">
              Notifications are enabled. You'll receive reminders and alerts.
            </AlertDescription>
          </Alert>
        )}

        {/* Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
            <div>
              <Label className="text-sm">Enable Notifications</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Master switch for all notifications
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) => onUpdateSettings({ enabled })}
              disabled={permission !== 'granted'}
            />
          </div>

          {settings.enabled && permission === 'granted' && (
            <>
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
                <div>
                  <Label className="text-sm">Task Reminders</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified before tasks are due
                  </p>
                </div>
                <Switch
                  checked={settings.taskReminders}
                  onCheckedChange={(taskReminders) => onUpdateSettings({ taskReminders })}
                />
              </div>

              {settings.taskReminders && (
                <div className="pl-4 space-y-2">
                  <Label className="text-xs text-muted-foreground">Remind me</Label>
                  <Select
                    value={settings.reminderMinutes.toString()}
                    onValueChange={(value) => onUpdateSettings({ reminderMinutes: parseInt(value) })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                      <SelectItem value="120">2 hours before</SelectItem>
                      <SelectItem value="1440">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
                <div>
                  <Label className="text-sm">Overdue Alerts</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified about overdue tasks
                  </p>
                </div>
                <Switch
                  checked={settings.overdueAlerts}
                  onCheckedChange={(overdueAlerts) => onUpdateSettings({ overdueAlerts })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
                <div>
                  <Label className="text-sm">Completion Celebrations</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Celebrate when you complete tasks
                  </p>
                </div>
                <Switch
                  checked={settings.completionCelebrations}
                  onCheckedChange={(completionCelebrations) => onUpdateSettings({ completionCelebrations })}
                />
              </div>
            </>
          )}
        </div>

        {/* Test Notification */}
        {permission === 'granted' && settings.enabled && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              showNotification('Test Notification 🔔', {
                body: 'Notifications are working! 🎉',
                icon: '/favicon.ico',
              });
            }}
          >
            Send Test Notification
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
