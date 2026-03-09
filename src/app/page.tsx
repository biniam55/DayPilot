"use client"

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useNotifications } from "@/hooks/useNotifications";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import { CommandPalette } from "@/components/CommandPalette";
import { TemplatesDialog } from "@/components/TemplatesDialog";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { generateTasksFromTemplate } from "@/lib/templates";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load view components
const DashboardView = lazy(() => import("@/components/DashboardView").then(m => ({ default: m.DashboardView })));
const PlannerView = lazy(() => import("@/components/PlannerView").then(m => ({ default: m.PlannerView })));
const CategoriesView = lazy(() => import("@/components/CategoriesView").then(m => ({ default: m.CategoriesView })));
const CalendarView = lazy(() => import("@/components/CalendarView").then(m => ({ default: m.CalendarView })));
const AnalyticsView = lazy(() => import("@/components/AnalyticsView").then(m => ({ default: m.AnalyticsView })));
const SettingsView = lazy(() => import("@/components/SettingsView").then(m => ({ default: m.SettingsView })));
const TaskEditDialog = lazy(() => import("@/components/TaskEditDialog").then(m => ({ default: m.TaskEditDialog })));
const ProfileEditDialog = lazy(() => import("@/components/ProfileEditDialog").then(m => ({ default: m.ProfileEditDialog })));

const ViewSkeleton = () => (
  <div className="p-8 space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
);

export default function DayPilotDashboard() {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const {
    tasks,
    preferences,
    profile,
    activeTab,
    view,
    editingTask,
    isEditingProfile,
    today,
    isDarkMode,
    isMobileMenuOpen,
    notifications,
    stats,
    chartData,
    setActiveTab,
    setView,
    setEditingTask,
    setIsEditingProfile,
    setToday,
    setIsMobileMenuOpen,
    setPreferences,
    setProfile,
    toggleDarkMode,
    addTask,
    addMultipleTasks,
    importTasks,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    handleScheduleUpdate,
    savePreferences,
    saveProfile,
    setCelebrateCompletionCallback,
    markNotificationRead,
  } = useDashboardState();

  // Notifications
  const {
    permission: notificationPermission,
    settings: notificationSettings,
    isSupported: notificationSupported,
    requestPermission: requestNotificationPermission,
    updateSettings: updateNotificationSettings,
    celebrateCompletion,
  } = useNotifications(tasks);

  // Connect celebration callback to dashboard state
  useEffect(() => {
    setCelebrateCompletionCallback(() => celebrateCompletion);
  }, [celebrateCompletion, setCelebrateCompletionCallback]);

  const handleViewChange = (newView: 'dashboard' | 'planner' | 'categories' | 'calendar' | 'analytics' | 'settings') => {
    setView(newView);
  };

  const handleApplyTemplate = (template: any) => {
    const newTasks = generateTasksFromTemplate(template);
    if (addMultipleTasks) {
      addMultipleTasks(newTasks);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: () => {
      setView('planner');
      // Focus on quick task input would happen here
    },
    onSearch: () => setShowCommandPalette(true),
    onNavigateDashboard: () => setView('dashboard'),
    onNavigatePlanner: () => setView('planner'),
    onNavigateCategories: () => setView('categories'),
    onNavigateCalendar: () => setView('calendar'),
    onNavigateAnalytics: () => setView('analytics'),
    onHelp: () => setShowKeyboardShortcuts(true),
    onQuickAdd: () => {
      setView('planner');
    },
  });

  const navContent = (
    <DashboardSidebar 
      view={view} 
      stats={stats} 
      onViewChange={handleViewChange}
      onMobileMenuClose={() => setIsMobileMenuOpen(false)}
    />
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Sidebar Navigation - Desktop */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col shrink-0">
        {navContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <DashboardHeader
          view={view}
          profile={profile}
          isDarkMode={isDarkMode}
          notifications={notifications}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleDarkMode={toggleDarkMode}
          onEditProfile={() => setIsEditingProfile(true)}
          onMobileMenuChange={setIsMobileMenuOpen}
          onMarkNotificationRead={markNotificationRead}
          navContent={navContent}
        />

        <div className="flex-1 min-h-0 overflow-hidden relative">
          <Suspense fallback={<ViewSkeleton />}>
            {view === 'planner' && (
              <div className="h-full w-full overflow-hidden">
                <PlannerView
                  tasks={tasks}
                  preferences={preferences}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onAddTask={addTask}
                  onToggleComplete={toggleTaskComplete}
                  onEditTask={setEditingTask}
                  onDeleteTask={deleteTask}
                  onScheduleUpdate={handleScheduleUpdate}
                  onAddMultipleTasks={addMultipleTasks}
                />
              </div>
            )}

            {view === 'dashboard' && (
              <DashboardView
                tasks={tasks}
                stats={stats}
                chartData={chartData}
                onNavigate={handleViewChange}
              />
            )}

            {view === 'categories' && (
              <CategoriesView tasks={tasks} />
            )}

            {view === 'calendar' && (
              <CalendarView
                today={today}
                onSelectDate={(date) => date && setToday(date)}
              />
            )}

            {view === 'analytics' && (
              <AnalyticsView tasks={tasks} />
            )}

            {view === 'settings' && (
              <SettingsView
                profile={profile}
                preferences={preferences}
                isDarkMode={isDarkMode}
                tasks={tasks}
                notificationPermission={notificationPermission}
                notificationSupported={notificationSupported}
                notificationSettings={notificationSettings}
                onToggleDarkMode={toggleDarkMode}
                onEditProfile={() => setIsEditingProfile(true)}
                onPreferencesChange={setPreferences}
                onSavePreferences={() => savePreferences(preferences)}
                onImportTasks={importTasks}
                onRequestNotificationPermission={requestNotificationPermission}
                onUpdateNotificationSettings={updateNotificationSettings}
              />
            )}
          </Suspense>
        </div>
      </main>

      {/* Dialogs */}
      <Suspense fallback={null}>
        {editingTask && (
          <TaskEditDialog
            task={editingTask}
            allTasks={tasks}
            onClose={() => setEditingTask(null)}
            onSave={updateTask}
            onChange={setEditingTask}
          />
        )}

        {isEditingProfile && (
          <ProfileEditDialog
            isOpen={isEditingProfile}
            profile={profile}
            onClose={() => setIsEditingProfile(false)}
            onSave={saveProfile}
            onChange={setProfile}
          />
        )}
      </Suspense>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        tasks={tasks}
        onSelectTask={setEditingTask}
        onNavigate={handleViewChange}
        onNewTask={() => setView('planner')}
        onTemplates={() => setShowTemplates(true)}
      />

      {/* Templates Dialog */}
      <TemplatesDialog
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onApplyTemplate={handleApplyTemplate}
      />

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
    </ProtectedRoute>
  );
}
