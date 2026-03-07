"use client"

import React, { lazy, Suspense } from 'react';
import { useDashboardState } from "@/hooks/useDashboardState";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load view components
const DashboardView = lazy(() => import("@/components/DashboardView").then(m => ({ default: m.DashboardView })));
const PlannerView = lazy(() => import("@/components/PlannerView").then(m => ({ default: m.PlannerView })));
const CategoriesView = lazy(() => import("@/components/CategoriesView").then(m => ({ default: m.CategoriesView })));
const CalendarView = lazy(() => import("@/components/CalendarView").then(m => ({ default: m.CalendarView })));
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
    updateTask,
    deleteTask,
    toggleTaskComplete,
    handleScheduleUpdate,
    savePreferences,
    saveProfile,
  } = useDashboardState();

  const handleViewChange = (newView: 'dashboard' | 'planner' | 'categories' | 'calendar' | 'settings') => {
    setView(newView);
  };

  const navContent = (
    <DashboardSidebar 
      view={view} 
      stats={stats} 
      onViewChange={handleViewChange}
      onMobileMenuClose={() => setIsMobileMenuOpen(false)}
    />
  );

  return (
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

            {view === 'settings' && (
              <SettingsView
                profile={profile}
                preferences={preferences}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                onEditProfile={() => setIsEditingProfile(true)}
                onPreferencesChange={setPreferences}
                onSavePreferences={() => savePreferences(preferences)}
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
    </div>
  );
}
