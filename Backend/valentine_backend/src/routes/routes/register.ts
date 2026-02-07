import { Router, type Request, type Response } from "express";
import { sendTelegramMessage } from "../../utils/utils/telegram";
import { sendTicketEmail } from "../../utils/utils/email";
import { appendToGoogleSheet } from "../../utils/utils/googleSheets";
import { isCampusEmail, generateReferralCode } from "../../utils/utils/campusVerifier";
import prisma from "../../db";

const router = Router();

/**
 * Registration Endpoint
 * 
 * API Statuses:
 * - approved_student: New campus student, auto-approved with referral code
 * - approved_outsider: New outsider with valid referral, no referral code
 * - login_student: Existing campus student, return ticket with referral
 * - login_outsider: Existing approved outsider, return ticket
 * - pending: Outsider awaiting Telegram approval
 * - invalid_referral: Referral code invalid or exhausted
 */
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, email: rawEmail, phone, referralCode } = req.body;

        // Validate required fields
        if (!name || !rawEmail || !phone) {
            return res.status(400).json({
                status: "error",
                message: "Name, email, and phone are required"
            });
        }

        // Validate phone number - exactly 10 digits
        const digitsOnly = phone.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
            return res.status(400).json({
                status: "error",
                message: "Phone number must be exactly 10 digits"
            });
        }

        // Normalize email to lowercase
        const email = rawEmail.toLowerCase().trim();

        // Check if user is a campus student (from student.txt)
        const isStudent = isCampusEmail(email);

        // ============================================
        // TYPE 1: Registration WITH referral code
        // (Only process if NOT a campus student - campus overrides referral)
        // ============================================
        if (referralCode && !isStudent) {

            // Find the referral code with owner info for self-referral check
            const referral = await prisma.referral.findUnique({
                where: { code: referralCode.toUpperCase() },
                include: { owner: true },
            });

            // Validate referral code exists
            if (!referral) {
                return res.status(400).json({
                    status: "invalid_referral",
                    message: "Invalid referral code",
                });
            }

            // Check usage limit (max 5)
            if (referral.count >= 5) {
                return res.status(400).json({
                    status: "invalid_referral",
                    message: "This referral code has reached its maximum usage limit",
                });
            }

            // Prevent self-referral
            if (referral.owner.email.toLowerCase() === email) {
                return res.status(400).json({
                    status: "invalid_referral",
                    message: "You cannot use your own referral code",
                });
            }

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                // User already approved - treat as login
                return res.status(200).json({
                    status: existingUser.isCampusStudent ? "login_student" : "login_outsider",
                    message: "Welcome back!",
                    ticket: {
                        name: existingUser.name,
                        email: existingUser.email,
                        phone: existingUser.phoneNo,
                        referralCode: existingUser.referralCode || null,
                    },
                });
            }

            // Check if pending
            const pendingUser = await prisma.pendingUser.findUnique({
                where: { email },
            });

            if (pendingUser) {
                return res.status(200).json({
                    status: "pending",
                    message: "Your registration is already pending approval",
                });
            }

            // Create new outsider user with referral (approved immediately)
            // Use transaction to ensure atomic referral increment
            const newUser = await prisma.$transaction(async (tx) => {
                // Increment referral usage atomically
                await tx.referral.update({
                    where: { code: referralCode.toUpperCase() },
                    data: { count: { increment: 1 } },
                });

                // Create user
                return tx.user.create({
                    data: {
                        name,
                        email,
                        phoneNo: phone,
                        isCampusStudent: false,
                        fromrefralcode: true,
                        referralCode: null, // Outsiders don't get referral codes
                        referredBy: referral.owner.email,
                    },
                });
            });

            // Send ticket email
            sendTicketEmail(newUser.email, {
                name: newUser.name,
                email: newUser.email,
                phoneNo: newUser.phoneNo,
            }).catch(console.error);

            // Log to Google Sheet
            appendToGoogleSheet(
                name,
                email,
                phone,
                "Approved",
                "Referral",
                referralCode.toUpperCase()
            ).catch(console.error);

            return res.status(200).json({
                status: "approved_outsider",
                message: "Registration approved! Check your email for your ticket.",
                ticket: {
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phoneNo,
                    referralCode: null, // Outsiders never get referral codes
                },
            });
        }

        // ============================================
        // TYPE 2: Registration WITHOUT referral code
        // (or campus student with referral code - ignored)
        // ============================================

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            // CASE 2.ii or 2.iv: Existing user - treat as login
            return res.status(200).json({
                status: existingUser.isCampusStudent ? "login_student" : "login_outsider",
                message: "Welcome back!",
                ticket: {
                    name: existingUser.name,
                    email: existingUser.email,
                    phone: existingUser.phoneNo,
                    referralCode: existingUser.referralCode || null,
                },
            });
        }

        // Check if pending
        const pendingUser = await prisma.pendingUser.findUnique({
            where: { email },
        });

        if (pendingUser) {
            // Already pending - don't create duplicate
            return res.status(200).json({
                status: "pending",
                message: "Your registration is already pending approval",
            });
        }

        // ============================================
        // CASE 2.i: Campus student (new user)
        // ============================================
        if (isStudent) {
            // Generate unique referral code for campus student
            const newReferralCode = await generateReferralCode();

            // Create campus student user
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    phoneNo: phone,
                    isCampusStudent: true,
                    fromrefralcode: false,
                    referralCode: newReferralCode,
                    referredBy: null,
                },
            });

            // Create the referral record
            await prisma.referral.create({
                data: {
                    code: newReferralCode,
                    ownerId: newUser.id,
                    count: 0,
                },
            });

            // Send ticket email
            sendTicketEmail(newUser.email, {
                name: newUser.name,
                email: newUser.email,
                phoneNo: newUser.phoneNo,
            }).catch(console.error);

            // Log to Google Sheet
            appendToGoogleSheet(
                name,
                email,
                phone,
                "Approved",
                "Campus Student",
                newReferralCode
            ).catch(console.error);

            // Informational Telegram notification (not for approval)
            sendTelegramMessage(
                `🎓 CAMPUS STUDENT (Auto-Approved)\n${name}`,
                email,
                phone,
                newUser.id
            ).catch(console.error);

            return res.status(200).json({
                status: "approved_student",
                message: "Welcome! Your ticket is ready.",
                ticket: {
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phoneNo,
                    referralCode: newReferralCode,
                },
            });
        }

        // ============================================
        // CASE 2.iii: Outsider without referral (pending)
        // ============================================

        // Create pending user
        const newPending = await prisma.pendingUser.create({
            data: {
                name,
                email,
                phoneNo: phone,
            },
        });

        // Log to Google Sheet
        appendToGoogleSheet(
            name,
            email,
            phone,
            "Pending",
            "Outsider - Telegram Approval",
            "N/A"
        ).catch(console.error);

        // Send Telegram approval request
        sendTelegramMessage(
            `🔔 NEW APPROVAL REQUEST\n${name}`,
            email,
            phone,
            newPending.id
        ).catch(console.error);

        return res.status(200).json({
            status: "pending",
            message: "Your registration has been submitted for approval. You will be notified once approved.",
        });

    } catch (error) {
        console.error("Registration error:", error);

        // Handle unique constraint violations
        if ((error as any)?.code === "P2002") {
            return res.status(400).json({
                status: "error",
                message: "This email or phone number is already registered",
            });
        }

        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred. Please try again.",
        });
    }
});

