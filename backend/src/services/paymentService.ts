import CreditService from './creditService';
import PackageModel from '../models/Package';
import AchievementModel from '../models/Achievement';
import pool from '../config/db';

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

        // Get package details to know credit amount for achievement
        const pkgResult = await pool.query('SELECT * FROM packages WHERE id = $1', [packageId]);
        const pkg = pkgResult.rows[0];

        // Assign credits
        const credits = await CreditService.assignCreditsForPackage(userId, packageId);

        // Check for achievement
        if (pkg) {
            try {
                await AchievementModel.checkAndAward(userId, 'purchased_credits', pkg.credits);
            } catch (e) {
                console.error('Failed to check achievements', e);
            }
        }

        return {
            success: true,
            message: 'Mock payment successful',
            credits
        };
    }

    // Process a mock cart payment confirmation
    async processMockCartPayment(userId: string, items: { packageId: string, quantity: number }[]): Promise<any> {
        if (this.provider !== 'mock') {
            throw new Error('Mock payments are not enabled');
        }

        let totalCredits = 0;
        const results = [];
        let totalCreditsPurchased = 0;

        for (const item of items) {
            // Get package details for achievement calculation
            const pkgResult = await pool.query('SELECT * FROM packages WHERE id = $1', [item.packageId]);
            if (pkgResult.rows.length > 0) {
                const pkg = pkgResult.rows[0];
                totalCreditsPurchased += pkg.credits * item.quantity;
            }

            for (let i = 0; i < item.quantity; i++) {
                const credits = await CreditService.assignCreditsForPackage(userId, item.packageId);
                totalCredits += credits.credits_added || 0;
                results.push({ packageId: item.packageId, credits });
            }
        }

        // Check for achievement
        try {
            if (totalCreditsPurchased > 0) {
                await AchievementModel.checkAndAward(userId, 'purchased_credits', totalCreditsPurchased);
            }
        } catch (e) {
            console.error('Failed to check achievements', e);
        }

        return {
            success: true,
            message: 'Mock cart payment successful',
            total_credits_added: totalCredits,
            items: results
        };
    }
}

export default new PaymentService();
