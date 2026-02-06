import { Router, type Request, type Response } from "express";
import { sendTelegramMessage } from "../utils/telegram";
import { sendTicketEmail } from "../utils/email";
import { appendToGoogleSheet } from "../utils/googleSheets";
import {
  isCampusEmail,
  validateReferralCode,
  incrementReferralUsage,
  createUniqueReferralCode,
  createUserReferralTracking,
} from "../utils/campusVerifier";
import prisma from "../db";

const router = Router();

// Route to submit a new user - campus detection, referral validation, or pending approval
router.post("/open-user", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, referralCode } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required" });
    }

    // Check if user already exists in User table (approved users)
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNo: phone }] },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    // Check PendingUser table (users awaiting approval)
    const existingPending = await prisma.pendingUser.findFirst({
      where: { OR: [{ email }, { phoneNo: phone }] },
    });

    if (existingPending) {
      return res.status(400).json({ error: "Registration already pending approval" });
    }

    // Check if this is a campus student
    const isCampus = isCampusEmail(email);

    // FLOW 1: Campus Student - Auto Approve
    if (isCampus) {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phoneNo: phone,
          isCampusStudent: true,
          fromrefralcode: false,
        },
      });

      // Generate referral code for campus student
      const generatedCode = await createUniqueReferralCode(newUser.id);

      // Update user with their referral code
      await prisma.user.update({
        where: { id: newUser.id },
        data: { referralCode: generatedCode },
      });

      // Send confirmation email
      await sendTicketEmail(newUser.email, {
        name: newUser.name,
        email: newUser.email,
        phoneNo: newUser.phoneNo,
      });

      // Update Google Sheet
      appendToGoogleSheet(
        name,
        email,
        phone,
        "Approved",
        "Campus - Auto Approved",
        generatedCode
      ).catch(console.error);

      // Send informational Telegram notification
      sendTelegramMessage(
        `🎓 CAMPUS STUDENT (Auto-Approved)\n${name}`,
        email,
        phone,
        newUser.id
      ).catch(console.error);

      return res.status(200).json({
        message: "Campus student approved! Check your email.",
        referralCode: generatedCode,
        approved: true,
      });
    }

    // FLOW 2: Non-Campus with Referral Code - Validate and Auto Approve
    if (referralCode) {
      const validReferral = await validateReferralCode(referralCode);

      if (validReferral) {
        // Auto-approve user with referral code
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            phoneNo: phone,
            fromrefralcode: true,
            isCampusStudent: false,
            referredBy: referralCode.toUpperCase(),
          },
        });

        // Increment referral usage count
        await incrementReferralUsage(referralCode);

        // Create referral tracking
        await createUserReferralTracking(newUser.id, validReferral.id);

        // Send confirmation email
        await sendTicketEmail(newUser.email, {
          name: newUser.name,
          email: newUser.email,
          phoneNo: newUser.phoneNo,
        });

        // Update Google Sheet
        appendToGoogleSheet(
          name,
          email,
          phone,
          "Approved",
          "Referral - Auto Approved",
          referralCode.toUpperCase()
        ).catch(console.error);

        // Send informational Telegram notification
        sendTelegramMessage(
          `✅ REFERRAL (Auto-Approved)\n${name}\nCode: ${referralCode.toUpperCase()}`,
          email,
          phone,
          newUser.id
        ).catch(console.error);

        return res.status(200).json({
          message: "Approved via referral code! Check your email.",
          approved: true,
        });
      } else {
        // Invalid or exhausted referral code - send to manual approval
        const pendingUser = await prisma.pendingUser.create({
          data: {
            name,
            email,
            phoneNo: phone,
            referralCode: referralCode.toUpperCase(),
            isCampusStudent: false,
          },
        });

        await sendTelegramMessage(name, email, phone, pendingUser.id);
        appendToGoogleSheet(
          name,
          email,
          phone,
          "Pending",
          "Invalid Referral - Manual Review",
          referralCode.toUpperCase()
        ).catch(console.error);

        return res.status(200).json({
          message: "Invalid/exhausted referral code. Awaiting manual approval.",
        });
      }
    }

    // FLOW 3: Non-Campus without Referral Code - Manual Approval
    const pendingUser = await prisma.pendingUser.create({
      data: {
        name,
        email,
        phoneNo: phone,
        isCampusStudent: false,
      },
    });

    await sendTelegramMessage(name, email, phone, pendingUser.id);
    appendToGoogleSheet(name, email, phone, "Pending", "No Referral - Manual Review").catch(
      console.error
    );

    res.status(200).json({ message: "Awaiting approval" });
  } catch (error) {
    console.error("Error in /open-user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route called when approved via Telegram - moves user from Pending to User table and sends email
router.post("/approve-telegram", async (req: Request, res: Response) => {
  try {
    const { pendingUserId } = req.body;

    if (!pendingUserId) {
      return res.status(400).json({ error: "pendingUserId is required" });
    }

    // Find pending user
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { id: pendingUserId },
    });

    if (!pendingUser) {
      return res.status(404).json({ error: "Pending user not found" });
    }

    // Create user in User table
    const newUser = await prisma.user.create({
      data: {
        name: pendingUser.name,
        email: pendingUser.email,
        phoneNo: pendingUser.phoneNo,
        fromrefralcode: false,
      },
    });

    // Delete from pending
    await prisma.pendingUser.delete({
      where: { id: pendingUserId },
    });

    // Send confirmation email
    await sendTicketEmail(newUser.email, {
      name: newUser.name,
      email: newUser.email,
      phoneNo: newUser.phoneNo,
    });

    res.status(200).json({ message: "User approved and email sent", user: newUser });
  } catch (error) {
    console.error("Error in /approve-telegram:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Telegram webhook to handle callback queries (button clicks)
router.post("/telegram-webhook", async (req: Request, res: Response) => {
  try {
    const { callback_query } = req.body;

    if (!callback_query) {
      return res.status(200).json({ ok: true });
    }

    const callbackData = callback_query.data;
    const chatId = callback_query.message.chat.id;
    const messageId = callback_query.message.message_id;

    if (callbackData.startsWith("approve_")) {
      const pendingUserId = callbackData.replace("approve_", "");

      // Find and approve the user
      const pendingUser = await prisma.pendingUser.findUnique({
        where: { id: pendingUserId },
      });

      if (!pendingUser) {
        return res.status(200).json({ ok: true, message: "User already processed" });
      }

      // Create user in User table
      const newUser = await prisma.user.create({
        data: {
          name: pendingUser.name,
          email: pendingUser.email,
          phoneNo: pendingUser.phoneNo,
          fromrefralcode: pendingUser.referralCode ? true : false,
          isCampusStudent: pendingUser.isCampusStudent,
          referredBy: pendingUser.referralCode || null,
        },
      });

      // If campus student, generate referral code
      let generatedCode: string | undefined;
      if (pendingUser.isCampusStudent) {
        generatedCode = await createUniqueReferralCode(newUser.id);
        await prisma.user.update({
          where: { id: newUser.id },
          data: { referralCode: generatedCode },
        });
      }

      // Delete from pending
      await prisma.pendingUser.delete({
        where: { id: pendingUserId },
      });

      // Send confirmation email
      await sendTicketEmail(newUser.email, {
        name: newUser.name,
        email: newUser.email,
        phoneNo: newUser.phoneNo,
      });

      // Update Google Sheet
      appendToGoogleSheet(
        pendingUser.name,
        pendingUser.email,
        pendingUser.phoneNo,
        "Approved",
        "Manual - Approved",
        generatedCode || pendingUser.referralCode || undefined
      ).catch(console.error);

      // Update Telegram message to show approval
      const axios = (await import("axios")).default;
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
        {
          chat_id: chatId,
          message_id: messageId,
          text: `✅ *APPROVED*\n\n👤 *Name:* ${pendingUser.name}\n📧 *Email:* ${pendingUser.email}\n📱 *Phone:* ${pendingUser.phoneNo}${generatedCode ? `\n🎟️ *Referral Code:* ${generatedCode}` : ""}`,
          parse_mode: "Markdown",
        }
      );
    } else if (callbackData.startsWith("reject_")) {
      const pendingUserId = callbackData.replace("reject_", "");

      // Delete the pending user
      const pendingUser = await prisma.pendingUser.findUnique({
        where: { id: pendingUserId },
      });

      if (pendingUser) {
        await prisma.pendingUser.delete({
          where: { id: pendingUserId },
        });

        // Update Telegram message to show rejection
        const axios = (await import("axios")).default;
        await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
          {
            chat_id: chatId,
            message_id: messageId,
            text: `❌ *REJECTED*\n\n👤 *Name:* ${pendingUser.name}\n📧 *Email:* ${pendingUser.email}\n📱 *Phone:* ${pendingUser.phoneNo}`,
            parse_mode: "Markdown",
          }
        );

        // Update status in Google Sheet
        appendToGoogleSheet(
          pendingUser.name,
          pendingUser.email,
          pendingUser.phoneNo,
          "Rejected",
          "Manual - Rejected"
        ).catch(console.error);
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error in /telegram-webhook:", error);
    res.status(200).json({ ok: true }); // Always return 200 to Telegram
  }
});

export default router;