# 🤖 AI Schedule Assistant Guide

## What It Does

The AI Schedule Assistant uses Google's Gemini AI to automatically organize your tasks into an optimal daily schedule based on:
- Task priorities (high, medium, low)
- Estimated time for each task
- Your work hours
- Preferred break times

## How to Use

### 1. Add Some Tasks
- Go to "My Planner" view
- Add at least 2-3 tasks with different priorities
- Set estimated time for each task

### 2. Configure Work Hours (Optional)
- Go to Settings
- Set your work day start and end times
- Default: 9:00 AM - 6:00 PM

### 3. Generate Schedule
- In the "My Planner" view, look for the "AI Schedule Assistant" card
- On desktop: It's on the right side
- On mobile: Tap "AI Tips" button
- Click "Generate Daily Plan"

### 4. Review the Schedule
- AI will organize your tasks
- You'll see an explanation of how tasks were scheduled
- Tasks are prioritized: High → Medium → Low
- Breaks are automatically included

## Features

✅ **Smart Prioritization**
- High priority tasks scheduled first
- Considers task duration
- Respects work hours

✅ **Break Management**
- Includes lunch breaks
- Prevents task overlap
- Maintains work-life balance

✅ **Conflict Resolution**
- Handles tasks that don't fit
- Provides explanations
- Suggests alternatives

✅ **Real-time Updates**
- Instant schedule generation
- Updates your task list
- Shows AI reasoning

## Requirements

### Environment Variables (Already Set)
```env
GOOGLE_GENAI_API_KEY=your_api_key_here
```

This is already configured in your Vercel deployment!

## Troubleshooting

### "Failed to generate schedule"

**Possible causes:**
1. API key not configured in Vercel
2. No tasks to schedule
3. Network connection issue

**Solutions:**
1. Check Vercel environment variables
2. Add at least one task
3. Try again in a few seconds

### "Error: API key not found"

**Solution:**
Go to Vercel dashboard:
1. Project Settings → Environment Variables
2. Add `GOOGLE_GENAI_API_KEY`
3. Redeploy

### AI Takes Too Long

**Normal behavior:**
- First request: 5-10 seconds
- Subsequent requests: 2-5 seconds

**If it takes longer:**
- Check your internet connection
- Try with fewer tasks (start with 3-5)
- Refresh the page and try again

## Example Usage

### Scenario 1: Busy Work Day

**Input:**
- 5 tasks (2 high, 2 medium, 1 low priority)
- Work hours: 9:00 AM - 6:00 PM
- Lunch break: 12:30 PM (60 min)

**AI Output:**
```
9:00 AM - 10:00 AM: Project presentation prep (High)
10:00 AM - 10:45 AM: Weekly Sync (High)
10:45 AM - 11:15 AM: Email review (Medium)
11:15 AM - 12:30 PM: Documentation update (Medium)
12:30 PM - 1:30 PM: Lunch Break
1:30 PM - 3:00 PM: Gym session (Low)
```

### Scenario 2: Light Day

**Input:**
- 2 tasks (1 high, 1 medium)
- Work hours: 9:00 AM - 5:00 PM

**AI Output:**
```
9:00 AM - 10:00 AM: Important meeting (High)
10:00 AM - 10:30 AM: Follow-up emails (Medium)
10:30 AM - 5:00 PM: Free time
```

## API Details

### Endpoint
```
POST /api/schedule
```

### Request Body
```json
{
  "tasks": [
    {
      "id": "task-1",
      "name": "Task name",
      "description": "Task description",
      "priority": "high",
      "estimatedDurationMinutes": 60,
      "category": "Work",
      "dueDate": "2024-05-20"
    }
  ],
  "preferences": {
    "workDayStart": "09:00",
    "workDayEnd": "18:00",
    "preferredBreaks": [
      {
        "start": "12:30",
        "durationMinutes": 60
      }
    ]
  }
}
```

### Response
```json
{
  "scheduledTasks": [
    {
      "id": "task-1",
      "name": "Task name",
      "startTime": "09:00",
      "endTime": "10:00",
      "priority": "high"
    }
  ],
  "unscheduledTasks": [],
  "explanation": "Your schedule has been optimized..."
}
```

## Best Practices

### 1. Realistic Time Estimates
- Be honest about task duration
- Add buffer time for complex tasks
- Consider breaks between tasks

### 2. Clear Priorities
- Use "High" for urgent/important tasks
- Use "Medium" for regular work
- Use "Low" for nice-to-have tasks

### 3. Regular Updates
- Regenerate schedule when tasks change
- Update as you complete tasks
- Adjust work hours as needed

### 4. Task Descriptions
- Add context to help AI understand
- Mention dependencies
- Note any constraints

## Advanced Features (Coming Soon)

- [ ] Multi-day scheduling
- [ ] Recurring tasks
- [ ] Team coordination
- [ ] Calendar integration
- [ ] Smart rescheduling
- [ ] Learning from your patterns

## Cost & Limits

### Google Gemini API
- **Free tier:** 60 requests per minute
- **Cost:** Very low (fractions of a cent per request)
- **Your usage:** Typically 5-10 requests per day

### Vercel
- **Free tier:** Unlimited API calls
- **No additional cost** for AI features

## Privacy & Security

✅ **Your data is safe:**
- Tasks sent to Google Gemini for processing
- No data stored by Google after processing
- API key encrypted in Vercel
- HTTPS encryption for all requests

❌ **Not sent to AI:**
- User profile information
- Completed task history
- Personal preferences (except work hours)

## Support

### Need Help?
1. Check browser console for errors (F12)
2. Verify environment variables in Vercel
3. Try with a simple test case (2-3 tasks)
4. Check API key is valid

### Report Issues
If AI Assistant isn't working:
1. Note the error message
2. Check what tasks you were trying to schedule
3. Verify your work hours are set correctly

---

**The AI Assistant is now fully functional!** 🎉

Try it out:
1. Add a few tasks
2. Click "Generate Daily Plan"
3. Watch AI organize your day!
