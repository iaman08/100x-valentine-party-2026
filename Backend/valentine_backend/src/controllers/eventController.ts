import { Request, Response } from "express";
import prisma from "../db";
import { eventSchema, eventUpdateSchema } from "../utils/validate";

export const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = eventSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ error: validation.error.errors[0].message });
            return;
        }

        const { title, description, date, location, capacity, price, imageUrl, status, visibility } = validation.data;

        // @ts-ignore - user added by middleware
        const organizerId = req.user?.id;

        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                capacity,
                price,
                imageUrl,
                status: status as any || "PUBLISHED",
                visibility: visibility as any || "PUBLIC",
                organizerId,
            },
        });

        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        // Public feed filters
        const events = await prisma.event.findMany({
            where: {
                status: "PUBLISHED",
                visibility: "PUBLIC",
                // Optionally filter by date >= now
                date: {
                    gte: new Date(),
                },
            },
            orderBy: { date: "asc" },
        });
        res.json(events);
    } catch (error) {
        console.error("Get events error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            res.status(404).json({ error: "Event not found" });
            return;
        }

        res.json(event);
    } catch (error) {
        console.error("Get event error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const validation = eventUpdateSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ error: validation.error.errors[0].message });
            return;
        }

        const { date, ...rest } = validation.data;
        const updateData: any = { ...rest };
        if (date) {
            updateData.date = new Date(date);
        }

        const event = await prisma.event.update({
            where: { id },
            data: updateData,
        });

        res.json({ message: "Event updated successfully", event });
    } catch (error) {
        console.error("Update event error:", error);
        if (error.code === "P2025") {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.event.delete({
            where: { id },
        });

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Delete event error:", error);
        if (error.code === "P2025") {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        if (error.code === "P2025") {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getEventAttendees = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                tickets: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phoneNo: true,
                            },
                        },
                    },
                },
            },
        });

        if (!event) {
            res.status(404).json({ error: "Event not found" });
            return;
        }

        // Map tickets to attendees
        const attendees = event.tickets.map((ticket) => ({
            ticketId: ticket.id,
            status: ticket.status,
            user: ticket.user,
        }));

        res.json(attendees);
    } catch (error) {
        console.error("Get attendees error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
