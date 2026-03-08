import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export interface KeyboardShortcutHandlers {
  onNewTask?: () => void;
  onSearch?: () => void;
  onToggleComplete?: () => void;
  onNavigateDashboard?: () => void;
  onNavigatePlanner?: () => void;
  onNavigateCategories?: () => void;
  onNavigateCalendar?: () => void;
  onNavigateAnalytics?: () => void;
  onFocusMode?: () => void;
  onQuickAdd?: () => void;
  onHelp?: () => void;
}

/**
 * Hook to manage keyboard shortcuts
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow Escape to blur inputs
      if (event.key === 'Escape') {
        target.blur();
      }
      return;
    }

    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    const cmdOrCtrl = ctrlKey || metaKey; // Support both Ctrl (Windows) and Cmd (Mac)

    // Ctrl/Cmd + N - New Task
    if (cmdOrCtrl && key === 'n' && handlers.onNewTask) {
      event.preventDefault();
      handlers.onNewTask();
    }

    // Ctrl/Cmd + K - Search
    if (cmdOrCtrl && key === 'k' && handlers.onSearch) {
      event.preventDefault();
      handlers.onSearch();
    }

    // Ctrl/Cmd + Enter - Toggle Complete (when task is focused)
    if (cmdOrCtrl && key === 'Enter' && handlers.onToggleComplete) {
      event.preventDefault();
      handlers.onToggleComplete();
    }

    // Ctrl/Cmd + 1-5 - Navigate views
    if (cmdOrCtrl && !shiftKey && !altKey) {
      switch (key) {
        case '1':
          event.preventDefault();
          handlers.onNavigateDashboard?.();
          break;
        case '2':
          event.preventDefault();
          handlers.onNavigatePlanner?.();
          break;
        case '3':
          event.preventDefault();
          handlers.onNavigateCategories?.();
          break;
        case '4':
          event.preventDefault();
          handlers.onNavigateCalendar?.();
          break;
        case '5':
          event.preventDefault();
          handlers.onNavigateAnalytics?.();
          break;
      }
    }

    // Ctrl/Cmd + Shift + F - Focus Mode
    if (cmdOrCtrl && shiftKey && key === 'F' && handlers.onFocusMode) {
      event.preventDefault();
      handlers.onFocusMode();
    }

    // Q - Quick Add (when not in input)
    if (key === 'q' && !cmdOrCtrl && !shiftKey && !altKey && handlers.onQuickAdd) {
      event.preventDefault();
      handlers.onQuickAdd();
    }

    // ? - Help
    if (key === '?' && handlers.onHelp) {
      event.preventDefault();
      handlers.onHelp();
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Get all available shortcuts
 */
export function getAvailableShortcuts(): KeyboardShortcut[] {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  return [
    {
      key: 'N',
      ctrl: true,
      description: 'Create new task',
      action: () => {},
    },
    {
      key: 'K',
      ctrl: true,
      description: 'Search tasks',
      action: () => {},
    },
    {
      key: 'Enter',
      ctrl: true,
      description: 'Toggle task completion',
      action: () => {},
    },
    {
      key: '1',
      ctrl: true,
      description: 'Go to Dashboard',
      action: () => {},
    },
    {
      key: '2',
      ctrl: true,
      description: 'Go to Planner',
      action: () => {},
    },
    {
      key: '3',
      ctrl: true,
      description: 'Go to Categories',
      action: () => {},
    },
    {
      key: '4',
      ctrl: true,
      description: 'Go to Calendar',
      action: () => {},
    },
    {
      key: '5',
      ctrl: true,
      description: 'Go to Analytics',
      action: () => {},
    },
    {
      key: 'F',
      ctrl: true,
      shift: true,
      description: 'Toggle focus mode',
      action: () => {},
    },
    {
      key: 'Q',
      description: 'Quick add task',
      action: () => {},
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => {},
    },
  ];
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const parts: string[] = [];

  if (shortcut.ctrl) parts.push(isMac ? '⌘' : 'Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  parts.push(shortcut.key);

  return parts.join(' + ');
}
