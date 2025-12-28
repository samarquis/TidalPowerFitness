# How to Import Exercises (One-Command Setup!)

The exercise import is now a **complete one-command solution** that:
1. ✅ Creates all body parts (Arms, Chest, Shoulders, Back, Core, Legs, Other)
2. ✅ Creates all muscle groups under each body part (Biceps, Triceps, Quads, etc.)
3. ✅ Creates all workout types (Strength, Cardio, Flexibility, HIIT)
4. ✅ Imports **800+ exercises** from free-exercise-db (Public Domain/Unlicense)

**Data Source:** https://github.com/yuhonas/free-exercise-db
**License:** Public Domain (Unlicense) - Free to use!

---

## Running the Import

### Option 1: From Production (Recommended)

1. **Log in as admin** on your deployed site
2. Open browser DevTools (F12) → Console tab
3. Run this command:

```javascript
fetch(`${window.location.origin}/api/import/exercises`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(r => r.json())
.then(data => console.log('✅ Import complete:', data))
.catch(err => console.error('❌ Import error:', err));
```

### Option 2: From Command Line (Production)

```bash
# Replace YOUR_TOKEN with your admin token
curl -X POST https://tidal-power-backend.onrender.com/api/import/exercises \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Option 3: From Local Development

```bash
# Make sure backend is running (npm run dev from backend directory)
cd backend
npx ts-node src/scripts/importExercises.ts
```

---

## What Gets Created

### Body Parts (7 categories)
- **Arms** → Biceps, Triceps, Forearms
- **Chest** → Chest
- **Shoulders** → Shoulders, Traps
- **Back** → Lats, Upper Back, Lower Back, Traps
- **Core** → Abs, Obliques
- **Legs** → Quadriceps, Hamstrings, Glutes, Calves, Abductors, Adductors
- **Other** → Neck, Full Body

### Workout Types
- Strength
- Cardio
- Flexibility
- HIIT

### Exercises (800+)
Each exercise includes:
- Name and description
- Primary muscle group
- Difficulty level (Beginner/Intermediate/Advanced)
- Equipment required
- Step-by-step instructions

---

## Verify Import Success

1. Go to `/exercises` on your site
2. Click on any body part tab (e.g., "Arms")
3. You should see muscle groups with exercise counts
4. Click on a muscle (e.g., "Biceps") to see all exercises
5. Click on an exercise to view details

**Expected Results:**
- ✅ 7 body parts created
- ✅ 15+ muscle groups created
- ✅ 800+ exercises imported
- ✅ All organized by Body Part → Muscle → Exercise

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Token expired - log in again and get a new token |
| **500 Error** | Check Render logs for database connection issues |
| **Timeout** | Import may take 30-60 seconds - be patient! |
| **Duplicate errors** | Safe to ignore - import uses ON CONFLICT to skip duplicates |

---

## Important Notes

- ✅ **Idempotent**: Safe to run multiple times (won't create duplicates)
- ✅ **One-time setup**: Only needs to be run once per database
- ✅ **Open source data**: All exercise data is Public Domain (Unlicense)
- ⏱️ **Duration**: Expect 30-60 seconds for full import
- 🔒 **Admin only**: Must be logged in as admin to run import
