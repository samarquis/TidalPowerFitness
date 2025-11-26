import { Request, Response } from 'express';
import Package from '../models/Package';

class PackageController {
    // Get all active packages
    async getPackages(req: Request, res: Response): Promise<void> {
        try {
            const packages = await Package.getAllActive();
            res.json(packages);
        } catch (error) {
            console.error('Error fetching packages:', error);
            res.status(500).json({ error: 'Failed to fetch packages' });
        }
    }

    // Get package by ID
    async getPackage(req: Request, res: Response): Promise<void> {
        try {
            const pkg = await Package.getById(req.params.id);
            if (!pkg) {
                res.status(404).json({ error: 'Package not found' });
                return;
            }
            res.json(pkg);
        } catch (error) {
            console.error('Error fetching package:', error);
            res.status(500).json({ error: 'Failed to fetch package' });
        }
    }

    // Create package
    async createPackage(req: Request, res: Response): Promise<void> {
        try {
            const pkg = await Package.create(req.body);
            res.status(201).json(pkg);
        } catch (error) {
            console.error('Error creating package:', error);
            res.status(500).json({ error: 'Failed to create package' });
        }
    }

    // Update package
    async updatePackage(req: Request, res: Response): Promise<void> {
        try {
            const pkg = await Package.update(req.params.id, req.body);
            if (!pkg) {
                res.status(404).json({ error: 'Package not found' });
                return;
            }
            res.json(pkg);
        } catch (error) {
            console.error('Error updating package:', error);
            res.status(500).json({ error: 'Failed to update package' });
        }
    }

    // Delete package (soft delete)
    async deletePackage(req: Request, res: Response): Promise<void> {
        try {
            const success = await Package.deactivate(req.params.id);
            if (!success) {
                res.status(404).json({ error: 'Package not found' });
                return;
            }
            res.json({ message: 'Package deactivated successfully' });
        } catch (error) {
            console.error('Error deleting package:', error);
            res.status(500).json({ error: 'Failed to delete package' });
        }
    }
}

export default new PackageController();
