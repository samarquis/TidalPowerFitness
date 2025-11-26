import { Request, Response } from 'express';
import importExercises from '../scripts/importExercises';

class ImportController {
    // Import exercises from free-exercise-db
    async importExercises(req: Request, res: Response): Promise<void> {
        try {
            console.log('Starting exercise import...');

            // Run the import
            await importExercises();

            res.json({
                success: true,
                message: 'Exercise import completed successfully'
            });
        } catch (error) {
            console.error('Error importing exercises:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to import exercises'
            });
        }
    }
}

export default new ImportController();
