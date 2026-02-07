
import { Router } from "express";
import prisma from "../../db";
import { generateToken } from "../../middleware/middleware/auth";

const router = Router();

router.post("/verify-referral", async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            res.status(400).json({ error: "Referral code is required" });
            return;
        }

        const referral = await prisma.referral.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (referral) {
            // Check if referral code has available uses (limit: 5)
            if (referral.count >= 5) {
                res.status(400).json({
                    valid: false,
                    message: "Referral code has reached maximum usage limit"
                });
                return;
            }

            const token = generateToken({ code: referral.code });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 3600000, // 1 hour
            });
            res.status(200).json({
                valid: true,
                message: "Referral code valid",
                remainingUses: 5 - referral.count
            });
        } else {
            res.status(404).json({ valid: false, message: "Invalid referral code" });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid request" });
    }
});

export default router;
