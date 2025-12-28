const request = require('supertest');
const app = require('../../app'); // Import the configured app
const { query, closePool } = require('../../config/db');
const { hashPassword } = require('../../utils/password');

// Mock the db module
jest.mock('../../config/db');

const mockedQuery = query as jest.Mock;
const mockedClosePool = closePool as jest.Mock;

describe('Auth Endpoints', () => {
    let testUser: any;
    let hashedPassword: any;

    beforeEach(async () => {
        // Reset mocks before each test
        mockedQuery.mockClear();
        // Mock the closePool function to do nothing and resolve
        mockedClosePool.mockResolvedValue(undefined);

        hashedPassword = await hashPassword('testpassword123');
        testUser = {
            id: 'a-test-uuid',
            email: 'testuser@example.com',
            password_hash: hashedPassword,
            first_name: 'Test',
            last_name: 'User',
            role: 'client',
            is_active: true, // Add this line
        };
    });

    describe('POST /api/auth/login', () => {
        it('should login a user with correct credentials and return a token', async () => {
            // Setup mock to return the user when findByEmail is called
            mockedQuery.mockResolvedValue({ rows: [testUser], rowCount: 1 });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'testpassword123',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toEqual(testUser.email);
            
            // Verify cookie is set
            const setCookie = res.get('Set-Cookie');
            expect(setCookie).toBeDefined();
            expect(setCookie[0]).toContain('token=');
            expect(setCookie[0]).toContain('HttpOnly');

            // Ensure the DB was queried for the user
            expect(mockedQuery).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE email = $1',
                [testUser.email]
            );
        });

        it('should reject login with incorrect password', async () => {
            // Setup mock to return the user
            mockedQuery.mockResolvedValue({ rows: [testUser], rowCount: 1 });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Invalid credentials');
        });

        it('should reject login for a non-existent user', async () => {
            // Setup mock to return no user
            mockedQuery.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'somepassword',
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Invalid credentials');
        });

        it('should reject login with a missing email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    password: 'testpassword123',
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Validation failed');
            expect(res.body).toHaveProperty('details');
        });
    });
});
