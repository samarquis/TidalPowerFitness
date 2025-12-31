import ProgramModel from '../../src/models/Program';
import { query } from '../../src/config/db';

// Mock the db module
jest.mock('../../src/config/db', () => ({
    query: jest.fn()
}));

describe('ProgramModel', () => {
    const MOCK_TRAINER_ID = 'trainer-123';
    const MOCK_CLIENT_ID = 'client-456';
    const MOCK_PROGRAM_ID = 'program-789';
    const MOCK_ASSIGNMENT_ID = 'assign-000';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should successfully create a program with templates in a transaction', async () => {
            const mockProgram = { id: MOCK_PROGRAM_ID, name: 'Test Program' };
            (query as jest.Mock)
                .mockResolvedValueOnce({ rows: [] }) // BEGIN
                .mockResolvedValueOnce({ rows: [mockProgram] }) // INSERT program
                .mockResolvedValueOnce({ rows: [] }) // INSERT template 1
                .mockResolvedValueOnce({ rows: [] }) // COMMIT
                .mockResolvedValueOnce({ rows: [mockProgram] }); // getById (implied if we called it)

            const input = {
                trainer_id: MOCK_TRAINER_ID,
                name: 'Test Program',
                templates: [
                    { template_id: 'temp-1', week_number: 1, day_number: 1 }
                ]
            };

            const result = await ProgramModel.create(input);

            expect(query).toHaveBeenCalledWith('BEGIN');
            expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO programs'), expect.any(Array));
            expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO program_templates'), expect.any(Array));
            expect(query).toHaveBeenCalledWith('COMMIT');
            expect(result).toEqual(mockProgram);
        });

        it('should rollback if an error occurs during creation', async () => {
            (query as jest.Mock)
                .mockResolvedValueOnce({ rows: [] }) // BEGIN
                .mockRejectedValueOnce(new Error('DB Error')); // INSERT program fails

            const input = { trainer_id: '1', name: 'Error', templates: [] };

            await expect(ProgramModel.create(input)).rejects.toThrow('DB Error');
            expect(query).toHaveBeenCalledWith('ROLLBACK');
        });
    });

    describe('advanceProgress', () => {
        it('should move to the next day in the same week if available', async () => {
            const mockAssignment = { 
                id: MOCK_ASSIGNMENT_ID, 
                program_id: MOCK_PROGRAM_ID, 
                current_week: 1, 
                current_day: 1 
            };
            const mockNextWorkout = { week_number: 1, day_number: 2 };

            (query as jest.Mock)
                .mockResolvedValueOnce({ rows: [mockAssignment] }) // SELECT assignment
                .mockResolvedValueOnce({ rows: [mockNextWorkout] }) // SELECT next workout
                .mockResolvedValueOnce({ rows: [] }); // UPDATE progress

            await ProgramModel.advanceProgress(MOCK_ASSIGNMENT_ID);

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE program_assignments SET current_week = $1, current_day = $2'),
                [1, 2, MOCK_ASSIGNMENT_ID]
            );
        });

        it('should move to the first day of the next week if no more days in current week', async () => {
            const mockAssignment = { 
                id: MOCK_ASSIGNMENT_ID, 
                program_id: MOCK_PROGRAM_ID, 
                current_week: 1, 
                current_day: 5 
            };
            const mockNextWorkout = { week_number: 2, day_number: 1 };

            (query as jest.Mock)
                .mockResolvedValueOnce({ rows: [mockAssignment] }) // SELECT assignment
                .mockResolvedValueOnce({ rows: [mockNextWorkout] }) // SELECT next workout
                .mockResolvedValueOnce({ rows: [] }); // UPDATE progress

            await ProgramModel.advanceProgress(MOCK_ASSIGNMENT_ID);

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE program_assignments SET current_week = $1, current_day = $2'),
                [2, 1, MOCK_ASSIGNMENT_ID]
            );
        });

        it('should mark program as completed if no more workouts are scheduled', async () => {
            const mockAssignment = { 
                id: MOCK_ASSIGNMENT_ID, 
                program_id: MOCK_PROGRAM_ID, 
                current_week: 4, 
                current_day: 5 
            };

            (query as jest.Mock)
                .mockResolvedValueOnce({ rows: [mockAssignment] }) // SELECT assignment
                .mockResolvedValueOnce({ rows: [] }) // SELECT next workout (none found)
                .mockResolvedValueOnce({ rows: [] }); // UPDATE status to completed

            await ProgramModel.advanceProgress(MOCK_ASSIGNMENT_ID);

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining("UPDATE program_assignments SET status = 'completed'"),
                [MOCK_ASSIGNMENT_ID]
            );
        });
    });
});
