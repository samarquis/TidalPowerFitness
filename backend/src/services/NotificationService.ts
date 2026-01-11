import { query } from '../config/db';
import logger from '../utils/logger';
import nodemailer from 'nodemailer';

export enum NotificationType {
    BOOKING_CONFIRMATION = 'booking_confirmation',
    BOOKING_CANCELLATION = 'booking_cancellation',
    WORKOUT_REMINDER = 'workout_reminder',
    ACHIEVEMENT = 'achievement',
    MEMBERSHIP_UPDATE = 'membership_update',
    SUPPORT_REQUEST = 'support_request'
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
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initTransporter();
    }

    private initTransporter() {
        const host = process.env.SMTP_HOST;
        const port = parseInt(process.env.SMTP_PORT || '587');
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465, // true for 465, false for other ports
                auth: {
                    user,
                    pass,
                },
            });
            logger.info('Email transporter initialized successfully');
        } else {
            logger.warn('SMTP settings missing. Email delivery will be mocked.');
        }
    }

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

            // 2. Handle Email Delivery
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
     * Real email sending logic with fallback to mock
     */
    private async sendEmail(userId: string, subject: string, body: string, notificationId: string): Promise<void> {
        try {
            // Fetch user email
            const userResult = await query('SELECT email, first_name FROM users WHERE id = $1', [userId]);
            if (userResult.rows.length === 0) {
                // If ID is dummy/system, check for admin email override
                if (userId === '00000000-0000-0000-0000-000000000000') {
                    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
                    if (!adminEmail) return;
                    await this.executeSend(adminEmail, subject, body, notificationId);
                }
                return;
            }
            
            const user = userResult.rows[0];
            await this.executeSend(user.email, subject, body, notificationId);

        } catch (error) {
            logger.error('Error in email delivery process:', error);
        }
    }

    private async executeSend(to: string, subject: string, body: string, notificationId: string): Promise<void> {
        if (this.transporter) {
            try {
                await this.transporter.sendMail({
                    from: `"Tidal Power Fitness" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
                    to,
                    subject,
                    text: body,
                    html: `<div style="font-family: sans-serif; padding: 20px; background: #f9f9f9;">
                            <h2 style="color: #114b61;">Tidal Power Fitness</h2>
                            <p>${body.replace(/\n/g, '<br>')}</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <small style="color: #888;">Automated notification from your training vault.</small>
                           </div>`
                });
                logger.info(`Email sent successfully to ${to}`);
            } catch (err) {
                logger.error(`Failed to send real email to ${to}:`, err);
            }
        } else {
            logger.info(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
            logger.debug(`[MOCK EMAIL BODY]: ${body}`);
        }

        // Update notification with sent timestamp
        await query(
            'UPDATE notifications SET email_sent_at = CURRENT_TIMESTAMP WHERE id = $1',
            [notificationId]
        );
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
