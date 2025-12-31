import { query } from '../config/db';
import logger from '../utils/logger';

export enum NotificationType {
    BOOKING_CONFIRMATION = 'booking_confirmation',
    BOOKING_CANCELLATION = 'booking_cancellation',
    WORKOUT_REMINDER = 'workout_reminder',
    ACHIEVEMENT = 'achievement',
    MEMBERSHIP_UPDATE = 'membership_update'
}

export enum DeliveryMethod {
    EMAIL = 'email',
    IN_APP = 'in_app',
    BOTH = 'both'
}

export interface NotificationInput {
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    delivery_method?: DeliveryMethod;
}

class NotificationService {
    /**
     * Create a notification and optionally send an email
     */
    async notify(input: NotificationInput): Promise<any> {
        try {
            const { user_id, type, title, message, delivery_method = DeliveryMethod.IN_APP } = input;

            // 1. Log to Database
            const result = await query(
                `INSERT INTO notifications (user_id, type, title, message, delivery_method)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [user_id, type, title, message, delivery_method]
            );

            const notification = result.rows[0];

            // 2. Handle Email Delivery (Mocked)
            if (delivery_method === DeliveryMethod.EMAIL || delivery_method === DeliveryMethod.BOTH) {
                await this.sendEmail(user_id, title, message, notification.id);
            }

            return notification;
        } catch (error) {
            logger.error('Error creating notification:', error);
            throw error;
        }
    }

    /**
     * Mock email sending logic
     */
    private async sendEmail(userId: string, subject: string, body: string, notificationId: string): Promise<void> {
        try {
            // Fetch user email
            const userResult = await query('SELECT email, first_name FROM users WHERE id = $1', [userId]);
            if (userResult.rows.length === 0) return;
            
            const user = userResult.rows[0];

            logger.info(`[MOCK EMAIL] To: ${user.email} (${user.first_name}) | Subject: ${subject}`);
            logger.debug(`[MOCK EMAIL BODY]: ${body}`);

            // Update notification with sent timestamp
            await query(
                'UPDATE notifications SET email_sent_at = CURRENT_TIMESTAMP WHERE id = $1',
                [notificationId]
            );
        } catch (error) {
            logger.error('Error in mock email delivery:', error);
        }
    }

    /**
     * Get unread notifications for a user
     */
    async getUnread(userId: string): Promise<any[]> {
        const result = await query(
            'SELECT * FROM notifications WHERE user_id = $1 AND is_read = false ORDER BY created_at DESC',
            [userId]
        );
        return result.rows;
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string): Promise<void> {
        await query('UPDATE notifications SET is_read = true WHERE id = $1', [notificationId]);
    }
}

export default new NotificationService();
