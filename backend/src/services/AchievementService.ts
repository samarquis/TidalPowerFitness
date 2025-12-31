import pool from '../config/db';
import AchievementModel from '../models/Achievement';
import ChallengeService from './ChallengeService';

export class AchievementService {
  /**
   * Checks all achievement conditions for a user and awards them if criteria are met.
   * This service acts as a wrapper around the AchievementModel to provide a clean
   * architectural separation between controllers and data models.
   *
   * @param userId - The ID of the user to check achievements for.
   * @returns A promise that resolves when the check is complete.
   */
  static async checkAndAwardAchievements(userId: string): Promise<void> {
    try {
      console.log(`Checking achievements for user ${userId}`);
      
      // Update Challenge Progress
      await ChallengeService.updateUserProgress(userId);

      // 1. Get user stats (total workouts, total classes attended)
      const workoutStats = await pool.query(
        `SELECT COUNT(*) as count FROM workout_sessions ws JOIN session_participants sp ON ws.id = sp.session_id WHERE sp.client_id = $1`,
        [userId]
      );
      const attendanceStats = await pool.query(
        `SELECT COUNT(*) as count FROM session_participants WHERE client_id = $1 AND attended = true`,
        [userId]
      );
      
      const totalWorkouts = parseInt(workoutStats.rows[0].count);
      const totalAttendance = parseInt(attendanceStats.rows[0].count);

      // 2. Get Max Stats (Weight, Volume)
      const maxStats = await pool.query(
        `SELECT MAX(weight_used_lbs) as max_weight, MAX(weight_used_lbs * reps_completed) as max_volume
         FROM exercise_logs WHERE client_id = $1`,
        [userId]
      );
      const maxWeight = parseFloat(maxStats.rows[0].max_weight || 0);
      const maxVolume = parseFloat(maxStats.rows[0].max_volume || 0);

      // 3. Update and Get Streak Stats
      const streakInfo = await this.updateUserStreaks(userId);

      // 4. Check achievements for each stat type
      await AchievementModel.checkAndAward(userId, 'total_workouts', totalWorkouts);
      await AchievementModel.checkAndAward(userId, 'total_attendance', totalAttendance);
      await AchievementModel.checkAndAward(userId, 'max_weight', maxWeight);
      await AchievementModel.checkAndAward(userId, 'max_volume', maxVolume);
      
      if (streakInfo) {
        await AchievementModel.checkAndAward(userId, 'daily_streak', streakInfo.current_streak);
        await AchievementModel.checkAndAward(userId, 'longest_streak', streakInfo.longest_streak);
      }

    } catch (error) {
      console.error(`Error in AchievementService for user ${userId}:`, error);
    }
  }

  /**
   * Updates user workout streaks based on the most recent activity.
   */
  static async updateUserStreaks(userId: string): Promise<{ current_streak: number, longest_streak: number } | null> {
    try {
      // 1. Get user's current streak info
      const userRes = await pool.query(
        'SELECT current_streak, longest_streak, last_workout_date FROM users WHERE id = $1',
        [userId]
      );

      if (userRes.rows.length === 0) return null;
      const user = userRes.rows[0];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = user.last_workout_date ? new Date(user.last_workout_date) : null;
      if (lastDate) lastDate.setHours(0, 0, 0, 0);

      let newStreak = user.current_streak || 0;
      let newLongest = user.longest_streak || 0;

      // 2. Logic:
      // If last_workout_date is today, do nothing (already logged today)
      if (lastDate && lastDate.getTime() === today.getTime()) {
        return { current_streak: newStreak, longest_streak: newLongest };
      }

      // If last_workout_date was yesterday, increment streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate && lastDate.getTime() === yesterday.getTime()) {
        newStreak += 1;
      } else {
        // If last_workout_date was before yesterday, reset to 1
        newStreak = 1;
      }

      // 3. Update longest streak if necessary
      if (newStreak > newLongest) {
        newLongest = newStreak;
      }

      // 4. Update DB
      await pool.query(
        'UPDATE users SET current_streak = $1, longest_streak = $2, last_workout_date = $3 WHERE id = $4',
        [newStreak, newLongest, today, userId]
      );

      return { current_streak: newStreak, longest_streak: newLongest };
    } catch (error) {
      console.error(`Error updating streaks for user ${userId}:`, error);
      return null;
    }
  }
}

