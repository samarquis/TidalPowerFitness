import CreditService from './creditService';
import PackageModel from '../models/Package';

class PaymentService {
    private provider: string;

    constructor() {
        this.provider = process.env.PAYMENT_PROVIDER || 'mock';
    }

    // Create a checkout session (or mock URL)
    async createCheckoutSession(userId: string, packageId: string): Promise<{ url: string }> {
        const pkg = await PackageModel.getById(packageId);
        if (!pkg) {
            throw new Error('Package not found');
        }

        if (this.provider === 'mock') {
            // Return a URL to the frontend mock checkout page
            // We include packageId and userId in the query params for the mock page to use
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return {
                url: `${baseUrl}/checkout/mock?packageId=${packageId}`
            };
        } else {
            // TODO: Implement Square checkout
            throw new Error('Square payment provider not yet implemented');
        }
    }

    // Process a mock payment confirmation
    async processMockPayment(userId: string, packageId: string): Promise<any> {
        if (this.provider !== 'mock') {
            throw new Error('Mock payments are not enabled');
        }

        // Assign credits
        const credits = await CreditService.assignCreditsForPackage(userId, packageId);

        return {
            success: true,
            message: 'Mock payment successful',
            credits
        };
    }
}

export default new PaymentService();
