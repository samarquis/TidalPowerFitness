import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import WorkoutTemplate from '../models/WorkoutTemplate';

class WorkoutTemplateController {
    // Get all templates for trainer
    async getTemplates(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const trainerId = req.user?.id;
            const isAdmin = req.user?.roles?.includes('admin');
            
            if (!trainerId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            let templates;
            if (isAdmin) {
                templates = await WorkoutTemplate.getAll();
            } else {
                const includePublic = req.query.include_public !== 'false';
                templates = await WorkoutTemplate.getByTrainer(trainerId, includePublic);
            }
            
            res.json(templates);
        } catch (error) {
            console.error('Error fetching templates:', error);
            res.status(500).json({ error: 'Failed to fetch templates' });
        }
    }

    // Get template by ID
    async getTemplate(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const template = await WorkoutTemplate.getById(req.params.id);

            if (!template) {
                res.status(404).json({ error: 'Template not found' });
                return;
            }

            res.json(template);
        } catch (error) {
            console.error('Error fetching template:', error);
            res.status(500).json({ error: 'Failed to fetch template' });
        }
    }

    // Create new template
    async createTemplate(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const templateData = {
                ...req.body,
                trainer_id: req.user?.id
            };

            const template = await WorkoutTemplate.create(templateData);
            res.status(201).json(template);
        } catch (error) {
            console.error('Error creating template:', error);
            res.status(500).json({ error: 'Failed to create template' });
        }
    }

    // Copy template
    async copyTemplate(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const trainerId = req.user?.id;
            if (!trainerId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { new_name } = req.body;
            const template = await WorkoutTemplate.copy(req.params.id, trainerId, new_name);
            res.status(201).json(template);
        } catch (error) {
            console.error('Error copying template:', error);
            res.status(500).json({ error: 'Failed to copy template' });
        }
    }

    // Delete template
    async deleteTemplate(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const templateId = req.params.id;
            const userId = req.user?.id;
            const isAdmin = req.user?.roles?.includes('admin');

            // Fetch template to verify ownership
            const template = await WorkoutTemplate.getById(templateId);

            if (!template) {
                res.status(404).json({ error: 'Template not found' });
                return;
            }

            // Verify ownership (only owner or admin can delete)
            if (template.trainer_id !== userId && !isAdmin) {
                res.status(403).json({
                    error: 'Forbidden - you can only delete your own templates'
                });
                return;
            }

            const success = await WorkoutTemplate.delete(templateId);

            if (!success) {
                res.status(404).json({ error: 'Template not found' });
                return;
            }

            res.json({ message: 'Template deleted successfully' });
        } catch (error) {
            console.error('Error deleting template:', error);
            res.status(500).json({ error: 'Failed to delete template' });
        }
    }
}

export default new WorkoutTemplateController();
