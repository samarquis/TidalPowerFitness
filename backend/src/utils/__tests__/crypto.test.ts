import { encrypt, decrypt } from "../crypto";

describe("PII Encryption Utility", () => {
    const originalText = "555-0199";

    it("should encrypt and decrypt correctly", () => {
        const encrypted = encrypt(originalText);
        expect(encrypted).toBeDefined();
        expect(encrypted).not.toBe(originalText);
        expect(encrypted).toContain(":"); // Format check

        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(originalText);
    });

    it("should return the same text if decryption fails or format is wrong", () => {
        const fakeEncrypted = "some-random-text";
        const decrypted = decrypt(fakeEncrypted);
        expect(decrypted).toBe(fakeEncrypted);
    });

    it("should handle empty values", () => {
        expect(encrypt("")).toBe("");
        expect(decrypt("")).toBe("");
    });
});
