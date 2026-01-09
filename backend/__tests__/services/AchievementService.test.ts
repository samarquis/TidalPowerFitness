import { AchievementService } from '../../src/services/AchievementService';
import pool from '../../src/config/db';
import AchievementModel from '../../src/models/Achievement';
import ChallengeService from '../../src/services/ChallengeService';

// Mock dependencies
jest.mock('../../src/config/db', () => ({
    query: jest.fn()
}));
jest.mock('../../src/models/Achievement', () => ({
    checkAndAward: jest.fn()
}));
jest.mock('../../src/services/ChallengeService', () => ({
    updateUserProgress: jest.fn()
}));
jest.mock('../../src/utils/logger');

describe('AchievementService', () => {
    const MOCK_USER_ID = 'user-123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkAndAwardAchievements', () => {
        it('should fetch stats and call AchievementModel.checkAndAward for each type', async () => {
            // Mock pool responses
            (pool.query as jest.Mock)
                .mockResolvedValueOnce({ rows: [{ count: '5' }] }) // workoutStats
                .mockResolvedValueOnce({ rows: [{ count: '3' }] }) // attendanceStats
                .mockResolvedValueOnce({ rows: [{ max_weight: '150', max_volume: '1500' }] }) // maxStats
                .mockResolvedValueOnce({ rows: [{ current_streak: 2, longest_streak: 5, last_workout_date: new Date() }] }); // updateUserStreaks (internal query)

            await AchievementService.checkAndAwardAchievements(MOCK_USER_ID);

            expect(ChallengeService.updateUserProgress).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(AchievementModel.checkAndAward).toHaveBeenCalledWith(MOCK_USER_ID, 'total_workouts', 5);
            expect(AchievementModel.checkAndAward).toHaveBeenCalledWith(MOCK_USER_ID, 'total_attendance', 3);
            expect(AchievementModel.checkAndAward).toHaveBeenCalledWith(MOCK_USER_ID, 'max_weight', 150);
            expect(AchievementModel.checkAndAward).toHaveBeenCalledWith(MOCK_USER_ID, 'max_volume', 1500);
        });
    });

    describe('updateUserStreaks', () => {
        it('should correctly increment streak if last workout was yesterday', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            (pool.query as jest.Mock).mockResolvedValueOnce({
                rows: [{ current_streak: 5, longest_streak: 5, last_workout_date: yesterday }]
            });

            const result = await AchievementService.updateUserStreaks(MOCK_USER_ID);

            expect(result).toEqual({ current_streak: 6, longest_streak: 6 });
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE users SET current_streak = $1, longest_streak = $2'),
                [6, 6, expect.any(Date), MOCK_USER_ID]
            );
        });

        it('should reset streak to 1 if last workout was more than a day ago', async () => {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            threeDaysAgo.setHours(0, 0, 0, 0);

            (pool.query as jest.Mock).mockResolvedValueOnce({
                rows: [{ current_streak: 5, longest_streak: 10, last_workout_date: threeDaysAgo }]
            });

            const result = await AchievementService.updateUserStreaks(MOCK_USER_ID);

            expect(result).toEqual({ current_streak: 1, longest_streak: 10 });
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE users SET current_streak = $1'),
                [1, 10, expect.any(Date), MOCK_USER_ID]
            );
        });
    });
});
