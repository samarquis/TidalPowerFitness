import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import Challenge from '../models/Challenge';

class ChallengeController {
    // List active challenges
    async getChallenges(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const challenges = await Challenge.getAllActive();
            res.json(challenges);
        } catch (error) {
            console.error('Error fetching challenges:', error);
            res.status(500).json({ error: 'Failed to fetch challenges' });
        }
    }

    // Get challenge details
    async getChallenge(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const challenge = await Challenge.getById(req.params.id);
            if (!challenge) {
                res.status(404).json({ error: 'Challenge not found' });
                return;
            }
            res.json(challenge);
        } catch (error) {
            console.error('Error fetching challenge:', error);
            res.status(500).json({ error: 'Failed to fetch challenge' });
        }
    }

    // Join challenge
    async joinChallenge(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            await Challenge.join(req.params.id, req.user!.id);
            res.json({ success: true });
        } catch (error) {
            console.error('Error joining challenge:', error);
            res.status(500).json({ error: 'Failed to join challenge' });
        }
    }

    // Create challenge (Trainer/Admin)
    async createChallenge(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const data = {
                ...req.body,
                trainer_id: req.user!.id
            };
            const challenge = await Challenge.create(data);
            res.status(201).json(challenge);
        } catch (error) {
            console.error('Error creating challenge:', error);
            res.status(500).json({ error: 'Failed to create challenge' });
        }
    }
}

export default new ChallengeController();
