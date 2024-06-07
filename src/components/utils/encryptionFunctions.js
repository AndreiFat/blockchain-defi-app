import crypto from 'crypto';
import logger from "@/debbuging/logger";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_SECRET_ENCRYPTION || 'my_very_secret_key'; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

export const encrypt = (text) => {
    try {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        logger.error('Encryption error:', error);
        throw error;
    }
};

export const decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
};

