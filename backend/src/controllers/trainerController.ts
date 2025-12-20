import { Request, Response } from 'express';
import UserModel from '../models/User';
import TrainerProfile from '../models/TrainerProfile';
import { hashPassword } from '../utils/password';

// Get all trainers (for admin dropdown)
export const getTrainers = async (req: Request, res: Response) => {
    try {
        const trainers = await UserModel.findByRole('trainer');

        // Return only necessary fields for the dropdown
        const trainerList = trainers.map(trainer => ({
            id: trainer.id,
            first_name: trainer.first_name,
            last_name: trainer.last_name,
            email: trainer.email,
            full_name: `${trainer.first_name} ${trainer.last_name}`
        }));

        res.json(trainerList);
    } catch (error) {
        console.error('Error fetching trainers:', error);
        res.status(500).json({ error: 'Failed to fetch trainers' });
    }
};

// Create a new trainer (and user if needed)
export const createTrainer = async (req: Request, res: Response) => {
    try {
        const {
            // User fields (optional if user_id provided)
            email,
            password,
            first_name,
            last_name,
            phone,

            // Existing user ID (optional if creating new user)
            user_id,

            // Trainer profile fields
            bio,
            specialties,
            certifications,
            years_experience,
            profile_image_url,
            acuity_calendar_id,
            is_accepting_clients
        } = req.body;

        let targetUserId = user_id;

        // Case 1: Create new user
        if (!targetUserId) {
            if (!email || !password || !first_name || !last_name) {
                return res.status(400).json({ error: 'Missing required user fields' });
            }

            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            const password_hash = await hashPassword(password);

            const newUser = await UserModel.create({
                email,
                password_hash,
                first_name,
                last_name,
                phone,
                roles: ['trainer']
            });
            targetUserId = newUser.id;
        } else {
            // Case 2: Promote existing user
            const user = await UserModel.findById(targetUserId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Add trainer role if not already present
            if (!user.roles.includes('trainer')) {
                await UserModel.addRole(targetUserId, 'trainer');
            }
        }

        // Create Trainer Profile
        // First check if profile already exists
        const existingProfile = await TrainerProfile.findByUserId(targetUserId);
        if (existingProfile) {
            return res.status(400).json({ error: 'Trainer profile already exists for this user' });
        }

        const trainerProfile = await TrainerProfile.create({
            user_id: targetUserId,
            bio,
            specialties,
            certifications,
            years_experience,
            profile_image_url,
            acuity_calendar_id,
            is_accepting_clients: is_accepting_clients ?? true
        });

        res.status(201).json({
            message: 'Trainer created successfully',
            trainer: {
                ...trainerProfile,
                first_name: first_name || (await UserModel.findById(targetUserId))?.first_name,
                last_name: last_name || (await UserModel.findById(targetUserId))?.last_name
            }
        });

    } catch (error) {
        console.error('Error creating trainer:', error);
        res.status(500).json({ error: 'Failed to create trainer' });
    }
};

import { getClassesByInstructorId } from '../models/Class';

// Update trainer profile (and user details)
export const updateTrainer = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        console.log('Updating trainer:', { userId, body: req.body });

        const {
            // User fields
            first_name,
            last_name,
            phone,

            // Trainer profile fields
            bio,
            specialties,
            certifications,
            years_experience,
            profile_image_url,
            acuity_calendar_id,
            is_accepting_clients
        } = req.body;


        // Check permissions (Admin or Self)
        if (!req.user?.roles?.includes('admin') && req.user?.id !== userId) {
            return res.status(403).json({ error: 'Unauthorized to update this profile' });
        }

        // 1. Update User details (if provided)
        if (first_name || last_name || phone) {
            await UserModel.update(userId, {
                first_name,
                last_name,
                phone
            });
        }

        // 2. Update Trainer Profile
        const trainer = await TrainerProfile.update(userId, {
            bio,
            specialties,
            certifications,
            years_experience,
            profile_image_url,
            acuity_calendar_id,
            is_accepting_clients
        });

        console.log('TrainerProfile updated:', trainer);

        if (!trainer) {
            console.log('Profile not found, creating new one for user:', userId);

            // Profile doesn't exist yet, create it
            const newTrainer = await TrainerProfile.create({
                user_id: userId,
                bio,
                specialties,
                certifications,
                years_experience,
                profile_image_url,
                acuity_calendar_id,
                is_accepting_clients: is_accepting_clients ?? true
            });

            // Return combined data with the newly created profile
            const updatedUser = await UserModel.findById(userId);

            return res.status(200).json({
                message: 'Trainer profile created successfully',
                trainer: {
                    ...newTrainer,
                    first_name: updatedUser?.first_name,
                    last_name: updatedUser?.last_name,
                    email: updatedUser?.email,
                    phone: updatedUser?.phone
                }
            });
        }

        // Return combined data
        const updatedUser = await UserModel.findById(userId);

        res.status(200).json({
            message: 'Trainer updated successfully',
            trainer: {
                ...trainer,
                first_name: updatedUser?.first_name,
                last_name: updatedUser?.last_name,
                email: updatedUser?.email,
                phone: updatedUser?.phone
            }
        });

    } catch (error) {
        console.error('Error updating trainer:', error);
        res.status(500).json({ error: 'Failed to update trainer' });
    }
};

// Get all classes for the logged-in trainer
export const getMyClasses = async (req: Request, res: Response) => {
    try {
        const trainerId = req.user?.id;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found in token' });
        }

        const classes = await getClassesByInstructorId(trainerId, false); // Get all classes, active or not
        res.json(classes);
    } catch (error) {
        console.error('Error fetching trainer classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};

export default {
    getTrainers,
    createTrainer,
    updateTrainer,
    getMyClasses
};
