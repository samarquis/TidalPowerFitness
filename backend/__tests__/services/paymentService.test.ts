import paymentServiceInstance from '../../src/services/paymentService';
import CreditService from '../../src/services/creditService';
import AchievementModel from '../../src/models/Achievement';
import PackageModel from '../../src/models/Package';
import { SquareClient, SquareEnvironment } from 'square';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import encBase64 from 'crypto-js/enc-base64';

// Mock SquareClient and its methods
const mockCreatePaymentLink = jest.fn();
const mockGetOrder = jest.fn();

jest.mock('square', () => {
    return {
        SquareClient: jest.fn(() => ({
            checkout: {
                paymentLinks: {
                    create: mockCreatePaymentLink,
                },
            },
            orders: {
                get: mockGetOrder,
            },
        })),
        SquareEnvironment: {
            Production: 'production',
            Sandbox: 'sandbox',
        },
    };
});

// Mock uuid
jest.mock('uuid', () => ({
    v4: () => 'mock-uuid',
}));

// Mock services and models
jest.mock('../../src/services/creditService');
jest.mock('../../src/models/Achievement');
jest.mock('../../src/models/Package');
jest.mock('../../src/models/Cart');

// Mock database pool
const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
};

jest.mock('../../src/config/db', () => ({
    __esModule: true,
    default: {
        connect: jest.fn(() => Promise.resolve(mockClient)),
        query: jest.fn(),
    },
}));

