import paymentServiceInstance from '../../src/services/paymentService';
import CreditService from '../../src/services/creditService';
import AchievementModel from '../../src/models/Achievement';
import PackageModel from '../../src/models/Package';
import { SquareClient, SquareEnvironment } from 'square';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import encBase64 from 'crypto-js/enc-base64';

// Mock SquareClient and its methods
const mockCreatePaymentLink = jest.fn();
const mockRetrieveOrder = jest.fn();

jest.mock('square', () => {
    return {
        SquareClient: jest.fn(() => ({
            checkout: {
                paymentLinks: {
                    create: mockCreatePaymentLink,
                },
            },
            orders: {
                retrieveOrder: mockRetrieveOrder,
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

describe('PaymentService (Square Provider)', () => {
    let paymentService: typeof paymentServiceInstance;
    let mockSquareClient: jest.Mocked<SquareClient>;

    const MOCK_PACKAGE_ID = 'pkg-123';
    const MOCK_USER_ID = 'user-456';
    const MOCK_PACKAGE = {
        id: MOCK_PACKAGE_ID,
        name: 'Test Package',
        price_cents: 10000, // $100.00
        credits: 10,
        credit_count: 10, // Added to match model expected prop
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

            expect(mockCreatePaymentLink).toHaveBeenCalledWith({
                idempotencyKey: 'mock-uuid',
                order: {
                    locationId: MOCK_LOCATION_ID,
                    metadata: {
                        userId: MOCK_USER_ID,
                        packageId: MOCK_PACKAGE_ID,
                        type: 'package_purchase',
                    },
                    lineItems: [
                        {
                            name: MOCK_PACKAGE.name,
                            quantity: '1',
                            basePriceMoney: {
                                amount: BigInt(MOCK_PACKAGE.price_cents),
                                currency: 'USD',
                            },
                        },
                    ],
                },
                checkoutOptions: {
                    redirectUrl: `${MOCK_FRONTEND_URL}/dashboard?payment=success`,
                },
            });
            expect(session).toEqual({ url: 'https://square.link/mock-payment' });
        });

        it('should throw an error if package is not found', async () => {
            (PackageModel.getById as jest.Mock).mockResolvedValue(null);
            await expect(paymentService.createCheckoutSession(MOCK_USER_ID, MOCK_PACKAGE_ID)).rejects.toThrow('Package not found');
        });

        it('should throw an error if SQUARE_LOCATION_ID is missing', async () => {
            delete process.env.SQUARE_LOCATION_ID;
            paymentService.reinitialize(); 
            (PackageModel.getById as jest.Mock).mockResolvedValue(MOCK_PACKAGE);

            await expect(paymentService.createCheckoutSession(MOCK_USER_ID, MOCK_PACKAGE_ID)).rejects.toThrow('Failed to initialize Square checkout');
        });

        it('should handle Square API errors gracefully', async () => {
            mockCreatePaymentLink.mockRejectedValue(new Error('Square API Error'));

            await expect(paymentService.createCheckoutSession(MOCK_USER_ID, MOCK_PACKAGE_ID)).rejects.toThrow('Failed to initialize Square checkout');
        });
    });

    describe('createCartCheckoutSession', () => {
        const MOCK_CART = {
            id: 'cart-123',
            user_id: MOCK_USER_ID,
            items: [
                {
                    id: 'item-1',
                    package_id: MOCK_PACKAGE_ID,
                    quantity: 2,
                    package_name: 'Test Package',
                    package_price_cents: 5000,
                }
            ]
        };

        beforeEach(() => {
            const CartModel = require('../../src/models/Cart').default;
            CartModel.getCartWithItems.mockResolvedValue(MOCK_CART);
        });

        it('should successfully create a Square payment link for cart', async () => {
            mockCreatePaymentLink.mockResolvedValue({
                result: {
                    paymentLink: {
                        url: 'https://square.link/mock-cart-payment',
                    },
                },
            });

            const session = await paymentService.createCartCheckoutSession(MOCK_USER_ID);

            expect(mockCreatePaymentLink).toHaveBeenCalledWith({
                idempotencyKey: 'mock-uuid',
                order: {
                    locationId: MOCK_LOCATION_ID,
                    metadata: {
                        userId: MOCK_USER_ID,
                        cartId: MOCK_CART.id,
                        type: 'cart_purchase',
                    },
                    lineItems: [
                        {
                            name: MOCK_CART.items[0].package_name,
                            quantity: '2',
                            basePriceMoney: {
                                amount: BigInt(MOCK_CART.items[0].package_price_cents),
                                currency: 'USD',
                            },
                            metadata: {
                                packageId: MOCK_PACKAGE_ID
                            }
                        },
                    ],
                },
                checkoutOptions: {
                    redirectUrl: `${MOCK_FRONTEND_URL}/dashboard?payment=success`,
                },
            });
            expect(session).toEqual({ url: 'https://square.link/mock-cart-payment' });
        });
    });

    describe('handleSquareWebhook', () => {
        const MOCK_WEBHOOK_URL = 'https://example.com/webhook';
        const MOCK_RAW_BODY = {
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
            
            mockRetrieveOrder.mockResolvedValue({
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

            expect(mockRetrieveOrder).toHaveBeenCalledWith({ orderId: 'order-xyz' });
            expect(PackageModel.getById).toHaveBeenCalledWith(MOCK_PACKAGE_ID);
            expect(CreditService.assignCreditsForPackage).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_PACKAGE_ID);
            expect(AchievementModel.checkAndAward).toHaveBeenCalledWith(MOCK_USER_ID, 'purchased_credits', MOCK_PACKAGE.credit_count);
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
            mockRetrieveOrder.mockResolvedValue({
                result: {
                    order: MOCK_CART_ORDER
                }
            });

            await paymentService.handleSquareWebhook(MOCK_RAW_BODY, validSignature, MOCK_WEBHOOK_URL);

            expect(CreditService.assignCreditsForPackage).toHaveBeenCalledTimes(2);
            expect(CreditService.assignCreditsForPackage).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_PACKAGE_ID);
            expect(AchievementModel.checkAndAward).toHaveBeenCalledWith(MOCK_USER_ID, 'purchased_credits', MOCK_PACKAGE.credit_count * 2);
            
            const CartModel = require('../../src/models/Cart').default;
            expect(CartModel.clearCart).toHaveBeenCalledWith(MOCK_USER_ID);
        });

        it('should throw an error for an invalid signature', async () => {
            const invalidSignature = 'invalid-signature';
            await expect(paymentService.handleSquareWebhook(MOCK_RAW_BODY, invalidSignature, MOCK_WEBHOOK_URL)).rejects.toThrow('Invalid Square webhook signature');
            expect(CreditService.assignCreditsForPackage).not.toHaveBeenCalled();
            expect(AchievementModel.checkAndAward).not.toHaveBeenCalled();
        });

        it('should not process if payment status is not COMPLETED', async () => {
            const pendingPaymentBody = {
                ...MOCK_RAW_BODY,
                data: {
                    object: {
                        payment: {
                            ...MOCK_RAW_BODY.data.object.payment,
                            status: 'PENDING',
                        },
                    },
                },
            };
            const pendingSignature = generateSignature(JSON.stringify(pendingPaymentBody), MOCK_WEBHOOK_URL, MOCK_SQUARE_WEBHOOK_SECRET);

            await paymentService.handleSquareWebhook(pendingPaymentBody, pendingSignature, MOCK_WEBHOOK_URL);

            expect(CreditService.assignCreditsForPackage).not.toHaveBeenCalled();
            expect(AchievementModel.checkAndAward).not.toHaveBeenCalled();
        });

        it('should handle missing order_id gracefully', async () => {
            const missingOrderIdBody = {
                ...MOCK_RAW_BODY,
                data: {
                    object: {
                        payment: {
                            ...MOCK_RAW_BODY.data.object.payment,
                            order_id: undefined, 
                        },
                    },
                },
            };
            const missingOrderIdSignature = generateSignature(JSON.stringify(missingOrderIdBody), MOCK_WEBHOOK_URL, MOCK_SQUARE_WEBHOOK_SECRET);

            await paymentService.handleSquareWebhook(missingOrderIdBody, missingOrderIdSignature, MOCK_WEBHOOK_URL);

            expect(CreditService.assignCreditsForPackage).not.toHaveBeenCalled();
            expect(AchievementModel.checkAndAward).not.toHaveBeenCalled();
        });

        it('should not process if SQUARE_WEBHOOK_SECRET is not configured and return true for signature valid', async () => {
            delete process.env.SQUARE_WEBHOOK_SECRET;
            paymentService.reinitialize();
            await paymentService.handleSquareWebhook(MOCK_RAW_BODY, 'any-signature', MOCK_WEBHOOK_URL);
            expect(CreditService.assignCreditsForPackage).toHaveBeenCalled();
            expect(AchievementModel.checkAndAward).toHaveBeenCalled();
        });
    });
});
