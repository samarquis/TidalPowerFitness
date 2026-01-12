import NotificationService, { NotificationType, DeliveryMethod } from '../../src/services/NotificationService';
import { query } from '../../src/config/db';
import logger from '../../src/utils/logger';

// Mock the db module
jest.mock('../../src/config/db', () => ({
    query: jest.fn()
}));

// Mock the logger
jest.mock('../../src/utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
    warn: jest.fn()
}));

describe('NotificationService', () => {
    const MOCK_USER_ID = 'user-123';
    const MOCK_EMAIL = 'test@example.com';
    const MOCK_FIRST_NAME = 'Test';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('notify', () => {
        it('should log a notification to the database', async () => {
            const mockNotification = { id: 'notif-456', user_id: MOCK_USER_ID, title: 'Test Title' };
            (query as jest.Mock).mockResolvedValueOnce({ rows: [mockNotification] });

            await NotificationService.notify({
                user_id: MOCK_USER_ID,
                type: NotificationType.ACHIEVEMENT,
                title: 'Test Title',
                message: 'Test Message',
                delivery_method: DeliveryMethod.IN_APP
            });

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO notifications'),
                [MOCK_USER_ID, NotificationType.ACHIEVEMENT, 'Test Title', 'Test Message', DeliveryMethod.IN_APP]
            );
        });

        it('should trigger an email when delivery_method is EMAIL', async () => {
            const mockNotification = { id: 'notif-456', user_id: MOCK_USER_ID };
            (query as jest.Mock)
                .mockResolvedValueOnce({ rows: [mockNotification] }) // INSERT
                .mockResolvedValueOnce({ rows: [{ email: MOCK_EMAIL, first_name: MOCK_FIRST_NAME }] }) // SELECT user
                .mockResolvedValueOnce({ rows: [] }); // UPDATE

            await NotificationService.notify({
                user_id: MOCK_USER_ID,
                type: NotificationType.BOOKING_CONFIRMATION,
                title: 'Booking Confirmed',
                message: 'Your class is booked',
                delivery_method: DeliveryMethod.EMAIL
            });

            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[MOCK EMAIL] To: ${MOCK_EMAIL}`));
            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE notifications SET email_sent_at'),
                [mockNotification.id]
            );
        });
    });

    describe('getUnread', () => {
        it('should fetch unread notifications from the database', async () => {
            const mockNotifications = [{ id: '1' }, { id: '2' }];
            (query as jest.Mock).mockResolvedValueOnce({ rows: mockNotifications });

            const result = await NotificationService.getUnread(MOCK_USER_ID);

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM notifications WHERE user_id = $1 AND is_read = false'),
                [MOCK_USER_ID]
            );
            expect(result).toEqual(mockNotifications);
        });
    });

    describe('markAsRead', () => {
        it('should update the notification status in the database', async () => {
            (query as jest.Mock).mockResolvedValueOnce({ rows: [] });

            await NotificationService.markAsRead('notif-123');

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE notifications SET is_read = true WHERE id = $1'),
                ['notif-123']
            );
        });
    });
});
