import { readFileSync } from "fs";
import { join } from "path";
import prisma from "../db";

// Load campus emails from student.txt
let campusEmails: Set<string> | null = null;

function loadCampusEmails(): Set<string> {
    if (campusEmails) return campusEmails;

    try {
        const filePath = join(__dirname, "..", "student.txt");
        const content = readFileSync(filePath, "utf-8");
        // Parse comma-separated emails, trim whitespace, convert to lowercase
        campusEmails = new Set(
            content
                .split(",")
                .map((email) => email.trim().toLowerCase())
                .filter((email) => email.length > 0)
        );
        return campusEmails;
    } catch (error) {
        console.error("Error loading student.txt:", error);
        return new Set();
    }
}

/**
 * Check if an email belongs to a campus student
 */
export function isCampusEmail(email: string): boolean {
    const emails = loadCampusEmails();
    return emails.has(email.toLowerCase());
}

/**
 * Generate a unique 8-character alphanumeric referral code
 * Checks database to ensure uniqueness
 */
export async function generateReferralCode(): Promise<string> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        let code = "";
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Check if code already exists in database
        const existing = await prisma.refral.findUnique({
            where: { code },
        });

        if (!existing) {
            return code;
        }

        attempts++;
    }

    throw new Error("Failed to generate unique referral code after multiple attempts");
}

/**
 * Create a unique referral code for a user
 */
export async function createUniqueReferralCode(userId: string): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        const code = await generateReferralCode();

        // Check if code already exists
        const existing = await prisma.refral.findUnique({
            where: { code },
        });

        if (!existing) {
            // Create the referral code
            // Note: Refral creation is handled in register.ts now
            // This function only generates the code
            return code;
        }

        attempts++;
    }

    throw new Error("Failed to generate unique referral code after multiple attempts");
}

/**
 * Validate a referral code and check if it can still be used
 * Returns the referral object if valid and usable, null otherwise
 */
export async function validateReferralCode(code: string) {
    try {
        const referral = await prisma.refral.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!referral) {
            return null;
        }

        // Check if usage limit reached
        if (referral.count >= 5) {
            return null;
        }

        return referral;
    } catch (error) {
        console.error("Error validating referral code:", error);
        return null;
    }
}

/**
 * Increment the usage count of a referral code
 */
export async function incrementReferralUsage(code: string): Promise<boolean> {
    try {
        await prisma.refral.update({
            where: { code: code.toUpperCase() },
            data: {
                count: {
                    increment: 1,
                },
            },
        });
        return true;
    } catch (error) {
        console.error("Error incrementing referral usage:", error);
        return false;
    }
}

/**
 * Create a user referral tracking entry
 */
export async function createUserReferralTracking(
    userId: string,
    referralCodeId: string
): Promise<void> {
    await prisma.userfromrefral.create({
        data: {
            userId,
            refralcodeId: referralCodeId,
        },
    });
}
