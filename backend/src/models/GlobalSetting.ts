import { query } from '../config/db';
import logger from '../utils/logger';

export interface GlobalSetting {
  key: string;
  value: any;
  description?: string;
  updated_at?: Date;
  updated_by?: string;
}

class GlobalSettingModel {
  static async get(key: string): Promise<any> {
    try {
      const result = await query('SELECT value FROM global_settings WHERE key = $1', [key]);
      return result.rows[0]?.value;
    } catch (error) {
      logger.error(`Error fetching global setting ${key}:`, error);
      return null;
    }
  }

  static async set(key: string, value: any, updatedBy?: string): Promise<void> {
    try {
      await query(
        `INSERT INTO global_settings (key, value, updated_by, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE 
         SET value = EXCLUDED.value, 
             updated_by = EXCLUDED.updated_by, 
             updated_at = CURRENT_TIMESTAMP`,
        [key, JSON.stringify(value), updatedBy]
      );
      logger.info(`Global setting ${key} updated`);
    } catch (error) {
      logger.error(`Error setting global setting ${key}:`, error);
      throw error;
    }
  }

  static async getAll(): Promise<GlobalSetting[]> {
    try {
      const result = await query('SELECT * FROM global_settings ORDER BY key ASC');
      return result.rows;
    } catch (error) {
      logger.error('Error fetching all global settings:', error);
      return [];
    }
  }
}

export default GlobalSettingModel;
