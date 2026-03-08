import { Task } from './types';

export interface ProductivityMetrics {
  // Completion metrics
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  
  // Time metrics
  totalEstimatedMinutes: number;
  totalActualMinutes: number;
  estimateAccuracy: number;
  
  // Priority breakdown
  highPriorityCompleted: number;
  highPriorityTotal: number;
  mediumPriorityCompleted: number;
  mediumPriorityTotal: number;
  lowPriorityCompleted: number;
  lowPriorityTotal: number;
  
  // Category breakdown
  categoryStats: Array<{
    category: string;
    completed: number;
    total: number;
    timeSpent: number;
  }>;
  
  // Trends
  dailyCompletionTrend: Array<{
    date: string;
    completed: number;
    total: number;
  }>;
  
  // Patterns
  mostProductiveHour?: number;
  averageTaskDuration: number;
  overdueCount: number;
}

/**
 * Calculate comprehensive productivity metrics
 */
export function calculateProductivityMetrics(tasks: Task[], days: number = 7): ProductivityMetrics {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // Filter tasks within date range
  const recentTasks = tasks.filter(task => {
    if (!task.createdAt) return false;
    return new Date(task.createdAt) >= cutoffDate;
  });
  
  const completedTasks = recentTasks.filter(t => t.isCompleted);
  
  // Basic metrics
  const totalTasks = recentTasks.length;
  const completedCount = completedTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  
  // Time metrics
  const totalEstimatedMinutes = recentTasks.reduce((sum, t) => sum + t.estimatedTimeMinutes, 0);
  const totalActualMinutes = completedTasks.reduce((sum, t) => sum + (t.actualTimeMinutes || t.estimatedTimeMinutes), 0);
  const estimateAccuracy = totalEstimatedMinutes > 0 
    ? Math.round((totalActualMinutes / totalEstimatedMinutes) * 100) 
    : 100;
  
  // Priority breakdown
  const highPriorityTasks = recentTasks.filter(t => t.priority === 'high');
  const mediumPriorityTasks = recentTasks.filter(t => t.priority === 'medium');
  const lowPriorityTasks = recentTasks.filter(t => t.priority === 'low');
  
  // Category stats
  const categoryMap = new Map<string, { completed: number; total: number; timeSpent: number }>();
  recentTasks.forEach(task => {
    const category = task.category || 'Uncategorized';
    const existing = categoryMap.get(category) || { completed: 0, total: 0, timeSpent: 0 };
    categoryMap.set(category, {
      completed: existing.completed + (task.isCompleted ? 1 : 0),
      total: existing.total + 1,
      timeSpent: existing.timeSpent + (task.actualTimeMinutes || task.estimatedTimeMinutes),
    });
  });
  
  const categoryStats = Array.from(categoryMap.entries())
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.total - a.total);
  
  // Daily completion trend
  const dailyMap = new Map<string, { completed: number; total: number }>();
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    dailyMap.set(dateStr, { completed: 0, total: 0 });
  }
  
  recentTasks.forEach(task => {
    if (!task.createdAt) return;
    const dateStr = task.createdAt.split('T')[0];
    const existing = dailyMap.get(dateStr);
    if (existing) {
      existing.total++;
      if (task.isCompleted) existing.completed++;
    }
  });
  
  const dailyCompletionTrend = Array.from(dailyMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .reverse();
  
  // Most productive hour (based on completed tasks)
  const hourMap = new Map<number, number>();
  completedTasks.forEach(task => {
    if (task.completedAt) {
      const hour = new Date(task.completedAt).getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    }
  });
  
  let mostProductiveHour: number | undefined;
  let maxCompletions = 0;
  hourMap.forEach((count, hour) => {
    if (count > maxCompletions) {
      maxCompletions = count;
      mostProductiveHour = hour;
    }
  });
  
  // Average task duration
  const averageTaskDuration = completedTasks.length > 0
    ? Math.round(totalActualMinutes / completedTasks.length)
    : 0;
  
  // Overdue tasks
  const overdueCount = recentTasks.filter(task => {
    if (!task.dueDate || task.isCompleted) return false;
    return new Date(task.dueDate) < now;
  }).length;
  
  return {
    totalTasks,
    completedTasks: completedCount,
    completionRate,
    totalEstimatedMinutes,
    totalActualMinutes,
    estimateAccuracy,
    highPriorityCompleted: highPriorityTasks.filter(t => t.isCompleted).length,
    highPriorityTotal: highPriorityTasks.length,
    mediumPriorityCompleted: mediumPriorityTasks.filter(t => t.isCompleted).length,
    mediumPriorityTotal: mediumPriorityTasks.length,
    lowPriorityCompleted: lowPriorityTasks.filter(t => t.isCompleted).length,
    lowPriorityTotal: lowPriorityTasks.length,
    categoryStats,
    dailyCompletionTrend,
    mostProductiveHour,
    averageTaskDuration,
    overdueCount,
  };
}

/**
 * Get productivity insights and recommendations
 */
export function getProductivityInsights(metrics: ProductivityMetrics): string[] {
  const insights: string[] = [];
  
  // Completion rate insights
  if (metrics.completionRate >= 80) {
    insights.push("🎉 Excellent completion rate! You're crushing your goals.");
  } else if (metrics.completionRate >= 60) {
    insights.push("👍 Good completion rate. Keep up the momentum!");
  } else if (metrics.completionRate >= 40) {
    insights.push("💡 Consider breaking down large tasks into smaller, manageable pieces.");
  } else {
    insights.push("⚠️ Low completion rate. Try reducing your task load or extending deadlines.");
  }
  
  // Estimate accuracy insights
  if (metrics.estimateAccuracy > 120) {
    insights.push("⏱️ Tasks are taking longer than estimated. Consider adding buffer time.");
  } else if (metrics.estimateAccuracy < 80) {
    insights.push("⚡ You're completing tasks faster than expected! Great efficiency.");
  }
  
  // Priority insights
  const highPriorityRate = metrics.highPriorityTotal > 0
    ? (metrics.highPriorityCompleted / metrics.highPriorityTotal) * 100
    : 0;
  
  if (highPriorityRate < 50 && metrics.highPriorityTotal > 0) {
    insights.push("🎯 Focus on high-priority tasks first to maximize impact.");
  }
  
  // Overdue insights
  if (metrics.overdueCount > 0) {
    insights.push(`📅 You have ${metrics.overdueCount} overdue task${metrics.overdueCount > 1 ? 's' : ''}. Consider rescheduling or delegating.`);
  }
  
  // Productive hour insight
  if (metrics.mostProductiveHour !== undefined) {
    const hour = metrics.mostProductiveHour;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    insights.push(`🌟 Your most productive hour is ${displayHour}${period}. Schedule important tasks then!`);
  }
  
  // Category insights
  if (metrics.categoryStats.length > 0) {
    const topCategory = metrics.categoryStats[0];
    insights.push(`📊 Most active category: ${topCategory.category} (${topCategory.total} tasks)`);
  }
  
  return insights;
}

/**
 * Calculate streak (consecutive days with completed tasks)
 */
export function calculateStreak(tasks: Task[]): number {
  const completedTasks = tasks.filter(t => t.isCompleted && t.completedAt);
  if (completedTasks.length === 0) return 0;
  
  // Sort by completion date
  const sorted = completedTasks.sort((a, b) => 
    new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const task of sorted) {
    const taskDate = new Date(task.completedAt!);
    taskDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }
  
  return streak;
}
