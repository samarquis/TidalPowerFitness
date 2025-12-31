import ProgramModel from '../models/Program';
import { Program, ProgramAssignment, CreateProgramInput } from '../models/Program';
import logger from '../utils/logger';

class ProgramService {
    /**
     * Creates a new program with templates.
     */
    async createProgram(input: CreateProgramInput): Promise<Program> {
        return await ProgramModel.create(input);
    }

    /**
     * Assigns a program to a client and sends an initial notification.
     */
    async assignProgram(data: {
        client_id: string;
        program_id: string;
        trainer_id: string;
        start_date?: Date;
        notes?: string;
    }): Promise<ProgramAssignment> {
        const assignment = await ProgramModel.assignToClient(data);
        logger.info(`Assigned program ${data.program_id} to client ${data.client_id}`);
        return assignment;
    }

    /**
     * Handles logic for advancing a client through their assigned program.
     */
    async advanceClientProgress(assignmentId: string): Promise<void> {
        try {
            await ProgramModel.advanceProgress(assignmentId);
            logger.info(`Advanced progress for assignment ${assignmentId}`);
        } catch (error) {
            logger.error(`Error advancing program progress for ${assignmentId}:`, error);
            throw error;
        }
    }

    /**
     * Retrieves all available programs for a trainer.
     */
    async getTrainerPrograms(trainerId: string, includePublic: boolean = true): Promise<Program[]> {
        return await ProgramModel.getByTrainer(trainerId, includePublic);
    }
}

export default new ProgramService();
