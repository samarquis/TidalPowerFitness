import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import Program from '../models/Program';
import ProgramService from '../services/ProgramService';
import TrainerClientService from '../services/TrainerClientService';

class ProgramController {
    // Get all public programs
    async getPublicPrograms(req: any, res: Response): Promise<void> {
        try {
            const programs = await Program.getByTrainer('00000000-0000-0000-0000-000000000000', true);
            res.json(programs.filter(p => p.is_public));
        } catch (error) {
            console.error('Error fetching public programs:', error);
            res.status(500).json({ error: 'Failed to fetch programs' });
        }
    }

    // Get all programs for trainer
    async getPrograms(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const trainerId = req.user?.id;
            if (!trainerId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const includePublic = req.query.include_public !== 'false';
            const programs = await Program.getByTrainer(trainerId, includePublic);
            res.json(programs);
        } catch (error) {
            console.error('Error fetching programs:', error);
            res.status(500).json({ error: 'Failed to fetch programs' });
        }
    }

    // Get program by ID
    async getProgram(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const programId = req.params.id;
            const userId = req.user?.id;
            const isAdmin = req.user?.roles?.includes('admin');

            const program = await Program.getById(programId);

            if (!program) {
                res.status(404).json({ error: 'Program not found' });
                return;
            }

            // Industry Leader Security: Verify Ownership or Public status
            const isOwner = program.trainer_id === userId;
            const isCollaborator = program.collaborators?.some((c: any) => c.trainer_id === userId);
            
            if (!program.is_public && !isOwner && !isCollaborator && !isAdmin) {
                res.status(403).json({ error: 'Forbidden - you do not have permission to view this program' });
                return;
            }

            res.json(program);
        } catch (error) {
            console.error('Error fetching program:', error);
            res.status(500).json({ error: 'Failed to fetch program' });
        }
    }

    // Create new program
    async createProgram(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const programData = {
                ...req.body,
                trainer_id: req.user?.id
            };

            if (!programData.templates || programData.templates.length === 0) {
                res.status(400).json({ error: 'Program must include at least one workout template' });
                return;
            }

            const program = await ProgramService.createProgram(programData);
            res.status(201).json(program);
        } catch (error) {
            console.error('Error creating program:', error);
            res.status(500).json({ error: 'Failed to create program' });
        }
    }

    // Assign program to client
    async assignProgram(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const trainerId = req.user?.id;
            const roles = req.user?.roles || [];
            
            if (!trainerId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { client_id, program_id, start_date, notes } = req.body;

            if (!client_id || !program_id) {
                res.status(400).json({ error: 'Client ID and Program ID are required' });
                return;
            }

            // Industry Leader Security: 
            // 1. Verify Trainer-Client Relationship
            const isAuth = await TrainerClientService.isAuthorized(trainerId, client_id, roles);
            if (!isAuth) {
                res.status(403).json({ error: 'Forbidden - you are not authorized to assign programs to this client' });
                return;
            }

            // 2. Verify Trainer-Program Ownership/Collaboration
            const program = await Program.getById(program_id);
            if (!program) {
                res.status(404).json({ error: 'Program not found' });
                return;
            }

            const isOwner = program.trainer_id === trainerId;
            const isCollaborator = program.collaborators?.some((c: any) => c.trainer_id === trainerId && c.can_edit);
            const isAdmin = roles.includes('admin');

            if (!isOwner && !isCollaborator && !isAdmin && !program.is_public) {
                res.status(403).json({ error: 'Forbidden - you cannot assign a private program you do not own' });
                return;
            }

            const assignment = await ProgramService.assignProgram({
                client_id,
                program_id,
                trainer_id: trainerId,
                start_date: start_date ? new Date(start_date) : undefined,
                notes
            });

            res.status(201).json(assignment);
        } catch (error) {
            console.error('Error assigning program:', error);
            res.status(500).json({ error: 'Failed to assign program' });
        }
    }

    // Get active assignment for current user
    async getMyActiveProgram(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const clientId = req.user?.id;
            if (!clientId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const assignment = await Program.getActiveAssignment(clientId);
            res.json(assignment);
        } catch (error) {
            console.error('Error fetching active program:', error);
            res.status(500).json({ error: 'Failed to fetch active program' });
        }
    }

    // Get active assignment for a specific client (Trainer/Admin)
    async getClientActiveProgram(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { clientId } = req.params;
            const trainerId = req.user?.id;
            const roles = req.user?.roles || [];

            // Industry Leader Security: Verify relationship before viewing progress
            const isAuth = await TrainerClientService.isAuthorized(trainerId!, clientId, roles);
            if (!isAuth) {
                res.status(403).json({ error: 'Forbidden - you do not have access to this user\'s progress' });
                return;
            }

            const assignment = await Program.getActiveAssignment(clientId);
            res.json(assignment);
        } catch (error) {
            console.error('Error fetching client active program:', error);
            res.status(500).json({ error: 'Failed to fetch client active program' });
        }
    }

    // Add collaborator to program
    async addCollaborator(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { trainer_id, can_edit } = req.body;
            
            // Authorization: Only original trainer or admin
            const program = await Program.getById(id);
            if (!program) {
                res.status(404).json({ error: 'Program not found' });
                return;
            }

            if (program.trainer_id !== req.user?.id && !req.user?.roles?.includes('admin')) {
                res.status(403).json({ error: 'Forbidden - only the owner can add collaborators' });
                return;
            }

            await Program.addCollaborator(id, trainer_id, can_edit);
            res.json({ success: true });
        } catch (error) {
            console.error('Error adding collaborator:', error);
            res.status(500).json({ error: 'Failed to add collaborator' });
        }
    }

    // Remove collaborator
    async removeCollaborator(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id, trainerId } = req.params;
            
            // Authorization
            const program = await Program.getById(id);
            if (!program) {
                res.status(404).json({ error: 'Program not found' });
                return;
            }

            if (program.trainer_id !== req.user?.id && !req.user?.roles?.includes('admin')) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }

            await Program.removeCollaborator(id, trainerId);
            res.json({ success: true });
        } catch (error) {
            console.error('Error removing collaborator:', error);
            res.status(500).json({ error: 'Failed to remove collaborator' });
        }
    }
}

export default new ProgramController();
