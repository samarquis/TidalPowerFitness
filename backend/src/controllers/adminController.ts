import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import GlobalSettingModel from '../models/GlobalSetting';
import { query } from '../config/db';
import logger from '../utils/logger';

export const getSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = await GlobalSettingModel.getAll();
    res.json(settings);
  } catch (error) {
    logger.error('Error in getSettings controller:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSetting = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }

    await GlobalSettingModel.set(key, value, req.user?.userId);
    res.json({ message: `Setting ${key} updated successfully` });
  } catch (error) {
    logger.error('Error in updateSetting controller:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

export const getRevenueReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Total Revenue by Period (last 30 days)
    const revenueTrendResult = await query(`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        SUM(amount_cents) as amount_cents
      FROM payments
      WHERE status = 'completed'
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date ASC
    `);

    // 2. Sales by Package Type
    const packageStatsResult = await query(`
      SELECT 
        p.name as package_name,
        p.type as package_type,
        COUNT(pay.id) as sales_count,
        SUM(pay.amount_cents) as total_revenue_cents
      FROM payments pay
      LEFT JOIN packages p ON pay.description ILIKE '%' || p.name || '%'
      WHERE pay.status = 'completed'
      GROUP BY p.name, p.type
      ORDER BY total_revenue_cents DESC
    `);

    // 3. Overall Totals
    const summaryResult = await query(`
      SELECT 
        SUM(amount_cents) as total_revenue_cents,
        COUNT(id) as total_transactions
      FROM payments
      WHERE status = 'completed'
    `);

    res.json({
      summary: summaryResult.rows[0],
      trend: revenueTrendResult.rows,
      package_stats: packageStatsResult.rows
    });
  } catch (error) {
    logger.error('Error in getRevenueReport:', error);
    res.status(500).json({ error: 'Failed to generate revenue report' });
  }
};

export const getTrainerPerformanceReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { start_date, end_date } = req.query;
    
    const startDate = start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = end_date || new Date().toISOString().split('T')[0];

    const result = await query(`
      SELECT 
        u.id as trainer_id,
        u.first_name || ' ' || u.last_name as trainer_name,
        u.email,
        COUNT(DISTINCT ws.id) as class_count,
        COUNT(sp.client_id) as total_attendees,
        COUNT(DISTINCT sp.client_id) as unique_clients
      FROM users u
      JOIN workout_sessions ws ON u.id = ws.trainer_id
      LEFT JOIN session_participants sp ON ws.id = sp.session_id
      WHERE u.roles @> ARRAY['trainer'::text]
        AND ws.session_date >= $1 
        AND ws.session_date <= $2
      GROUP BY u.id, u.first_name, u.last_name, u.email
      ORDER BY class_count DESC
    `, [startDate, endDate]);

    res.json(result.rows);
  } catch (error) {
    logger.error('Error in getTrainerPerformanceReport:', error);
    res.status(500).json({ error: 'Failed to generate trainer performance report' });
  }
};

