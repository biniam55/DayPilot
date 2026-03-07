"use client"

import React from 'react';
import { useDashboardState } from "@/hooks/useDashboardState";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardView } from "@/components/DashboardView";
import { PlannerView } from "@/components/PlannerView";
import { CategoriesView } from "@/components/CategoriesView";
import { CalendarView } from "@/components/CalendarView";
import { SettingsView } from "@/components/SettingsView";
import { TaskEditDialog } from "@/components/TaskEditDialog";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";

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

  const navContent = (
    <DashboardSidebar 
      view={view} 
      stats={stats} 
      onViewChange={setView}
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
          {view === 'planner' && (
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
          )}

          {view === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              stats={stats}
              chartData={chartData}
              onNavigate={setView}
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
        </div>
      </main>

      {/* Dialogs */}
      <TaskEditDialog
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
        onChange={setEditingTask}
      />

      <ProfileEditDialog
        isOpen={isEditingProfile}
        profile={profile}
        onClose={() => setIsEditingProfile(false)}
        onSave={saveProfile}
        onChange={setProfile}
      />
    </div>
  );
}
