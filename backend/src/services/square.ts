// Square Payments API Client
// Documentation: https://developer.squareup.com/

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || '';
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || '';
const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'sandbox';
const SQUARE_BASE_URL = SQUARE_ENVIRONMENT === 'production'
    ? 'https://connect.squareup.com/v2'
    : 'https://connect.squareupsandbox.com/v2';

class SquareClient {
    private headers: HeadersInit;

    constructor() {
        this.headers = {
            'Square-Version': '2024-01-18',
            'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        };
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        if (!SQUARE_ACCESS_TOKEN) {
            console.warn('Square credentials not configured - using mock data');
            return this.getMockData(endpoint, options);
        }

        try {
            const response = await fetch(`${SQUARE_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...this.headers,
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors?.[0]?.detail || 'Square API error');
            }

            return data;
        } catch (error) {
            console.error('Square API request failed:', error);
            throw error;
        }
    }

    // Mock data for development/testing
    private getMockData(endpoint: string, options: RequestInit) {
        if (endpoint.includes('/payments') && options.method === 'POST') {
            return {
                payment: {
                    id: `mock-payment-${Date.now()}`,
                    status: 'COMPLETED',
                    amount_money: { amount: 10000, currency: 'USD' },
                    created_at: new Date().toISOString(),
                    receipt_url: 'https://example.com/receipt',
                },
            };
        }
        if (endpoint.includes('/refunds')) {
            return {
                refund: {
                    id: `mock-refund-${Date.now()}`,
                    status: 'COMPLETED',
                    amount_money: { amount: 10000, currency: 'USD' },
                },
            };
        }
        return null;
    }

    // Create payment
    async createPayment(data: {
        sourceId: string; // nonce from Square Web Payments SDK
        amountMoney: {
            amount: number; // in cents
            currency: string;
        };
        idempotencyKey: string;
        customerId?: string;
        note?: string;
        referenceId?: string;
    }) {
        return this.request('/payments', {
            method: 'POST',
            body: JSON.stringify({
                source_id: data.sourceId,
                amount_money: data.amountMoney,
                idempotency_key: data.idempotencyKey,
                location_id: SQUARE_LOCATION_ID,
                customer_id: data.customerId,
                note: data.note,
                reference_id: data.referenceId,
            }),
        });
    }

    // Get payment by ID
    async getPayment(paymentId: string) {
        return this.request(`/payments/${paymentId}`);
    }

    // Refund payment
    async refundPayment(data: {
        paymentId: string;
        amountMoney: {
            amount: number;
            currency: string;
        };
        idempotencyKey: string;
        reason?: string;
    }) {
        return this.request('/refunds', {
            method: 'POST',
            body: JSON.stringify({
                payment_id: data.paymentId,
                amount_money: data.amountMoney,
                idempotency_key: data.idempotencyKey,
                reason: data.reason,
            }),
        });
    }

    // Create customer
    async createCustomer(data: {
        givenName: string;
        familyName: string;
        emailAddress?: string;
        phoneNumber?: string;
    }) {
        return this.request('/customers', {
            method: 'POST',
            body: JSON.stringify({
                given_name: data.givenName,
                family_name: data.familyName,
                email_address: data.emailAddress,
                phone_number: data.phoneNumber,
            }),
        });
    }

    // Get customer by ID
    async getCustomer(customerId: string) {
        return this.request(`/customers/${customerId}`);
    }

    // List payments
    async listPayments(params?: {
        beginTime?: string;
        endTime?: string;
        sortOrder?: 'ASC' | 'DESC';
        cursor?: string;
        limit?: number;
    }) {
        const queryParams = new URLSearchParams(params as any).toString();
        return this.request(`/payments?location_id=${SQUARE_LOCATION_ID}&${queryParams}`);
    }
}

export const squareClient = new SquareClient();
export default squareClient;
