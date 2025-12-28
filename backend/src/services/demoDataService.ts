import { query } from '../config/db';
import logger from '../utils/logger';

export class DemoDataService {
  /**
   * Generates a realistic workout history for a user over the past X months.
   */
  static async generateWorkoutHistory(userId: string, months: number = 3) {
    try {
      logger.info(`Generating workout history for user ${userId} over ${months} months`);

      // 1. Get available trainers to assign as "logged by"
      const trainersResult = await query("SELECT id FROM users WHERE role = 'trainer' LIMIT 3");
      const trainerIds = trainersResult.rows.map(r => r.id);
      const primaryTrainerId = trainerIds[0] || userId; // fallback to user themselves

      // 2. Get available exercises
      const exercisesResult = await query(`
        SELECT e.id, e.name, wt.name as workout_type, bfa.name as focus_area
        FROM exercises e
        JOIN workout_types wt ON e.workout_type_id = wt.id
        JOIN body_focus_areas bfa ON e.primary_muscle_group = bfa.id
      `);
      const exercises = exercisesResult.rows;

      if (exercises.length === 0) {
        logger.warn('No exercises found in database. Skipping history generation.');
        return;
      }

      // 3. Generate 2-4 workouts per week
      const totalDays = months * 30;
      const workoutFrequency = 0.4; // 40% chance of workout on any given day
      
      for (let i = totalDays; i >= 0; i--) {
        if (Math.random() > workoutFrequency) continue;

        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() - i);

        // Randomize session data
        const duration = Math.floor(Math.random() * 45) + 30; // 30-75 mins
        const workoutType = exercises[Math.floor(Math.random() * exercises.length)].workout_type;
        const workoutTypeIdResult = await query("SELECT id FROM workout_types WHERE name = $1", [workoutType]);
        const workoutTypeId = workoutTypeIdResult.rows[0]?.id;

        // Create workout session
        const sessionResult = await query(
          `INSERT INTO workout_sessions (trainer_id, workout_type_id, session_date, duration_minutes, is_published, notes)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [primaryTrainerId, workoutTypeId, sessionDate, duration, true, `Generated demo session for ${workoutType}`]
        );
        const sessionId = sessionResult.rows[0].id;

        // Add participant
        await query(
          "INSERT INTO session_participants (session_id, client_id, attended) VALUES ($1, $2, $3)",
          [sessionId, userId, true]
        );

        // Select 4-7 random exercises for this session
        const numExercises = Math.floor(Math.random() * 4) + 4;
        const sessionExercises = [...exercises].sort(() => 0.5 - Math.random()).slice(0, numExercises);

        for (let j = 0; j < sessionExercises.length; j++) {
          const exercise = sessionExercises[j];
          
          // Create session exercise
          const plannedSets = Math.floor(Math.random() * 2) + 3; // 3-4 sets
          const plannedReps = Math.floor(Math.random() * 5) + 8; // 8-12 reps
          
          const sessionExResult = await query(
            `INSERT INTO session_exercises (session_id, exercise_id, order_in_session, planned_sets, planned_reps)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [sessionId, exercise.id, j + 1, plannedSets, plannedReps]
          );
          const sessionExerciseId = sessionExResult.rows[0].id;

          // Create logs for each set
          for (let setNum = 1; setNum <= plannedSets; setNum++) {
            const repsCompleted = plannedReps + (Math.random() > 0.8 ? 1 : Math.random() > 0.8 ? -1 : 0);
            
            // Random weight based on exercise name (heuristics)
            let weight = 0;
            if (exercise.name.includes('Squat') || exercise.name.includes('Deadlift')) {
              weight = Math.floor(Math.random() * 100) + 95; // 95-195 lbs
            } else if (exercise.name.includes('Bench') || exercise.name.includes('Press') || exercise.name.includes('Row')) {
              weight = Math.floor(Math.random() * 60) + 45; // 45-105 lbs
            } else if (exercise.name.includes('Curl') || exercise.name.includes('Lunge')) {
              weight = Math.floor(Math.random() * 20) + 15; // 15-35 lbs
            }

            await query(
              `INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, rpe, logged_by)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [sessionExerciseId, userId, setNum, repsCompleted, weight, Math.floor(Math.random() * 3) + 7, primaryTrainerId]
            );
          }
        }
      }

      // 4. Generate progress metrics (weight, etc.)
      for (let m = 0; m <= months; m++) {
        const metricDate = new Date();
        metricDate.setMonth(metricDate.getMonth() - (months - m));
        
        const baseWeight = 180 - (m * 2); // Slow weight loss trend
        const weight = baseWeight + (Math.random() * 2 - 1);
        const bodyFat = 22 - (m * 0.5);

        await query(
          `INSERT INTO client_progress_metrics (client_id, log_date, weight_lbs, body_fat_percentage, recorded_by)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, metricDate, weight, bodyFat, primaryTrainerId]
        );
      }

      logger.info(`Successfully generated workout history for user ${userId}`);
    } catch (error) {
      logger.error(`Error generating workout history for ${userId}:`, error);
    }
  }
}
