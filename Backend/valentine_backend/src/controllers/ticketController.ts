import { Request, Response } from "express";
import prisma from "../db";
import { ticketSchema } from "../utils/validate";
import { sendTicketEmail } from "../utils/email"; // Reuse existing email utility if compatible or refactor

export const rsvpEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = ticketSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ error: validation.error.errors[0].message });
            return;
        }

        const { eventId } = validation.data;
        // @ts-ignore
        const userId = req.user?.id;

        // Check if user already booked
        const existingTicket = await prisma.ticket.findUnique({
            where: {
                userId_eventId: { userId, eventId }
            }
        });

        if (existingTicket && existingTicket.status !== 'CANCELLED') {
            res.status(400).json({ error: "You already have a ticket for this event" });
            return;
        }

        // Atomic update for capacity
        const updatedCount = await prisma.$executeRaw`
            UPDATE "Event" 
            SET "bookedCount" = "bookedCount" + 1 
            WHERE "id" = ${eventId} AND "bookedCount" < "capacity"
        `;

        if (updatedCount === 0) {
            // Check waitlist
            const existingWaitlist = await prisma.waitlistEntry.findUnique({
                where: { userId_eventId: { userId, eventId } }
            });

            if (!existingWaitlist) {
                await prisma.waitlistEntry.create({
                    data: { userId, eventId }
                });
                res.status(400).json({ error: "Event is full. You have been added to the waitlist." });
                return;
            }

            res.status(400).json({ error: "Event is full and you are already on the waitlist." });
            return;
        }

        // Create Ticket
        await prisma.ticket.create({
            data: {
                userId,
                eventId,
                status: "CONFIRMED",
                qrCode: `${eventId}-${userId}-${Date.now()}`
            },
        });

        res.status(201).json({ message: "Ticket booked successfully" });
    } catch (error) {
        console.error("RSVP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserTickets = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user?.id;

        const tickets = await prisma.ticket.findMany({
            where: { userId },
            include: {
                event: true,
            },
            orderBy: { createdAt: "desc" },
        });

        res.json(tickets);
    } catch (error) {
        console.error("Get user tickets error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const cancelTicket = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.id;

        const ticket = await prisma.ticket.findUnique({
            where: { id },
        });

        if (!ticket) {
            res.status(404).json({ error: "Ticket not found" });
            return;
        }

        if (ticket.userId !== userId) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }

        await prisma.ticket.update({
            where: { id },
            data: { status: "CANCELLED" },
        });

        res.json({ message: "Ticket cancelled successfully" });
    } catch (error) {
        console.error("Cancel ticket error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
