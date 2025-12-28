import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import GlobalSettingModel from '../models/GlobalSetting';
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
