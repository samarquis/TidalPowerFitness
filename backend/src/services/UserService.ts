import User from "../models/User";
import { ApiError } from "../utils/ApiError";

export class UserService {
    static sanitizeUser(user: any) {
        if (!user) return null;
        const { password_hash, ...sanitized } = user;
        return sanitized;
    }

    static async getProfile(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return this.sanitizeUser(user);
    }

    static async getAllSanitized(role?: string) {
        let users;
        if (role) {
            users = await User.findByRole(role as any);
        } else {
            const [clients, trainers, admins] = await Promise.all([
                User.findByRole("client"),
                User.findByRole("trainer"),
                User.findByRole("admin")
            ]);
            users = [...clients, ...trainers, ...admins];
        }
        return users.map(u => this.sanitizeUser(u));
    }
}
