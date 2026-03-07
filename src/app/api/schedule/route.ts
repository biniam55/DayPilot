import { NextRequest, NextResponse } from 'next/server';
import { suggestOptimalDailySchedule } from '@/ai/flows/ai-suggest-optimal-daily-schedule';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.tasks || !body.preferences) {
      return NextResponse.json(
        { error: 'Missing required fields: tasks and preferences' },
        { status: 400 }
      );
    }

    // Call the AI flow
    const result = await suggestOptimalDailySchedule({
      tasks: body.tasks,
      preferences: body.preferences,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Schedule API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate schedule' },
      { status: 500 }
    );
  }
}
