import { Request, Response } from 'express';
import Changelog from '../models/Changelog';
import { AuthenticatedRequest } from '../types/auth'; // Added import

export const getChangelogs = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const isAdmin = req.user?.roles.includes('admin');
        const changelogs = await Changelog.findAll(!isAdmin);
        res.status(200).json({ changelogs });
    } catch (error) {
        console.error('Get changelogs error:', error);
        res.status(500).json({ error: 'Failed to fetch changelogs' });
    }
};

export const createChangelog = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { version, tracking_number, title, content, category, is_published } = req.body;

        if (!version || !title || !content || !category) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const entry = await Changelog.create({
            version,
            tracking_number,
            title,
            content,
            category,
            is_published,
            created_by: req.user!.id
        });

        res.status(201).json({ message: 'Changelog created', entry });
    } catch (error) {
        console.error('Create changelog error:', error);
        res.status(500).json({ error: 'Failed to create changelog' });
    }
};

export const updateChangelog = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const entry = await Changelog.update(id, req.body);
        if (!entry) {
            res.status(404).json({ error: 'Changelog not found' });
            return;
        }
        res.status(200).json({ message: 'Changelog updated', entry });
    } catch (error) {
        console.error('Update changelog error:', error);
        res.status(500).json({ error: 'Failed to update changelog' });
    }
};

export const deleteChangelog = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const success = await Changelog.delete(id);
        if (!success) {
            res.status(404).json({ error: 'Changelog not found' });
            return;
        }
        res.status(200).json({ message: 'Changelog deleted' });
    } catch (error) {
        console.error('Delete changelog error:', error);
        res.status(500).json({ error: 'Failed to delete changelog' });
    }
};
