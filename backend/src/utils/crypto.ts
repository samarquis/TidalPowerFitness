import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "temporary-default-key-32-chars-!!"; // Must be 32 chars

export function encrypt(text: string): string {
    if (!text) return text;
    
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const tag = cipher.getAuthTag();
    
    // Format: iv:tag:encrypted
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
    if (!encryptedText || !encryptedText.includes(":")) return encryptedText;
    
    try {
        const [ivHex, tagHex, encrypted] = encryptedText.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const tag = Buffer.from(tagHex, "hex");
        
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
        decipher.setAuthTag(tag);
        
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        return encryptedText; // Fallback to raw if decryption fails (e.g. if it was not encrypted)
    }
}