// Legacy /open-user endpoint for backward compatibility with frontend
router.post("/open-user", async (req: Request, res: Response) => {
    try {
        const { name, email: rawEmail, phone, referralCode } = req.body;

        if (!name || !rawEmail || !phone) {
            return res.status(400).json({
                error: "Name, email, and phone are required"
            });
        }

        // Validate phone number - exactly 10 digits
        const digitsOnly = phone.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
            return res.status(400).json({
                error: "Phone number must be exactly 10 digits"
            });
        }

        const email = rawEmail.toLowerCase().trim();
        const isStudent = isCampusEmail(email);

        // Check existing user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(200).json({
                approved: true,
                message: "Welcome back!",
                referralCode: existingUser.referralCode,
            });
        }

        // Check pending
        const pendingUser = await prisma.pendingUser.findUnique({ where: { email } });
        if (pendingUser) {
            return res.status(200).json({
                approved: false,
                message: "Your registration is pending approval",
            });
        }

        // Handle campus student
        if (isStudent) {
            const newReferralCode = await generateReferralCode();

            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    phoneNo: phone,
                    isCampusStudent: true,
                    fromrefralcode: false,
                    referralCode: newReferralCode,
                },
            });

            await prisma.referral.create({
                data: {
                    code: newReferralCode,
                    ownerId: newUser.id,
                    count: 0,
                },
            });

            sendTicketEmail(newUser.email, {
                name: newUser.name,
                email: newUser.email,
                phoneNo: newUser.phoneNo,
            }).catch(console.error);

            appendToGoogleSheet(name, email, phone, "Approved", "Campus Student", newReferralCode).catch(console.error);

            return res.status(200).json({
                approved: true,
                message: "Campus student approved!",
                referralCode: newReferralCode,
            });
        }

        // Handle referral code
        if (referralCode) {
            const referral = await prisma.referral.findUnique({
                where: { code: referralCode.toUpperCase() },
                include: { owner: true },
            });

            if (!referral || referral.count >= 5) {
                return res.status(400).json({
                    error: "Invalid or exhausted referral code",
                });
            }

            if (referral.owner.email.toLowerCase() === email) {
                return res.status(400).json({
                    error: "You cannot use your own referral code",
                });
            }

            const newUser = await prisma.$transaction(async (tx) => {
                await tx.referral.update({
                    where: { code: referralCode.toUpperCase() },
                    data: { count: { increment: 1 } },
                });

                return tx.user.create({
                    data: {
                        name,
                        email,
                        phoneNo: phone,
                        isCampusStudent: false,
                        fromrefralcode: true,
                        referredBy: referral.owner.email,
                    },
                });
            });

            sendTicketEmail(newUser.email, {
                name: newUser.name,
                email: newUser.email,
                phoneNo: newUser.phoneNo,
            }).catch(console.error);

            appendToGoogleSheet(name, email, phone, "Approved", "Referral", referralCode.toUpperCase()).catch(console.error);

            return res.status(200).json({
                approved: true,
                message: "Registration approved!",
            });
        }

        // Outsider without referral - pending approval
        const newPending = await prisma.pendingUser.create({
            data: { name, email, phoneNo: phone },
        });

        appendToGoogleSheet(name, email, phone, "Pending", "Outsider", "N/A").catch(console.error);
        sendTelegramMessage(`🔔 NEW APPROVAL REQUEST\n${name}`, email, phone, newPending.id).catch(console.error);

        return res.status(200).json({
            approved: false,
            message: "Your registration is pending approval",
        });

    } catch (error) {
        console.error("Open-user error:", error);

        if ((error as any)?.code === "P2002") {
            return res.status(400).json({
                error: "This email or phone number is already registered",
            });
        }

        return res.status(500).json({
            error: "Server error",
        });
    }
});

export default router;
