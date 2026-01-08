import { UserService } from "../UserService";
import User from "../../models/User";

jest.mock("../../models/User");

describe("UserService Unit Tests", () => {
    const mockUser = {
        id: "user-123",
        email: "test@example.com",
        password_hash: "secret-hash",
        first_name: "Test",
        last_name: "User",
        roles: ["client"]
    };

    it("should sanitize user object by removing password_hash", () => {
        const sanitized = UserService.sanitizeUser(mockUser);
        expect(sanitized).not.toHaveProperty("password_hash");
        expect(sanitized.email).toBe(mockUser.email);
    });

    it("should fetch and sanitize user profile", async () => {
        (User.findById as jest.Mock).mockResolvedValue(mockUser);
        
        const profile = await UserService.getProfile("user-123");
        expect(profile).toBeDefined();
        expect(profile.id).toBe("user-123");
        expect(profile).not.toHaveProperty("password_hash");
    });

    it("should throw error if user not found", async () => {
        (User.findById as jest.Mock).mockResolvedValue(null);
        
        await expect(UserService.getProfile("missing")).rejects.toThrow("User not found");
    });
});
