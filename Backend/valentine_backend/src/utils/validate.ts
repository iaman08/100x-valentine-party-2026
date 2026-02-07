import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNo: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const eventSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    location: z.string().min(3, "Location is required"),
    capacity: z.number().int().positive("Capacity must be a positive integer"),
    price: z.number().nonnegative("Price must be non-negative"),
    imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED"]).optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export const eventUpdateSchema = eventSchema.partial();

export const ticketSchema = z.object({
    eventId: z.string().min(1, "Event ID is required"),
});
