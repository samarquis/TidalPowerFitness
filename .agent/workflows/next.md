---
description: Resume work and see what's next
---

# Resume Work Workflow

Use this workflow when you're starting a new work session and want to know what to work on next.

## What This Does
1. Reviews your TODO.md for pending tasks
2. Shows recent progress from PROGRESS.md
3. Highlights any blockers from last session
4. Suggests the next logical task to work on
5. Provides context from previous work

## How to Use
Simply say: **"What's next?"** or **"Resume work"** or use the command `/next`

The AI will:
- Show you what was accomplished in the last session
- Review pending tasks from TODO.md
- Identify any blockers or issues
- Recommend what to work on next based on priority
- Provide context and files you might need

## What Gets Reviewed
- `PROJECT_STATUS.md` - Current roadmap, pending tasks, and recent session history.
- Recent conversation summaries

## Example
```
You: /next

AI: Welcome back! Here's where we left off:

📅 Last Session (Nov 25, 2025):
✅ Cleaned up markdown documentation
✅ Added 4 new TODO items

📋 Pending Tasks:
1. Fix workout template loading issue (/workouts/templates/new)
2. Fix workout history loading issue (/workouts/history)
3. Add calendar view for classes
4. Create user dashboard

💡 Recommended Next Step:
Start with fixing the workout template loading issue since it's blocking user functionality.

Would you like to start with that?
```
