import { hashPassword, comparePassword } from '../password';

describe('Password Utilities', () => {
    let hashedPassword = '';
    const plainPassword = 'mySecurePassword123';

    it('should hash a password', async () => {
        hashedPassword = await hashPassword(plainPassword);
        expect(hashedPassword).toBeDefined();
        expect(hashedPassword).not.toEqual(plainPassword);
    });

    it('should correctly compare a valid password', async () => {
        const isValid = await comparePassword(plainPassword, hashedPassword);
        expect(isValid).toBe(true);
    });

    it('should correctly reject an invalid password', async () => {
        const isInvalid = await comparePassword('wrongPassword', hashedPassword);
        expect(isInvalid).toBe(false);
    });

    it('should throw an error for an empty password during hashing', async () => {
        await expect(hashPassword('')).rejects.toThrow();
    });
});