describe('PaymentService (Square Provider)', () => {
    let paymentService: typeof paymentServiceInstance;
    let mockSquareClient: jest.Mocked<SquareClient>;

    const MOCK_PACKAGE_ID = 'pkg-123';
    const MOCK_USER_ID = 'user-456';
    const MOCK_PACKAGE = {
        id: MOCK_PACKAGE_ID,
        name: 'Test Package',
        price_cents: 10000, // .00
        credits: 10,
        credit_count: 10,
    };
    const MOCK_FRONTEND_URL = 'http://localhost:3000';
    const MOCK_LOCATION_ID = 'mock-location-id';
    const MOCK_SQUARE_ACCESS_TOKEN = 'mock-access-token';
    const MOCK_SQUARE_WEBHOOK_SECRET = 'mock-webhook-secret';


    beforeEach(() => {
        jest.clearAllMocks();

        // Reset process.env for each test
        process.env.PAYMENT_PROVIDER = 'square';
        process.env.FRONTEND_URL = MOCK_FRONTEND_URL;
        process.env.SQUARE_LOCATION_ID = MOCK_LOCATION_ID;
        process.env.SQUARE_ACCESS_TOKEN = MOCK_SQUARE_ACCESS_TOKEN;
        process.env.SQUARE_WEBHOOK_SECRET = MOCK_SQUARE_WEBHOOK_SECRET;
        process.env.SQUARE_ENVIRONMENT = 'sandbox';

        paymentService = paymentServiceInstance;
        paymentService.reinitialize();

        mockSquareClient = paymentService['squareClient'] as jest.Mocked<SquareClient>;
        
        // Default mock for queries
        mockClient.query.mockImplementation((q) => {
            if (q.includes('SELECT 1 FROM processed_webhooks')) {
                return Promise.resolve({ rows: [] });
            }
            return Promise.resolve({ rows: [] });
        });
    });

    describe('createCheckoutSession', () => {
        beforeEach(() => {
            (PackageModel.getById as jest.Mock).mockResolvedValue(MOCK_PACKAGE);
        });

        it('should successfully create a Square payment link', async () => {
            mockCreatePaymentLink.mockResolvedValue({
                result: {
                    paymentLink: {
                        url: 'https://square.link/mock-payment',
                    },
                },
            });

            const session = await paymentService.createCheckoutSession(MOCK_USER_ID, MOCK_PACKAGE_ID);   

            expect(mockCreatePaymentLink).toHaveBeenCalledWith(expect.objectContaining({
                idempotencyKey: 'mock-uuid',
                order: expect.objectContaining({
                    locationId: MOCK_LOCATION_ID,
                    metadata: {
                        userId: MOCK_USER_ID,
                        packageId: MOCK_PACKAGE_ID,
                        type: 'package_purchase',
                    },
                }),
            }));
            expect(session).toEqual({ url: 'https://square.link/mock-payment' });
        });
    });

    describe('handleSquareWebhook', () => {
        const MOCK_WEBHOOK_URL = 'https://example.com/webhook';
        const MOCK_RAW_BODY = {
            event_id: 'event-123',
            id: 'webhook-123',
            type: 'payment.updated',
            data: {
                object: {
                    payment: {
                        id: 'payment-abc',
                        order_id: 'order-xyz',
                        status: 'COMPLETED',
                    },
                },
            },
        };
        const MOCK_BODY_STRING = JSON.stringify(MOCK_RAW_BODY);
        const generateSignature = (body: string, url: string, secret: string) => {
            const hmac = HmacSHA256(url + body, secret);
            return encBase64.stringify(hmac);
        };
        let validSignature: string;


        beforeEach(() => {
            validSignature = generateSignature(MOCK_BODY_STRING, MOCK_WEBHOOK_URL, MOCK_SQUARE_WEBHOOK_SECRET);
            (PackageModel.getById as jest.Mock).mockResolvedValue(MOCK_PACKAGE);
            (CreditService.assignCreditsForPackage as jest.Mock).mockResolvedValue({ credits_added: MOCK_PACKAGE.credit_count });
            (AchievementModel.checkAndAward as jest.Mock).mockResolvedValue(undefined);

            mockGetOrder.mockResolvedValue({
                result: {
                    order: {
                        metadata: {
                            userId: MOCK_USER_ID,
                            packageId: MOCK_PACKAGE_ID,
                            type: 'package_purchase'
                        }
                    }
                }
            });
        });

        it('should successfully process a COMPLETED payment webhook with valid signature', async () => { 
            await paymentService.handleSquareWebhook(MOCK_RAW_BODY, validSignature, MOCK_WEBHOOK_URL);   

            expect(mockGetOrder).toHaveBeenCalledWith({ orderId: 'order-xyz' });
            expect(PackageModel.getById).toHaveBeenCalledWith(MOCK_PACKAGE_ID);
            expect(CreditService.assignCreditsForPackage).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_PACKAGE_ID);
            expect(AchievementModel.checkAndAward).toHaveBeenCalledWith(MOCK_USER_ID, 'purchased_credits', MOCK_PACKAGE.credit_count);
            
            // Verify idempotency insert
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO processed_webhooks'),
                expect.arrayContaining(['event-123', 'square'])
            );
        });

        it('should successfully process a cart_purchase webhook', async () => {
            const MOCK_CART_ORDER = {
                metadata: {
                    userId: MOCK_USER_ID,
                    type: 'cart_purchase'
                },
                lineItems: [
                    {
                        quantity: '2',
                        metadata: {
                            packageId: MOCK_PACKAGE_ID
                        }
                    }
                ]
            };
            mockGetOrder.mockResolvedValue({
                result: {
                    order: MOCK_CART_ORDER
                }
            });

            await paymentService.handleSquareWebhook(MOCK_RAW_BODY, validSignature, MOCK_WEBHOOK_URL);   

            expect(CreditService.assignCreditsForPackage).toHaveBeenCalledTimes(2);
            expect(AchievementModel.checkAndAward).toHaveBeenCalledWith(MOCK_USER_ID, 'purchased_credits', MOCK_PACKAGE.credit_count * 2);

            const CartModel = require('../../src/models/Cart').default;
            expect(CartModel.clearCart).toHaveBeenCalledWith(MOCK_USER_ID);
        });

        it('should not process if event already processed', async () => {
            mockClient.query.mockImplementation((q) => {
                if (q.includes('SELECT 1 FROM processed_webhooks')) {
                    return Promise.resolve({ rows: [{ 1: 1 }] });
                }
                return Promise.resolve({ rows: [] });
            });

            await paymentService.handleSquareWebhook(MOCK_RAW_BODY, validSignature, MOCK_WEBHOOK_URL);

            expect(mockGetOrder).not.toHaveBeenCalled();
            expect(CreditService.assignCreditsForPackage).not.toHaveBeenCalled();
        });

        it('should throw an error for an invalid signature', async () => {
            const invalidSignature = 'invalid-signature';
            await expect(paymentService.handleSquareWebhook(MOCK_RAW_BODY, invalidSignature, MOCK_WEBHOOK_URL)).rejects.toThrow('Invalid Square webhook signature');
            expect(CreditService.assignCreditsForPackage).not.toHaveBeenCalled();
        });
    });
});
