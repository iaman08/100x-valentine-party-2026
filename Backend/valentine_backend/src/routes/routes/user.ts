import { Router } from "express";
import prisma from "../db";
import { sendTicketEmail } from "../utils/email";
import { authenticateToken } from "../middleware/auth";

const router = Router();
router.post("/submit-user", authenticateToken, async (req, res) => {
  try {
    const { name, email, phoneNo } = req.body;

    if (!name || !email || !phoneNo) {
      res
        .status(400)
        .json({ error: "Name, email, and phone number are required" });
      return;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNo,
        fromrefralcode: true,
      },
    });

    // Send ticket email asynchronously
    await sendTicketEmail(email, { name, email, phoneNo });

    res
      .status(201)
      .json({ message: "User registered and ticket sent successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.post("/check-status", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists in User table (Approved)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return res.status(200).json({ status: "approved", user });
    }

    // Check if user exists in PendingUser table (Pending)
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email },
    });

    if (pendingUser) {
      return res.status(200).json({ status: "pending" });
    }

    // Not found in either (Rejected or never registered)
    return res.status(200).json({ status: "rejected" });
  } catch (error) {
    console.error("Check status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
