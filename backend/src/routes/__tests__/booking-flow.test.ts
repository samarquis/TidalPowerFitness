/**
 * Integration tests for the complete credit purchase and booking flow
 *
 * Tests the following workflow:
 * 1. User browses packages
 * 2. User adds package to cart
 * 3. User purchases package (mock payment)
 * 4. User receives credits
 * 5. User books a class
 * 6. Credits are deducted
 * 7. User cancels booking
 * 8. Credits are refunded
 */

import request from 'supertest';
import app from '../../app';
import { query } from '../../config/db';

describe('Complete Booking Flow Integration Tests', () => {
    let authToken: string;
    let userId: string;
    let packageId: string;
    let classId: string;
    let bookingId: string;

    beforeAll(async () => {
        // Create a test user
        const userResponse = await request(app)
            .post('/api/auth/register')
            .send({
                email: `test-booking-${Date.now()}@example.com`,
                password: 'Test1234!',
                first_name: 'Test',
                last_name: 'User'
            });

        authToken = userResponse.body.token;
        userId = userResponse.body.user.id;

        // Create a test package (admin would normally do this)
        const packageResult = await query(
            `INSERT INTO packages (name, description, credit_count, price, duration_days, is_active)
             VALUES ($1, $2, $3, $4, $5, true)
             RETURNING id`,
            ['Test Package', '10 class credits', 10, 99.99, 30]
        );
        packageId = packageResult.rows[0].id;

        // Create a test class
        // First, ensure we have a trainer
        const trainerResult = await query(
            `INSERT INTO users (email, password_hash, first_name, last_name, roles)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [
                `test-trainer-${Date.now()}@example.com`,
                'hashed_password',
                'Test',
                'Trainer',
                ['trainer']
            ]
        );
        const trainerId = trainerResult.rows[0].id;

        const classResult = await query(
            `INSERT INTO classes (name, description, trainer_id, start_time, end_time, max_participants, days_of_week)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [
                'Test HIIT Class',
                'High intensity workout',
                trainerId,
                '10:00',
                '11:00',
                20,
                ['Monday', 'Wednesday', 'Friday']
            ]
        );
        classId = classResult.rows[0].id;
    });

    afterAll(async () => {
        // Clean up test data
        if (bookingId) {
            await query('DELETE FROM class_participants WHERE id = $1', [bookingId]);
        }
        if (userId) {
            await query('DELETE FROM user_credits WHERE user_id = $1', [userId]);
            await query('DELETE FROM carts WHERE user_id = $1', [userId]);
            await query('DELETE FROM users WHERE id = $1', [userId]);
        }
        if (classId) {
            await query('DELETE FROM classes WHERE id = $1', [classId]);
        }
        if (packageId) {
            await query('DELETE FROM packages WHERE id = $1', [packageId]);
        }
    });

    describe('Step 1: Browse Packages', () => {
        it('should return available packages', async () => {
            const response = await request(app)
                .get('/api/packages')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);

            const testPackage = response.body.find((p: any) => p.id === packageId);
            expect(testPackage).toBeDefined();
            expect(testPackage.name).toBe('Test Package');
            expect(testPackage.credit_count).toBe(10);
            expect(testPackage.price).toBe(99.99);
        });
    });

    describe('Step 2: Add Package to Cart', () => {
        it('should add package to cart successfully', async () => {
            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    package_id: packageId,
                    quantity: 1
                })
                .expect(201);

            expect(response.body.message).toContain('added to cart');
        });

        it('should validate package_id format', async () => {
            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    package_id: 'invalid-uuid',
                    quantity: 1
                })
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });

        it('should validate quantity range', async () => {
            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    package_id: packageId,
                    quantity: 101 // Over maximum
                })
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });

    describe('Step 3: Purchase Package (Mock Payment)', () => {
        it('should process mock payment and assign credits', async () => {
            // In production, this would go through Square payment
            // For testing, we use the mock payment endpoint
            const mockResponse = await request(app)
                .post('/api/payments/confirm-mock')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    packageId: packageId
                })
                .expect(200);

            expect(mockResponse.body.success).toBe(true);
            expect(mockResponse.body.credits).toBeDefined();
            expect(mockResponse.body.credits.total_credits).toBe(10);

            // Clear cart after purchase
            await request(app)
                .delete('/api/cart')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
        });
    });

    describe('Step 4: Verify Credits Received', () => {
        it('should show credits in user profile', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.credits).toBeDefined();
            expect(response.body.credits.total).toBeGreaterThanOrEqual(10);
        });
    });

    describe('Step 5: Book a Class', () => {
        it('should book class successfully with credits', async () => {
            const response = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    class_id: classId
                })
                .expect(201);

            expect(response.body.message).toContain('booked successfully');
            expect(response.body.booking).toBeDefined();
            bookingId = response.body.booking.id;
        });

        it('should validate class_id format', async () => {
            const response = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    class_id: 'not-a-uuid'
                })
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });

        it('should prevent duplicate bookings', async () => {
            const response = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    class_id: classId
                })
                .expect(400);

            expect(response.body.error).toContain('Already booked');
        });
    });

    describe('Step 6: Verify Credits Deducted', () => {
        it('should show reduced credit balance', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            // Should have 9 credits remaining (10 - 1 used for booking)
            expect(response.body.credits.total).toBe(9);
        });
    });

    describe('Step 7: Cancel Booking', () => {
        it('should cancel booking successfully', async () => {
            const response = await request(app)
                .delete(`/api/bookings/${bookingId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.message).toContain('cancelled successfully');
            expect(response.body.credits_refunded).toBe(1);
        });

        it('should validate booking id format', async () => {
            const response = await request(app)
                .delete('/api/bookings/invalid-uuid')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });

    describe('Step 8: Verify Credits Refunded', () => {
        it('should show refunded credits in balance', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            // Should have 10 credits again (9 + 1 refunded)
            expect(response.body.credits.total).toBe(10);
        });
    });

    describe('Edge Cases', () => {
        it('should prevent booking without sufficient credits', async () => {
            // Deduct all credits
            await query('UPDATE user_credits SET remaining_credits = 0 WHERE user_id = $1', [userId]);

            const response = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    class_id: classId
                })
                .expect(400);

            expect(response.body.error).toContain('Insufficient credits');

            // Restore credits for cleanup
            await query('UPDATE user_credits SET remaining_credits = 10 WHERE user_id = $1', [userId]);
        });

        it('should require authentication for all endpoints', async () => {
            await request(app)
                .post('/api/cart/items')
                .send({ package_id: packageId, quantity: 1 })
                .expect(401);

            await request(app)
                .post('/api/bookings')
                .send({ class_id: classId })
                .expect(401);

            await request(app)
                .get('/api/auth/profile')
                .expect(401);
        });
    });
});
