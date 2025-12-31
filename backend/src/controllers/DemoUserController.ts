import { Request, Response } from 'express';
import { query } from '../config/db';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '../types/auth';
import { DemoDataService } from '../services/demoDataService';
import logger from '../utils/logger';

// Character names to use for demo users
const characterNames = [
  { firstName: 'Rachel', lastName: 'Green', role: 'client' },
  { firstName: 'Monica', lastName: 'Geller', role: 'client' },
  { firstName: 'Phoebe', lastName: 'Buffay', role: 'client' },
  { firstName: 'Joey', lastName: 'Tribbiani', role: 'client' },
  { firstName: 'Chandler', lastName: 'Bing', role: 'client' },
  { firstName: 'Ross', lastName: 'Geller', role: 'client' },

  { firstName: 'Richard', lastName: 'Winters', role: 'trainer' },
  { firstName: 'Lewis', lastName: 'Nixon', role: 'trainer' },
  { firstName: 'Herbert', lastName: 'Sobel', role: 'trainer' },
  { firstName: 'Carwood', lastName: 'Lipton', role: 'trainer' },
  { firstName: 'William', lastName: 'Guarnere', role: 'trainer' },
  { firstName: 'Donald', lastName: 'Malarkey', role: 'trainer' },
  { firstName: 'Lynn', lastName: 'Compton', role: 'trainer' },
  { firstName: 'David', lastName: 'Webster', role: 'trainer' },
  { firstName: 'Joe', lastName: 'Toye', role: 'trainer' },
  { firstName: 'Denver', lastName: 'Randleman', role: 'trainer' },
  { firstName: 'George', lastName: 'Luz', role: 'trainer' },
  { firstName: 'Frank', lastName: 'Perconte', role: 'trainer' },

  { firstName: 'Taylor', lastName: 'Paul', role: 'client' },
  { firstName: 'Jessi', lastName: 'Ngatikaura', role: 'client' },
  { firstName: 'Miranda', lastName: 'McWhorter', role: 'client' },
  { firstName: 'Moana', lastName: 'Waialiki', role: 'client' },
  { firstName: 'Tashi', lastName: 'Duncan', role: 'trainer' },
  { firstName: 'Jennifer', lastName: 'Kale', role: 'trainer' },
  { firstName: 'Adar', lastName: 'Orc', role: 'trainer' },
  { firstName: 'Beetlejuice', lastName: 'Ghost', role: 'client' },
];

const specialties = ['Strength Training', 'Yoga', 'HIIT', 'Cardio', 'Nutrition', 'Rehabilitation'];
const certifications = ['NASM-CPT', 'ACE-CPT', 'ISSA-CPT', 'CrossFit Level 1'];

const randomArrayElements = <T>(arr: T[], min: number, max: number): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const createDemoUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { count = 10 } = req.body;

    // Limit to reasonable number
    const numUsers = Math.min(Math.max(1, count), characterNames.length);

    // Select random unique users
    const selectedUsers = [...characterNames]
      .sort(() => 0.5 - Math.random())
      .slice(0, numUsers);

    const createdUsers = [];
    const createdTrainers = [];

    // Hash password once for all demo users
    const passwordHash = await bcrypt.hash('demo123', 10);

    // Create users
    for (let i = 0; i < selectedUsers.length; i++) {
      const user = selectedUsers[i];
      const email = `${user.firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${user.lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}${Date.now()}_${i}@demo.com`;
      const phone = `555-${Math.floor(1000 + Math.random() * 9000)}`;

      try {
        // Insert user with demo flag enabled
        const result = await query(
          `INSERT INTO users (email, password_hash, first_name, last_name, role, roles, phone, is_demo_mode_enabled)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, email, first_name, last_name, role, roles`,
          [email, passwordHash, user.firstName, user.lastName, user.role, [user.role], phone, true]
        );

        const createdUser = result.rows[0];
        createdUsers.push(createdUser);

        // Generate workout history for all demo users (clients and trainers)
        // This makes the dashboard look populated
        await DemoDataService.generateWorkoutHistory(createdUser.id, 2);

        // If trainer, create trainer profile
        if (user.role === 'trainer') {
          const bio = `${user.firstName} ${user.lastName} is a dedicated fitness professional committed to helping clients achieve their goals.`;
          const trainerSpecialties = randomArrayElements(specialties, 1, 3);
          const trainerCerts = randomArrayElements(certifications, 1, 2);
          const yearsExperience = Math.floor(Math.random() * 13) + 2; // 2-15 years
          const isAcceptingClients = Math.random() > 0.5;

          await query(
            `INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [createdUser.id, bio, JSON.stringify(trainerSpecialties), JSON.stringify(trainerCerts), yearsExperience, isAcceptingClients]
          );

          createdTrainers.push({
            ...createdUser,
            bio,
            specialties: trainerSpecialties,
            certifications: trainerCerts,
            years_experience: yearsExperience,
            is_accepting_clients: isAcceptingClients
          });
        }
      } catch (error: any) {
        console.error(`Error creating user ${email}:`, error);
        // Continue with next user if one fails
      }
    }

    res.status(201).json({
      message: `Successfully created ${createdUsers.length} demo users`,
      users: createdUsers,
      trainers: createdTrainers,
      credentials: {
        password: 'demo123',
        note: 'All demo users use the same password for testing purposes'
      }
    });
  } catch (error: any) {
    console.error('Error creating demo users:', error);
    res.status(500).json({ error: 'Failed to create demo users' });
  }
};

export const deleteDemoUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Find all demo user IDs
    const demoUsers = await query("SELECT id FROM users WHERE is_demo_mode_enabled = true");
    const demoIds = demoUsers.rows.map(u => u.id);

    if (demoIds.length > 0) {
      // 2. Delete workout sessions created by or involving demo users
      // Note: Cascade deletes handle most of this if schema is correct, 
      // but session_participants might need explicit check if we want to delete the whole session
      await query(
        "DELETE FROM workout_sessions WHERE trainer_id = ANY($1)",
        [demoIds]
      );
      
      // 3. Delete the users (cascades to trainer_profiles, user_credits, etc.)
      await query("DELETE FROM users WHERE is_demo_mode_enabled = true");
    }

    res.json({
      message: `Successfully deleted ${demoIds.length} demo users and their associated data`,
    });
  } catch (error: any) {
    console.error('Error deleting demo users:', error);
    res.status(500).json({ error: 'Failed to delete demo users' });
  }
};

export const listDemoUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT id, email, first_name, last_name, role, roles, phone, created_at
       FROM users
       WHERE is_demo_mode_enabled = true
       ORDER BY created_at DESC`
    );

    res.json({
      count: result.rows.length,
      users: result.rows
    });
  } catch (error: any) {
    console.error('Error listing demo users:', error);
    res.status(500).json({ error: 'Failed to list demo users' });
  }
};
