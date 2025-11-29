import UserCreditModel from '../models/UserCredit';
import PackageModel from '../models/Package';

class CreditService {
    // Assign credits to a user after a package purchase
    async assignCreditsForPackage(userId: string, packageId: string): Promise<any> {
        const pkg = await PackageModel.getById(packageId);
        if (!pkg) {
            throw new Error('Package not found');
        }

        const credits = await UserCreditModel.addCredits(
            userId,
            pkg.id,
            pkg.credit_count,
            pkg.duration_days
        );

        return credits;
    }

    // Get user's current credit balance
    async getUserBalance(userId: string): Promise<number> {
        const credits = await UserCreditModel.getUserCredits(userId);
        return credits.reduce((sum, c) => sum + c.remaining_credits, 0);
    }
}

export default new CreditService();
